import { Request, Response, NextFunction } from "express";

// Handle 404 Not Found
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Centralized error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
