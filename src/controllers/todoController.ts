import { ExpressHandlerAsync } from "../types/expressHandlers";
import { ok, serverError, zodBadRequest } from "../utils/sendResponse";
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
    return ok(res, {
      data: {
        userId,
        listId,
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
    return ok(res, {
      data: {
        userId,
        listId,
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
    return ok(res, {
      data: {
        userId,
        listId,
        todoId,
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
    return ok(res, {
      data: {
        userId,
        listId,
        todoId,
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
    return ok(res, {
      data: {
        userId,
        listId,
        todoId,
      },
    });
  } catch (err) {
    console.error(err);
    serverError(res);
  }
};
