import { PrismaClient } from "@prisma/client";

declare global {
 // eslint-disable-next-line
 var prisma: PrismaClient | undefined;
}

const prisma =
 global.prisma ||
 new PrismaClient({
  log: ["query", "info"],
 });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
