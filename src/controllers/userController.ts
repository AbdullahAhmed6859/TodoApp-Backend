import {
  findUserById,
  patchUpdateUserById,
  putUpdateUserById,
} from "../models/userModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import {
  notFound,
  ok,
  serverError,
  zodBadRequest,
} from "../utils/sendResponse";
import { idParams } from "../zodSchemas/common";
import { patchUserSchema, putUserSchema } from "../zodSchemas/userSchemas";

export const getMyId: ExpressHandlerAsync = async (req, res, next) => {
  req.params.id = String(req.userId);
  next();
};

export const getUser: ExpressHandlerAsync = async (req, res) => {
  const result = idParams.safeParse(req.params);
  if (!result.success) return zodBadRequest(res, result);

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

export const putUpdateUser: ExpressHandlerAsync = async (req, res) => {
  const paramsResult = idParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = putUserSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }

  try {
    const updatedUser = await putUpdateUserById(
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

export const patchUpdateUser: ExpressHandlerAsync = async (req, res) => {
  const paramsResult = idParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = patchUserSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }

  try {
    const updatedUser = await patchUpdateUserById(
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
