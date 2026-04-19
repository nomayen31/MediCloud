import { Request, Response } from "express";
import { AuthService } from "./auth.service";

interface ISuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    httpStatusCode?: number;
}

interface IErrorResponse {
    success: false;
    message: string;
    error?: string;
    httpStatusCode?: number;
}

type IResponseData<T> = ISuccessResponse<T> | IErrorResponse;

interface BetterAuthError {
    status?: string;
    body?: {
        message?: string;
        code?: string;
    };
    message?: string;
}

const sendResponse = <T>(res: Response, responseData: IResponseData<T>): void => {
    const statusCode = responseData.httpStatusCode || (responseData.success ? 200 : 500);
    res.status(statusCode).json(responseData);
};

const registerPatient = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        // Validate required fields
        if (!payload.name || !payload.email || !payload.password) {
            return sendResponse(res, {
                success: false,
                message: "Name, email, and password are required",
                httpStatusCode: 400
            });
        }

        // Validate password length
        if (payload.password.length < 8) {
            return sendResponse(res, {
                success: false,
                message: "Password must be at least 8 characters long",
                httpStatusCode: 400
            });
        }

        const result = await AuthService.registerPatient(payload);

        sendResponse(res, {
            success: true,
            message: "Patient registered successfully",
            data: result,
            httpStatusCode: 201
        });
    } catch (error: unknown) {
        console.error("Error in registerPatient controller:", error);
        
        // Handle specific BetterAuth errors
        let statusCode = 500;
        let message = "An error occurred while registering the patient";
        let errorMessage = "Unknown error";

        if (isBetterAuthError(error)) {
            if (error.status === "BAD_REQUEST") {
                statusCode = 400;
                message = error.body?.message || "Invalid request";
            } else if (error.status === "UNPROCESSABLE_ENTITY") {
                statusCode = 422;
                message = error.body?.message || "Failed to create user";
            }
            errorMessage = error.body?.message || error.message || "Unknown error";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        sendResponse(res, {
            success: false,
            message: message,
            error: errorMessage,
            httpStatusCode: statusCode
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(res, {
                success: false,
                message: "Email and password are required",
                httpStatusCode: 400
            });
        }

        const result = await AuthService.login({ email, password });

        sendResponse(res, {
            success: true,
            message: "Login successful",
            data: result,
            httpStatusCode: 200
        });
    } catch (error: unknown) {
        console.error("Error in login controller:", error);

        let statusCode = 500;
        let message = "An error occurred during login";
        let errorMessage = "Unknown error";

        if (isBetterAuthError(error)) {
            if (error.status === "BAD_REQUEST" || error.status === "UNAUTHORIZED") {
                statusCode = 401;
                message = "Invalid email or password";
            }
            errorMessage = error.body?.message || error.message || "Unknown error";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        sendResponse(res, {
            success: false,
            message: message,
            error: errorMessage,
            httpStatusCode: statusCode
        });
    }
};

// Type guard for BetterAuth errors
function isBetterAuthError(error: unknown): error is BetterAuthError {
    return (
        typeof error === "object" &&
        error !== null &&
        ("status" in error || "body" in error)
    );
}

export const AuthController = {
    registerPatient,
    login,
};