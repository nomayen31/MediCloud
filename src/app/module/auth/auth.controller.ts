import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { validateRequest } from "../../middleware/validateRequest";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const registerPatient = validateRequest(async (req: Request, res: Response) => {
    const result = await AuthService.registerPatient(req.body);

    sendResponse(res, {
        success: true,
        message: "Patient registered successfully",
        data: result,
        httpStatusCode: status.CREATED
    });
});

const login = validateRequest(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    sendResponse(res, {
        success: true,
        message: "Login successful",
        data: result,
        httpStatusCode: status.OK
    });
});

export const AuthController = {
    registerPatient,
    login,
};  