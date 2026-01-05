// Quick diagnostic script to check projects
import { prisma } from './src/lib/prisma';

async function checkProjects() {
    console.log('🔍 Checking database for projects...\n');

    try {
        const allProjects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                category: true,
                featured: true,
                status: true,
            }
        });

        console.log(`📊 Total projects in database: ${allProjects.length}\n`);

        if (allProjects.length === 0) {
            console.log('❌ NO PROJECTS EXIST');
            console.log('👉 You need to create projects via /admin/projects\n');
            return;
        }

        const featuredProjects = allProjects.filter(p => p.featured);
        console.log(`⭐ Featured projects: ${featuredProjects.length}\n`);

        if (featuredProjects.length === 0) {
            console.log('❌ NO FEATURED PROJECTS');
            console.log('👉 You need to mark projects as "featured" in admin panel\n');
            console.log('Current projects:');
            allProjects.forEach(p => {
                console.log(`  - ${p.title} (featured: ${p.featured}, category: ${p.category || 'N/A'})`);
            });
            return;
        }

        console.log('✅ Featured projects found:');
        featuredProjects.forEach(p => {
            console.log(`  📁 ${p.category || 'Featured Work'}: ${p.title}`);
        });

        // Group by category
        const categories = new Set(featuredProjects.map(p => p.category || 'Featured Work'));
        console.log(`\n📂 Total folders that should appear: ${categories.size}`);
        console.log('Folders:');
        categories.forEach(cat => {
            const count = featuredProjects.filter(p => (p.category || 'Featured Work') === cat).length;
            console.log(`  - "${cat}" (${count} projects)`);
        });

    } catch (error) {
        console.error('❌ Error connecting to database:', error);
        console.log('\n👉 Did you run "npx prisma generate"?');
    } finally {
        await prisma.$disconnect();
    }
}

checkProjects();
