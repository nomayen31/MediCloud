import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendResponse } from "./sendResponse";

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.log(error);
            sendResponse(res, {
                success: false,
                message: "An error occurred",
                error: error instanceof Error ? error.message : "An unknown error occurred",
                httpStatusCode: 500
            });
            next(error);
        }
    };
};