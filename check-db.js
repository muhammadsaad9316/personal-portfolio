const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    console.log('--- RECENT PROJECTS ---');
    projects.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`Title: ${p.title}`);
        console.log(`Image URL: '${p.imageUrl}'`);
        console.log('-------------------');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
