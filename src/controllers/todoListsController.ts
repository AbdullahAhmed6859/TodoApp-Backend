import {
  getTodoListsByUserId,
  createTodoList,
  deleteTodoList,
  updateTodoListForUser,
} from "../models/todoListsModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import {
  created,
  deleted,
  notFound,
  ok,
  serverError,
  zodBadRequest,
} from "../utils/sendResponse";
import { idParams } from "../zodSchemas/common";
import {
  createListSchema,
  updateListSchema,
} from "../zodSchemas/todoListsSchemas";

export const getMyLists: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  try {
    const todoLists = await getTodoListsByUserId(userId);
    ok(res, { data: { todoLists } });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const createMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = createListSchema.safeParse(req.body);
  if (!result.success) {
    return zodBadRequest(res, result);
  }
  try {
    const newList = await createTodoList(userId, result.data);
    created(res, { data: { newList }, message: "TodoList created" });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const updateMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;

  const paramsResult = idParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = updateListSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }

  const updatedList = await updateTodoListForUser(
    userId,
    paramsResult.data.id,
    bodyResult.data
  );

  return ok(res, {
    data: {
      updatedList,
    },
  });
};

export const deleteMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = idParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  try {
    const deletedList = await deleteTodoList(userId, result.data.id);
    if (!deletedList) {
      return notFound(res, { message: "List not found" });
    }

    return deleted(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
