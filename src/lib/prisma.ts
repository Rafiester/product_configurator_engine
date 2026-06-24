import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

globalForPrisma.prisma = prisma;

// Pre-warm/establish the connection in the background immediately on container startup
prisma.$connect().catch((err) => {
  console.error('Failed to pre-warm Prisma connection:', err);
});
