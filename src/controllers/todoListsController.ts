import { findListsByUserId, insertList } from "../models/todoListsModel";
import { ExpressHandlerAsync } from "../types/expressHandlers";
import { createListSchema } from "../zodSchemas/todoListsSchemas";

export const getMyLists: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const todoLists = await findListsByUserId(userId);
  res.status(200).json({
    success: true,
    todoLists,
  });
};

export const createList: ExpressHandlerAsync = async (req, res) => {
  const userId = req.userId as number;
  const result = createListSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ success: false, errors: result.error.flatten().fieldErrors });
    return;
  }
  try {
    const newList = await insertList(userId, result.data.title);
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
