import { StatusCodes } from "http-status-codes";
import { AppError } from "./errorHandler";
import e, { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      throw new AppError("Token not provided", StatusCodes.UNAUTHORIZED);
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid token", StatusCodes.UNAUTHORIZED));
  }
};

