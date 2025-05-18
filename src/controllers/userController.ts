import { findUserById } from "../models/userModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";

export const getMe: ExpressHandlerAsync = async (req, res, next) => {
  req.params.userId = String(req.userId);
  next();
};

export const getUser: ExpressHandlerAsync = async (req, res) => {
  const id = parseInt(req.params.userId);
  const user = await findUserById(id);
  if (!user) {
    res.status(404).json({
      success: true,
      message: "user does not exist",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user,
  });
};
