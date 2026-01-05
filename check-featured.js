const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('\n=== CHECKING FEATURED PROJECTS ===\n');

    // Get all projects
    const allProjects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total Projects in Database: ${allProjects.length}\n`);

    // Get featured projects
    const featuredProjects = await prisma.project.findMany({
        where: { featured: true },
        orderBy: { order: 'asc' }
    });

    console.log(`⭐ Featured Projects: ${featuredProjects.length}\n`);

    if (featuredProjects.length === 0) {
        console.log('❌ NO FEATURED PROJECTS FOUND!\n');
        console.log('This is why folders are not showing up.\n');
        console.log('All projects and their featured status:');
        allProjects.forEach(p => {
            console.log(`  - "${p.title}"`);
            console.log(`    Featured: ${p.featured}`);
            console.log(`    Category: "${p.category}"`);
            console.log(`    ID: ${p.id}\n`);
        });
    } else {
        console.log('✅ Featured projects found:\n');

        // Group by category
        const categories = {};
        featuredProjects.forEach(p => {
            const cat = p.category || 'Featured Work';
            if (!categories[cat]) {
                categories[cat] = [];
            }
            categories[cat].push(p);
        });

        console.log(`📂 Number of Folders (Categories): ${Object.keys(categories).length}\n`);

        Object.entries(categories).forEach(([category, projects]) => {
            console.log(`\n📁 Folder: "${category}" (${projects.length} project${projects.length === 1 ? '' : 's'})`);
            projects.forEach(p => {
                console.log(`   - ${p.title}`);
                console.log(`     Image: ${p.imageUrl || 'NO IMAGE'}`);
                console.log(`     Demo: ${p.demoUrl || 'NO DEMO'}`);
            });
        });
    }
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
