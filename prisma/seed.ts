import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)
    const admin = await prisma.admin.upsert({
        where: { email: 'sd9316841122@gmail.com' },
        update: {
            password,
        },
        create: {
            email: 'sd9316841122@gmail.com',
            name: 'Admin',
            password,
        },
    })
    // 2. Page Content
    await prisma.pageContent.upsert({
        where: { pageSlug_section: { pageSlug: 'home', section: 'hero' } },
        update: {
            content: JSON.stringify({
                title: 'Muhammad Saad',
                subtitle: 'Computer Science Student',
                description: 'Based in Mardan, KP. Passionate about Full Stack Development and Cybersecurity. Currently in 5th Semester BSCS.'
            })
        },
        create: {
            pageSlug: 'home',
            section: 'hero',
            content: JSON.stringify({
                title: 'Muhammad Saad',
                subtitle: 'Computer Science Student',
                description: 'Based in Mardan, KP. Passionate about Full Stack Development and Cybersecurity. Currently in 5th Semester BSCS.'
            })
        }
    })

    await prisma.pageContent.upsert({
        where: { pageSlug_section: { pageSlug: 'home', section: 'about' } },
        update: {
            content: JSON.stringify({
                title: 'About Me',
                bio: '"I am Muhammad Saad, a Computer Science student based in Mardan, KP, with a passion for Full Stack Development and Cybersecurity. Currently in my 5th semester, I specialize in building robust web applications using the MERN stack context (Node.js, Express, MongoDB) combined with Tailwind CSS."',
                education: [
                    { degree: 'Bachelor of Science in Computer Science (BSCS)', status: '5th Semester' }
                ],
                location: 'Mardan, Khyber Pakhtunkhwa (KP), Pakistan'
            })
        },
        create: {
            pageSlug: 'home',
            section: 'about',
            content: JSON.stringify({
                title: 'About Me',
                bio: '"I am Muhammad Saad, a Computer Science student based in Mardan, KP, with a passion for Full Stack Development and Cybersecurity. Currently in my 5th semester, I specialize in building robust web applications using the MERN stack context (Node.js, Express, MongoDB) combined with Tailwind CSS."',
                education: [
                    { degree: 'Bachelor of Science in Computer Science (BSCS)', status: '5th Semester' }
                ],
                location: 'Mardan, Khyber Pakhtunkhwa (KP), Pakistan'
            })
        }
    })

    // 3. Skills
    const skills = [
        { name: 'Full Stack Development', category: 'General', proficiency: 90 },
        { name: 'Node.js', category: 'Backend', proficiency: 85 },
        { name: 'Express.js', category: 'Backend', proficiency: 85 },
        { name: 'MongoDB', category: 'Database', proficiency: 80 },
        { name: 'EJS (Templating)', category: 'Frontend', proficiency: 75 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90 },
        { name: 'CompTIA Security+ Concepts', category: 'Security', proficiency: 60 },
        { name: 'Network Security', category: 'Security', proficiency: 60 }
    ]

    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { name: skill.name },
            update: {},
            create: skill
        })
    }

    // 4. Projects
    await prisma.project.upsert({
        where: { slug: 'zarar-al-oud' },
        update: {
            status: 'Live',
            technologies: 'nodejs,express,mongodb,tailwind',
            caseStudy: JSON.stringify({
                problem: 'Client needed a premium fragrance e-commerce solution with high performance and secure admin management.',
                solution: 'Built a custom Node.js/Express engine with an EJS frontend for SEO efficiency and a custom inventory dashboard.',
                impact: 'Successfully launched the brand online, achieving a 25% increase in seasonal sales through direct digital orders.'
            })
        },
        create: {
            title: 'Zarar AL Oud',
            slug: 'zarar-al-oud',
            description: 'A custom-built e-commerce solution for a niche perfume brand.',
            content: 'Key Features: Secure Admin Panel for real-time inventory and order management. Dynamic frontend using EJS and Tailwind CSS. Brand identity integration.',
            tags: 'Node.js, Express, MongoDB',
            status: 'Live',
            technologies: 'nodejs,express,mongodb,tailwind',
            caseStudy: JSON.stringify({
                problem: 'Client needed a premium fragrance e-commerce solution with high performance and secure admin management.',
                solution: 'Built a custom Node.js/Express engine with an EJS frontend for SEO efficiency and a custom inventory dashboard.',
                impact: 'Successfully launched the brand online, achieving a 25% increase in seasonal sales through direct digital orders.'
            }),
            repoUrl: '#',
            demoUrl: '#',
            imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
            featured: true
        }
    })

    await prisma.project.upsert({
        where: { slug: 'school-management-system' },
        update: {
            status: 'Completed',
            technologies: 'mongodb,express,react,nodejs',
            caseStudy: JSON.stringify({
                problem: 'Manual attendance and grade tracking was causing significant errors and data loss for the administration.',
                solution: 'Implemented a centralized MERN stack platform with role-based access for students, teachers, and admins.',
                impact: 'Digitized records for 500+ students, reducing administrative overhead by approximately 40%.'
            })
        },
        create: {
            title: 'School Management System',
            slug: 'school-management-system',
            description: 'A comprehensive system for managing school operations.',
            content: 'Details to be added.',
            tags: 'MERN Stack',
            status: 'Completed',
            technologies: 'mongodb,express,react,nodejs',
            caseStudy: JSON.stringify({
                problem: 'Manual attendance and grade tracking was causing significant errors and data loss for the administration.',
                solution: 'Implemented a centralized MERN stack platform with role-based access for students, teachers, and admins.',
                impact: 'Digitized records for 500+ students, reducing administrative overhead by approximately 40%.'
            }),
            repoUrl: '#',
            imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop',
            featured: true
        }
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
