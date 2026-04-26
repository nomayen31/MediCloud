export interface TCustomError extends Error {
  statusCode?: number;
  status?: number;
  code?: string;
  meta?: Record<string, unknown>;
  errors?: unknown;
}

export interface TZodFieldError {
  path: string;
  message: string;
  code?: string;
  expected?: unknown;
  received?: unknown;
  minimum?: unknown;
  maximum?: unknown;
  options?: unknown;
}

export interface TZodErrorDetails {
  summary: string;
  issueCount?: number;
  fields: TZodFieldError[];
}

export interface TErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  errorDetails?: unknown;
  stack?: string;
  timestamp?: string;
  path?: string;
}
