import {
  getTodoListsByUser,
  createTodoList,
  deleteTodoList,
} from "../models/todoListsModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import {
  badRequest,
  created,
  deleted,
  notFound,
  ok,
  serverError,
} from "../utils/sendResponse";
import { createListSchema } from "../zodSchemas/todoListsSchemas";

export const getMyLists: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const todoLists = await getTodoListsByUser(userId);
  ok(res, { data: todoLists });
};

export const createMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = createListSchema.safeParse(req.body);
  if (!result.success) {
    return badRequest(res, { errors: result.error.flatten().fieldErrors });
  }
  try {
    const newList = await createTodoList(userId, result.data.title);
    created(res, { data: newList, message: "TodoList created" });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const deleteMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const listId = req.params.id;
  console.log(listId);
  if (Number.isNaN(listId)) {
    return badRequest(res, { errors: { id: ["List Id must be a number"] } });
  }
  try {
    const deletedList = await deleteTodoList(userId, parseInt(listId));
    if (!deletedList) {
      return notFound(res, { message: "List not found" });
    }

    return deleted(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
