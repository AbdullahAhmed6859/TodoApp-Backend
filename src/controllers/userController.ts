import {
  findUserById,
  patchUpdateUserById,
  putUpdateUserById,
} from "../models/userModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { ok } from "../utils/sendResponse";
import { idParams } from "../zod-schemas/common";
import { patchUserSchema, putUserSchema } from "../zod-schemas/userSchemas";

export const getMyId: ExpressHandlerAsync = async (req, res, next) => {
  req.params.id = String(req.userId);
  next();
};

export const getUser = catchAsync(async (req, res, next) => {
  const { id } = idParams.parse(req.params);

  const user = await findUserById(id);

  if (!user) {
    AppError.notFound("User not found");
  }

  return ok(res, { data: { user } });
});

export const putUpdateUser = catchAsync(async (req, res, next) => {
  const { id } = idParams.parse(req.params);
  const data = putUserSchema.parse(req.body);

  const updatedUser = await putUpdateUserById(id, data);

  return ok(res, {
    data: {
      updatedUser,
    },
    message: "User has been updated",
  });
});

export const patchUpdateUser = catchAsync(async (req, res, next) => {
  const { id } = idParams.parse(req.params);
  const data = patchUserSchema.parse(req.body);

  const updatedUser = await patchUpdateUserById(id, data);

  return ok(res, {
    data: {
      updatedUser,
    },
    message: "User has been updated",
  });
});
