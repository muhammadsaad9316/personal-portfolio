'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Skills.module.css';
import { CodeModal } from '@/components/ui/CodeModal';
import {
  Binary,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Globe,
  Layers,
  Layout,
  Lock,
  Network,
  ShieldCheck,
  Terminal,
  Star,
  Zap,
  History,
  ChevronRight,
  Trophy
} from 'lucide-react';

import { SKILL_CATEGORIES } from '@/constants/categories';

const CATEGORIES = ['All', ...SKILL_CATEGORIES];

const iconMap: Record<string, any> = {
  'Web Development': Globe,
  'Backend': Database,
  'Frontend': Layout,
  'Full Stack': Layers,
  'Node.js': Terminal,
  'Cybersecurity': ShieldCheck,
  'Network Security': Network,
  'Security+': Lock,
  'React': Code2,
  'Next.js': Binary,
  'TypeScript': FileCode2,
  'BSCS': Cpu,
};

const codeSnippets: Record<string, string> = {
  'React': `
// Modern React with Framer Motion
const UserProfile = ({ user }) => {
  const [active, setActive] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl glass-effect"
    >
      <h3 className="text-xl font-bold">{user.name}</h3>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => setActive(!active)}
      >
        Toggle Status
      </motion.button>
    </motion.div>
  );
};`,
  'Next.js': `
// Next.js 14 Server Actions & Data Fetching
export default async function ProjectPage({ params }) {
  const project = await fetchProject(params.id);

  if (!project) return notFound();

  async function updateProject(formData: FormData) {
    'use server';
    await db.project.update({ 
      where: { id: params.id },
      data: { name: formData.get('name') }
    });
    revalidatePath('/projects');
  }

  return (
    <main className="max-w-4xl mx-auto py-12">
      <h1>{project.title}</h1>
      <form action={updateProject}>
        <input name="name" defaultValue={project.name} />
      </form>
    </main>
  );
}`,
  'Node.js': `
// Scalable Express API with Middleware
const express = require('express');
const app = express();

app.use(express.json());
app.use(errorHandler);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => console.log('Node active'));`,
  'TypeScript': `
// Robust Type Definitions & Generics
interface ApiResponse<T> {
  data: T;
  meta: {
    count: number;
    hasMore: boolean;
  };
}

type ProjectStatus = 'draft' | 'live' | 'archived';

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json();
}

const stats = await fetchData<Project[]>('/api/projects');`
};

// 3D Flip Card Component
const SkillCard = ({ skill, onClick }: { skill: any; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[skill.name] || iconMap[skill.category] || Code2;

  // Spring config for smooth animations
  const springConfig = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={styles.skillCard}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className={styles.cardInner}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={springConfig}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={styles.cardFront}>
          <div className={styles.categoryIcon}>
            <Icon size={16} />
          </div>
          {skill.isNew && <span className={styles.newBadge}>New</span>}
          {skill.proficiency > 90 && <span className={styles.updatedBadge}>Updated</span>}
          <div className={styles.iconWrapper}>
            <Icon size={44} />
          </div>
          <h3 className={styles.skillName}>{skill.name}</h3>
          <div className={styles.proficiencyTag}>
            <Zap size={10} />
            <span>{skill.level}</span>
          </div>
        </div>

        <div className={styles.cardBack}>
          <div className={styles.backStats}>
            <div className={styles.statLine}>
              <History size={14} />
              <span>{skill.yearsOfExp} Yrs Experience</span>
            </div>
            <div className={styles.statLine}>
              <Layers size={14} />
              <span>{skill.projects} Active Projects</span>
            </div>
          </div>

          <div className={styles.proficiencyBox}>
            <div className={styles.proficiencyHeader}>
              <span>Proficiency</span>
              <span>{skill.proficiency}%</span>
            </div>
            <div className={styles.proficiencyTrack}>
              <motion.div
                className={styles.proficiencyFill}
                initial={{ width: 0 }}
                animate={{ width: `${skill.proficiency}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
              <div
                className={styles.industryMarker}
                style={{ left: '75%' }}
                title="Industry Average"
              />
            </div>
          </div>

          <div className={styles.viewCodeBtn}>
            <span>View Snippet</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Skills({ skills }: { skills: any[] }) {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('All');

  // Enriched skill data - Using real backend data
  const enrichedSkills = useMemo(() => skills.map(s => {
    const proficiency = s.proficiency ?? 0;
    return {
      ...s,
      proficiency,
      yearsOfExp: s.yearsOfExperience || 0,
      projects: s.projectCount || 0,
      level: proficiency > 85 ? 'Expert' : proficiency > 70 ? 'Advanced' : 'Intermediate',
      isNew: s.name === 'Next.js' || s.name === 'Cybersecurity'
    };
  }), [skills]);

  const filteredSkills = useMemo(() =>
    activeTab === 'All'
      ? enrichedSkills
      : enrichedSkills.filter(s => s.category.toLowerCase().includes(activeTab.toLowerCase()) || (activeTab === 'Cybersecurity' && s.category === 'Security'))
    , [enrichedSkills, activeTab]);

  const marqueeSkills = [...skills, ...skills];

  return (
    <section id="skills" className={styles.section}>
      <div className="mesh-gradient" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.sectionHeader}
        >
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <p className={styles.sectionDesc}>
            A comprehensive stack focused on performance, security, and exceptional user experience.
          </p>
        </motion.div>

        {/* Tab Filters */}
        <div className={styles.filtersWrapper}>
          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`${styles.filterBtn} ${activeTab === cat ? styles.filterActive : ''}`}
              >
                {cat}
                {activeTab === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className={styles.activeBackground}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Infinite Marquee - Optimized */}
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            {marqueeSkills.map((skill, i) => {
              const Icon = iconMap[skill.name] || iconMap[skill.category] || Code2;
              return (
                <div key={i} className={styles.marqueeItem}>
                  <Icon size={18} className="text-primary" />
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Skill Cards Grid */}
        <motion.div
          layout
          className={styles.grid}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => setSelectedSkill(skill)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <CodeModal
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        title={selectedSkill?.name || ''}
        code={codeSnippets[selectedSkill?.name] || `// Implementation details for $\{selectedSkill?.name\}\n// Standard industry patterns and best practices apply.`}
        language={selectedSkill?.name === 'TypeScript' ? 'typescript' : 'javascript'}
      />
    </section>
  );
}
