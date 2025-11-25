import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

  return prismaClient
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
