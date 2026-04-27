import dotenv from "dotenv";
import AppError from "../app/errorHealps/appError";


dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
}

// 🔒 Helper function for required env variables
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const rawValue = process.env[key];

  if (rawValue === undefined || rawValue.trim() === '') {
    if (defaultValue !== undefined) return defaultValue;
throw new AppError(
  `❌ Missing required environment variable: ${key}`,
  500
);
  }

  return rawValue;
};
const LoadedEnvVariables = (): EnvConfig => {
  return {
    PORT: Number(getEnvVariable("PORT", "5000")),
    NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
    DATABASE_URL: getEnvVariable("DATABASE_URL"),
    BETTER_AUTH_SECRET: getEnvVariable("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: getEnvVariable("BETTER_AUTH_URL"),
    ACCESS_TOKEN_SECRET: getEnvVariable("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: getEnvVariable("REFRESH_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRES_IN: getEnvVariable("ACCESS_TOKEN_EXPIRES_IN", "15m"),
    REFRESH_TOKEN_EXPIRES_IN: getEnvVariable("REFRESH_TOKEN_EXPIRES_IN", "7d"),
  };
};

export const envVars = LoadedEnvVariables();