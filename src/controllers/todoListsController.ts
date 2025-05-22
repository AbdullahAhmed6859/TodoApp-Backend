import {
  getTodoListsForUser,
  createTodoListForUser,
  deleteTodoListForUser,
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
  listIdParams,
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
    return created(res, { data: { newList }, message: "TodoList created" });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const updateMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;

  const paramsResult = listIdParams.safeParse(req.params);
  if (!paramsResult.success) {
    return zodBadRequest(res, paramsResult);
  }

  const bodyResult = updateListSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return zodBadRequest(res, bodyResult);
  }

  const updatedList = await updateTodoListForUser(
    userId,
    paramsResult.data.listId,
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
  const result = listIdParams.safeParse(req.params);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  try {
    const deletedList = await deleteTodoListForUser(userId, result.data.listId);
    if (!deletedList) {
      return notFound(res, { message: "List not found" });
    }

    return deleted(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
