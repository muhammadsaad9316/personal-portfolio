import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create Prisma client with connection pooling optimizations for Supabase
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'minimal',
    // Datasource configuration for better connection handling
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Helper function to execute database operations with automatic retry
 * Use this for critical operations that may fail due to connection issues
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (e: unknown) {
      const error = e as Error & { code?: string };
      lastError = error;

      // Check if it's a connection/prepared statement error worth retrying
      const isRetryable =
        error.message?.includes('prepared statement') ||
        error.message?.includes('connection') ||
        error.code === 'P1001' ||
        error.code === 'P1002' ||
        error.code === 'P2024';

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Attempt to reconnect
      try {
        await prisma.$disconnect();
        await prisma.$connect();
      } catch {
        // Ignore reconnection errors, we'll try the operation anyway
      }
    }
  }

  throw lastError;
}

// Graceful shutdown handling
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
