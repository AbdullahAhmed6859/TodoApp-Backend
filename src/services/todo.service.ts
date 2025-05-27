import { z } from "zod";
import {
  createTodoSchema,
  patchUpdateTodoSchema,
} from "../zod-schemas/todoSchema";
import { prisma } from "../prismaClient";
import { AppError } from "../utils/AppError";
import { TodoListService } from "./todoList.service";

export class TodoService {
  public static async getAll(userId: number, listId: number) {
    const todoList = await TodoListService.blongsToUser(userId, listId);

    if (!todoList) {
      throw AppError.notFound("Todo list not found or access denied");
    }

    return prisma.todos.findMany({
      where: {
        listId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        done: true,
      },
    });
  }

  public static async create(
    userId: number,
    listId: number,
    data: z.infer<typeof createTodoSchema>
  ) {
    const todoList = await TodoListService.blongsToUser(userId, listId);

    if (!todoList) {
      throw AppError.notFound("Todo list not found or access denied");
    }

    return prisma.todos.create({
      data: {
        listId,
        ...data,
      },
      select: {
        id: true,
        listId: true,
        title: true,
        description: true,
        done: true,
      },
    });
  }

  public static async update(
    userId: number,
    listId: number,
    id: number,
    data: z.infer<typeof patchUpdateTodoSchema>
  ) {
    const todo = await TodoService.belongsToUser(userId, listId, id);

    if (!todo) {
      throw AppError.notFound("Todo not found or access denied");
    }

    return prisma.todos.update({
      where: {
        id,
        listId,
      },
      data,
      select: {
        id: true,
        listId: true,
        title: true,
        description: true,
        done: true,
      },
    });
  }

  public static async delete(userId: number, listId: number, id: number) {
    const todo = await TodoService.belongsToUser(userId, listId, id);

    if (!todo) {
      throw AppError.notFound("Todo not found or access denied");
    }

    return prisma.todos.delete({ where: { id } });
  }

  public static async belongsToUser(
    userId: number,
    listId: number,
    id: number
  ) {
    return prisma.todos.findFirst({
      where: {
        id,
        listId,
        todoLists: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });
  }
}
