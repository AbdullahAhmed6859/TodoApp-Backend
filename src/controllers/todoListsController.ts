import {
  getTodoListsByUser,
  createTodoList,
  deleteTodoList,
} from "../models/todoListsModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import { createListSchema } from "../zodSchemas/todoListsSchemas";

export const getMyLists: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const todoLists = await getTodoListsByUser(userId);
  res.status(200).json({
    success: true,
    todoLists,
  });
};

export const createMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = createListSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ success: false, errors: result.error.flatten().fieldErrors });
    return;
  }
  try {
    const newList = await createTodoList(userId, result.data.title);
    res.status(200).json({
      success: true,
      newList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "server errror",
    });
  }
};

export const deleteMyList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const listId = req.params.id;
  console.log(listId);
  if (Number.isNaN(listId)) {
    res.status(400).json({ success: false, error: "Invalid list ID" });
    return;
  }
  try {
    const deletedList = await deleteTodoList(userId, parseInt(listId));
    if (!deletedList) {
      res.status(404).json({ success: false, error: "List not found" });
      return;
    }
    res.status(204).send();
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "server errror",
    });
  }
};
