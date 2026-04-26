import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import status from "http-status";

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

function isBetterAuthError(error: unknown): error is BetterAuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("status" in error || "body" in error)
  );
}

const createDoctor = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Validate required fields
    if (!payload.password || !payload.doctor?.name || !payload.doctor?.email || !payload.doctor?.gender) {
      return sendResponse(res, {
        success: false,
        message: "Password, name, email, and gender are required",
        httpStatusCode: status.BAD_REQUEST,
      });
    }

    // Validate password length
    if (payload.password.length < 8) {
      return sendResponse(res, {
        success: false,
        message: "Password must be at least 8 characters long",
        httpStatusCode: status.BAD_REQUEST,
      });
    }

    const result = await UserService.createDoctor(payload);

    sendResponse(res, {
      success: true,
      message: "Doctor registered successfully",
      data: result,
      httpStatusCode: status.CREATED,
    });
  } catch (error: unknown) {
    console.error("Error in createDoctor controller:", error);

    let statusCode = 500;
    let message = "An error occurred while registering the doctor";
    let errorMessage = "Unknown error";

    if (error instanceof Error && error.message.includes("already exists")) {
      statusCode = 409;
      message = error.message;
      errorMessage = error.message;
    } else if (isBetterAuthError(error)) {
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
      httpStatusCode: statusCode,
    });
  }
};

export const DoctorController = {
  createDoctor,
};
