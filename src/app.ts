import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/Routes";


const app : Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/v1", IndexRoutes.router);

// Basic route
app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const speciality = await prisma.speciality.create({
      data: {
        title: "Sexology"
      }
    });
    res.status(201).json({
      success: true,
      data: speciality,
      message: "Speciality created successfully"
    })
  } catch (error) {
    next(error);
  }
});
export default app;