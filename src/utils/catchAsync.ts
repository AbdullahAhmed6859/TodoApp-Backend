import { Request, Response, NextFunction } from "express";

export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
