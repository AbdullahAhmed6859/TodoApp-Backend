import { findUserById } from "../models/userModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import { badRequest, duplicate, notFound, ok } from "../utils/sendResponse";

export const getMe: ExpressHandlerAsync = async (req, res, next) => {
  req.params.userId = String(req.userId);
  next();
};

export const getUser: ExpressHandlerAsync = async (req, res) => {
  const id = req.params.userId;
  if (Number.isNaN(id)) {
    return badRequest(res, { userId: ["Invalid User ID"] });
  }

  const user = await findUserById(parseInt(id));
  if (!user) {
    return notFound(res, `User with id:${id}, does not exist`);
  }

  return ok(res, { user });
};
