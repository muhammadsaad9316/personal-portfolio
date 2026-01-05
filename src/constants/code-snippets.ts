/**
 * Code Snippets for Skills Section
 * 
 * These snippets are displayed when a user clicks on a skill card
 * to demonstrate knowledge of each technology.
 */

export const CODE_SNIPPETS: Record<string, string> = {
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

/**
 * Get a code snippet for a skill name
 * Returns a default message if no snippet exists
 */
export function getCodeSnippet(skillName: string): string {
    return CODE_SNIPPETS[skillName] ||
        `// Implementation details for ${skillName}\n// Standard industry patterns and best practices apply.`;
}
