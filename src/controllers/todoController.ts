import { ExpressHandlerAsync } from "../types/expressHandlers";
import { ok, serverError, zodBadRequest } from "../utils/sendResponse";
import { listIdParams } from "../zodSchemas/todoListSchemas";
import { todoIdParams } from "../zodSchemas/todoSchema";

export const getMyTodos: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = listIdParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const { listId } = result.data;
  try {
    return ok(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
export const createMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = todoIdParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const { listId, todoId } = result.data;
  try {
    return ok(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
export const putUpdateMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = todoIdParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const { listId, todoId } = result.data;
  try {
    return ok(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
export const patchUpdateMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = todoIdParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const { listId, todoId } = result.data;
  try {
    return ok(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
export const deleteMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = todoIdParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const { listId, todoId } = result.data;
  try {
    return ok(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
