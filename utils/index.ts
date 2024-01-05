import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const connectToDb = async () => {
  try {
    await prisma.$connect();
  } catch (error: any) {
    return new Error(error.message);
  }
};
