
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Prisma connection with explicit datasources config...');
console.log('DATABASE_URL from env:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    // We intentionally ignore log settings to focus on connection
});

async function main() {
    try {
        const projects = await prisma.project.findMany({ take: 1 });
        console.log('Successfully connected! Found projects:', projects.length);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
