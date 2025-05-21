import { findUserById, updateUserById } from "../models/userModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import {
  badRequest,
  duplicate,
  notFound,
  ok,
  serverError,
  zodbadRequest,
} from "../utils/sendResponse";
import { updateUserSchema, userIdParams } from "../zodSchemas/userSchemas";

export const getMyId: ExpressHandlerAsync = async (req, res, next) => {
  req.params.id = String(req.userId);
  next();
};

export const getUser: ExpressHandlerAsync = async (req, res) => {
  const result = userIdParams.safeParse(req.params);
  if (!result.success) return zodbadRequest(res, result);

  try {
    const user = await findUserById(result.data.id);
    if (!user) {
      return notFound(res, { message: "User does not exist" });
    }

    return ok(res, { data: { user } });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const updateUser: ExpressHandlerAsync = async (req, res) => {
  const paramsResult = userIdParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodbadRequest(res, paramsResult);
  }

  const bodyResult = updateUserSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodbadRequest(res, bodyResult);
  }

  try {
    const updatedUser = await updateUserById(
      paramsResult.data.id,
      bodyResult.data
    );

    return ok(res, {
      data: {
        updatedUser,
      },
      message: "User has been updated",
    });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};
