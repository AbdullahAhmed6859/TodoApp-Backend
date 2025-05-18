import { NextFunction, Request, Response } from "express";

export type ExpressHandlerAsync = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
