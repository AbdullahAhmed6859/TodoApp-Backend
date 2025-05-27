import { z } from "zod";
import { prisma } from "../prismaClient";
import {
  createListSchema,
  updateListSchema,
} from "../zod-schemas/todoListSchemas";
import { AppError } from "../utils/AppError";

export class TodoListService {
  public static async getAllByUserId(id: number) {
    return prisma.todoLists.findMany({
      where: { userId: id },
      select: { id: true, title: true },
    });
  }

  public static async create(
    id: number,
    data: z.infer<typeof createListSchema>
  ) {
    return prisma.todoLists.create({
      data: {
        userId: id,
        ...data,
      },
      select: { id: true, title: true },
    });
  }

  public static async delete(userId: number, id: number) {
    const todoList = await TodoListService.blongsToUser(userId, id);

    if (!todoList) {
      throw AppError.notFound("Todo list not found or access denied");
    }
    return prisma.todoLists.delete({ where: { id, userId } });
  }

  public static async update(
    userId: number,
    id: number,
    data: z.infer<typeof updateListSchema>
  ) {
    const todoList = await TodoListService.blongsToUser(userId, id);

    if (!todoList) {
      throw AppError.notFound("Todo list not found or access denied");
    }
    return prisma.todoLists.update({ where: { id, userId }, data });
  }

  public static async blongsToUser(userId: number, id: number) {
    return prisma.todoLists.findUnique({ where: { userId, id } });
  }
}
