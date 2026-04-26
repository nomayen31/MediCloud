/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env.js";
import status from "http-status";
import { ZodError, ZodIssue } from "zod";
import {
  TCustomError,
  TErrorResponse,
  TZodErrorDetails,
  TZodFieldError,
} from "../interface/error.interface.js";

const formatZodIssue = (
  issue: ZodIssue,
  isProduction: boolean
): TZodFieldError => {
  const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "root";
  const details: TZodFieldError = {
    path: fieldPath,
    message: issue.message,
  };

  if (isProduction) {
    return details;
  }

  details.code = issue.code;

  if ("expected" in issue) {
    details.expected = issue.expected;
  }

  if ("received" in issue) {
    details.received = issue.received;
  }

  if ("minimum" in issue) {
    details.minimum = issue.minimum;
  }

  if ("maximum" in issue) {
    details.maximum = issue.maximum;
  }

  if ("options" in issue) {
    details.options = issue.options;
  }

  return details;
};

const formatZodError = (
  error: ZodError,
  isProduction: boolean
): TZodErrorDetails => {
  const fields = error.issues.map((issue) => formatZodIssue(issue, isProduction));

  const details: TZodErrorDetails = {
    summary: `Validation failed for ${fields.length} field${
      fields.length > 1 ? "s" : ""
    }`,
    fields,
  };

  if (!isProduction) {
    details.issueCount = fields.length;
  }

  return details;
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isProduction = envVars.NODE_ENV === "production";
  const timestamp = new Date().toISOString();
  const path = req.path;

  // Log error with full context
  console.error("🔴 Global Error Handler:", {
    timestamp,
    path,
    method: req.method,
    error: err,
  });

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorCode: string | undefined;
  let errorDetails: unknown;
  let stack: string | undefined;

  // ✅ Prisma Known Request Errors
  if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation failed";
    errorCode = "ZOD_VALIDATION_ERROR";
    errorDetails = formatZodError(err, isProduction);
    stack = err.stack;
  } else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    "meta" in err &&
    err.constructor.name === "PrismaClientKnownRequestError"
  ) {
    const prismaErr = err as TCustomError;
    errorCode = prismaErr.code;

    switch (prismaErr.code) {
      case "P2002":
        statusCode = status.CONFLICT;
        message = "A record with this unique field already exists";
        errorDetails = { field: prismaErr.meta?.target };
        break;

      case "P2025":
        statusCode = status.NOT_FOUND;
        message = "Record not found";
        break;

      case "P2003":
        statusCode = status.BAD_REQUEST;
        message = "Foreign key constraint failed";
        errorDetails = { field: prismaErr.meta?.field_name };
        break;

      case "P2014":
        statusCode = status.BAD_REQUEST;
        message = "Invalid ID provided";
        break;

      case "P2022":
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = "Database column does not exist";
        errorDetails = prismaErr.meta;
        break;

      default:
        statusCode = status.BAD_REQUEST;
        message = "Database operation failed";
        errorDetails = prismaErr.meta;
    }
  }
  // ✅ Prisma Validation Errors
  else if (
    typeof err === "object" &&
    err !== null &&
    err.constructor.name === "PrismaClientValidationError"
  ) {
    statusCode = status.BAD_REQUEST;
    message = "Invalid data provided to database";
    errorCode = "VALIDATION_ERROR";
  }
  // ✅ Native JavaScript Errors
  else if (err instanceof Error) {
    const customErr = err as TCustomError;

    if (customErr.errors instanceof ZodError) {
      statusCode = status.BAD_REQUEST;
      message = customErr.message || "Validation failed";
      errorCode = "ZOD_VALIDATION_ERROR";
      errorDetails = formatZodError(customErr.errors, isProduction);
      stack = customErr.stack;
    } else {
      statusCode =
        customErr.statusCode ||
        customErr.status ||
        status.INTERNAL_SERVER_ERROR;

      message = customErr.message || message;
      errorCode = customErr.code;
      stack = customErr.stack;

      // Map specific error names to appropriate responses
      switch (err.name) {
        case "ValidationError":
          statusCode = status.BAD_REQUEST;
          errorCode = "VALIDATION_ERROR";
          break;

        case "JsonWebTokenError":
          statusCode = status.UNAUTHORIZED;
          message = "Invalid authentication token";
          errorCode = "INVALID_TOKEN";
          break;

        case "TokenExpiredError":
          statusCode = status.UNAUTHORIZED;
          message = "Authentication token has expired";
          errorCode = "TOKEN_EXPIRED";
          break;

        case "CastError":
          statusCode = status.BAD_REQUEST;
          message = "Invalid data format";
          errorCode = "CAST_ERROR";
          break;

        case "SyntaxError":
          statusCode = status.BAD_REQUEST;
          message = "Invalid JSON syntax";
          errorCode = "SYNTAX_ERROR";
          break;
      }
    }
  }
  // ✅ Custom Structured Errors (BetterAuth, etc.)
  else if (typeof err === "object" && err !== null) {
    const customErr = err as {
      status?: string;
      statusCode?: number;
      message?: string;
      body?: { message?: string; code?: string };
    };

    // Map string status codes to numeric HTTP status codes
    const statusMap: Record<string, number> = {
      BAD_REQUEST: status.BAD_REQUEST,
      UNAUTHORIZED: status.UNAUTHORIZED,
      FORBIDDEN: status.FORBIDDEN,
      NOT_FOUND: status.NOT_FOUND,
      CONFLICT: status.CONFLICT,
      UNPROCESSABLE_ENTITY: status.UNPROCESSABLE_ENTITY,
      INTERNAL_SERVER_ERROR: status.INTERNAL_SERVER_ERROR,
    };

    if (customErr.status && customErr.status in statusMap) {
      statusCode = statusMap[customErr.status];
    }

    statusCode = customErr.statusCode || statusCode;
    message = customErr.body?.message || customErr.message || message;
    errorCode = customErr.body?.code || errorCode;
  }

  // Build response object
  const response: TErrorResponse = {
    success: false,
    message,
  };

  // Add error code if available
  if (errorCode) {
    response.errorCode = errorCode;
  }

  if (errorDetails && (!isProduction || errorCode === "ZOD_VALIDATION_ERROR")) {
    response.errorDetails = errorDetails;
  }

  // Include detailed info only in development
  if (!isProduction) {
    response.timestamp = timestamp;
    response.path = path;

    if (stack) {
      response.stack = stack;
    }
  }

  // Send response
  res.status(statusCode).json(response);
};
