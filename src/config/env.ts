import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

// 🔒 Helper function for required env variables
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  return value;
};

const LoadedEnvVariables = (): EnvConfig => {
  return {
    PORT: Number(getEnvVariable("PORT", "5000")),
    NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
    DATABASE_URL: getEnvVariable("DATABASE_URL"),
    BETTER_AUTH_SECRET: getEnvVariable("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: getEnvVariable("BETTER_AUTH_URL"),
  };
};

export const envVars = LoadedEnvVariables();