import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError {
    success: false;
    message: string;
    errors?: Array<{
        path: string;
        message: string;
    }>;
    httpStatusCode: number;
}

export class ValidationError extends Error {
    constructor(
        public errors: ZodError,
        message: string = 'Validation failed'
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const zodErrorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));

        const response: ApiError = {
            success: false,
            message: 'Validation failed',
            errors,
            httpStatusCode: 400,
        };

        res.status(400).json(response);
        return;
    }

    // Pass to next error handler if not a Zod error
    if (err instanceof Error) {
        _next(err);
    }
};
