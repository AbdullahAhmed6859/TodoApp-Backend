import {
  getTodoListsForUser,
  createTodoListForUser,
  deleteTodoListForUser,
  updateTodoListForUser,
} from "../models/todoListsModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import {
  conflict,
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
} from "../zodSchemas/todoListSchemas";

export const getMyLists: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  try {
    const todoLists = await getTodoListsForUser(userId);
    return ok(res, {
      data: { todoLists },
      message: "Let's Create Your First Todo List",
    });
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
    const newList = await createTodoListForUser(userId, result.data);
    if (!newList) {
      return conflict(res, "List could not be created");
    }
    return created(res, { data: { newList }, message: "TodoList created" });
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
  const { id: listId } = paramsResult.data;

  const updatedList = await updateTodoListForUser(
    userId,
    listId,
    bodyResult.data
  );

  if (!updatedList) {
    return notFound(res, { message: "List not found" });
  }

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
  const { id: listId } = result.data;

  try {
    const deletedList = await deleteTodoListForUser(userId, listId);
    if (!deletedList) {
      return notFound(res, { message: "List not found" });
    }

    return deleted(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
