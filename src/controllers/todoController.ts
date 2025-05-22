import {
  createTodoForAList,
  deleteTodoOfAList,
  getTodosOfAList,
  patchUpdateTodoOfAList,
  putUpdateTodoOfAList,
} from "../models/todoModel";
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
import { listIdParams } from "../zodSchemas/todoListSchemas";
import {
  createTodoSchema,
  patchUpdateTodoSchema,
  putUpdateTodoSchema,
  todoIdParams,
} from "../zodSchemas/todoSchema";

export const getMyTodos: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;

  const resultParams = listIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const { listId } = resultParams.data;

  try {
    const todos = await getTodosOfAList(userId, listId);
    return ok(res, {
      data: {
        todos,
      },
    });
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};

export const createMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;

  const resultParams = listIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const resultBody = createTodoSchema.safeParse(req.body);
  if (!resultBody.success) {
    return zodBadRequest(res, resultBody);
  }

  const { listId } = resultParams.data;
  try {
    const newTodo = await createTodoForAList(userId, listId, resultBody.data);

    if (!newTodo) {
      return conflict(res, "Todo Could not be created");
    }

    return created(res, {
      data: {
        newTodo,
      },
    });
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};

export const putUpdateMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;

  const resultParams = todoIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const resultBody = putUpdateTodoSchema.safeParse(req.body);
  if (!resultBody.success) {
    return zodBadRequest(res, resultBody);
  }

  const { listId, todoId } = resultParams.data;
  try {
    const updatedTodo = await putUpdateTodoOfAList(
      userId,
      listId,
      todoId,
      resultBody.data
    );
    if (!updatedTodo) {
      return notFound(res);
    }

    return ok(res, {
      data: {
        updatedTodo,
      },
    });
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};

export const patchUpdateMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;

  const resultParams = todoIdParams.safeParse(req.params);
  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const resultBody = patchUpdateTodoSchema.safeParse(req.body);
  if (!resultBody.success) {
    return zodBadRequest(res, resultBody);
  }

  const { listId, todoId } = resultParams.data;
  try {
    const updatedTodo = await patchUpdateTodoOfAList(
      userId,
      listId,
      todoId,
      resultBody.data
    );
    if (!updatedTodo) {
      return notFound(res);
    }

    return ok(res, {
      data: {
        updatedTodo,
      },
    });
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};

export const deleteMyTodo: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const resultParams = todoIdParams.safeParse(req.params);

  if (!resultParams.success) {
    return zodBadRequest(res, resultParams);
  }

  const { listId, todoId } = resultParams.data;
  try {
    const deletedTodo = await deleteTodoOfAList(userId, listId, todoId);
    if (!deletedTodo) {
      return notFound(res, { message: "Todo not found" });
    }

    return deleted(res);
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
