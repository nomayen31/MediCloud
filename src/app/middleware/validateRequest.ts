import { NextFunction, Request, RequestHandler, Response } from "express";
import z from "zod";
import { catchAsync } from "../shared/catchAsync";
import { createDoctorZodSchema } from "../module/user/user.validation";

export const validateRequest = (
  schemaOrHandler: z.ZodTypeAny | RequestHandler
): RequestHandler => {
  if (typeof schemaOrHandler === "function" && !("safeParse" in schemaOrHandler)) {
    return catchAsync(schemaOrHandler);
  }

  const schema = schemaOrHandler as z.ZodTypeAny;

  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      return next(parsed.error);
    }

    const validated = parsed.data as {
      body?: Request["body"];
      params?: Request["params"];
      query?: Request["query"];
    };

    if (validated.body !== undefined) req.body = validated.body;
    if (validated.params !== undefined) req.params = validated.params;
    if (validated.query !== undefined) req.query = validated.query;

    next();
  };
};

// Existing route middleware kept for compatibility.
export const validateCreateDoctor = validateRequest(
  z.object({
    body: createDoctorZodSchema,
  })
);
