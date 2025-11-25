import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        const url = process.env.DATABASE_URL || 'undefined';
        console.log('DATABASE_URL:', url.replace(/:[^:]*@/, ':****@'));
        console.log('Connecting to database...');
        const count = await prisma.product.count();
        console.log('Successfully connected. Product count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
