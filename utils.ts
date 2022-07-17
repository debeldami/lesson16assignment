import { Request, Response } from "express";

const asyncHandler = (fn: any) => (req: Request, res: Response) =>
  Promise.resolve(fn(req, res));

export { asyncHandler };
