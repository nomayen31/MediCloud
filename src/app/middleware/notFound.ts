/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../../config/env.js";

interface NotFoundResponse {
  success: false;
  message: string;
  errorCode?: string;
  timestamp?: string;
  path?: string;
  method?: string;
}

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isProduction = envVars.NODE_ENV === "production";
  const statusCode = status.NOT_FOUND;
  const timestamp = new Date().toISOString();

  const response: NotFoundResponse = {
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    errorCode: "ROUTE_NOT_FOUND",
  };

  // Add debugging info only in development
  if (!isProduction) {
    response.timestamp = timestamp;
    response.path = req.path;
    response.method = req.method;
  }

  console.warn("⚠️  Route Not Found:", {
    method: req.method,
    path: req.path,
    timestamp,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(statusCode).json(response);
};
