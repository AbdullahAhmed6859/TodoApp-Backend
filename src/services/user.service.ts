import { z } from "zod";
import {
  patchUserSchema,
  signupSchema,
  userId,
} from "../zod-schemas/userSchemas";
import bcrypt from "bcrypt";
import { prisma } from "../prismaClient";

export class UserService {
  public static async create(userDetails: z.infer<typeof signupSchema>) {
    const { firstName, lastName, email, password } = userDetails;
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.users.create({
      data: { firstName, lastName, email, password: hashedPassword },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  public static async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
    });
  }

  public static async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  public static async update(
    id: number,
    data: z.infer<typeof patchUserSchema>
  ) {
    return prisma.users.update({
      where: { id },
      data,
      select: { firstName: true, lastName: true, email: true },
    });
  }

  public static async findById(id: z.infer<typeof userId>) {
    return prisma.users.findUnique({
      where: { id },
      select: { firstName: true, lastName: true, email: true },
    });
  }
}
