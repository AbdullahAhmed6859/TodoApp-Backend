import {
  findUserById,
  patchUpdateUserById,
  putUpdateUserById,
} from "../models/userModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import { catchAsync } from "../utils/catchAsync";
import { notFound, ok, zodBadRequest } from "../utils/sendResponse";
import { idParams } from "../zod-schemas/common";
import { patchUserSchema, putUserSchema } from "../zod-schemas/userSchemas";

export const getMyId: ExpressHandlerAsync = async (req, res, next) => {
  req.params.id = String(req.userId);
  next();
};

export const getUser = catchAsync(async (req, res, next) => {
  const result = idParams.safeParse(req.params);
  if (!result.success) return zodBadRequest(res, result);

  const user = await findUserById(result.data.id);
  if (!user) {
    return notFound(res, { message: "User does not exist" });
  }

  return ok(res, { data: { user } });
});

export const putUpdateUser = catchAsync(async (req, res, next) => {
  const paramsResult = idParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = putUserSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }

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
});

export const patchUpdateUser = catchAsync(async (req, res, next) => {
  const paramsResult = idParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = patchUserSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }

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
});
