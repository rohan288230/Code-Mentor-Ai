import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import { BookOpen, Code2, Database, Layout, Server, Sparkles, Terminal, Activity, Search, ChevronRight, GitBranch } from 'lucide-react';
import apiClient from '../services/apiClient';

const SUBJECT_ICONS = {
  'dsa': Code2,
  'system-design': Layout,
  'dbms': Database,
  'react': Sparkles,
  'nodejs': Server,
  'os': Terminal,
  'hr': Activity,
  'compiler-design': GitBranch
};

const InterviewDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, progRes] = await Promise.all([
          apiClient.get('/interview/subjects'),
          apiClient.get('/interview/progress')
        ]);
        setSubjects(subRes.data);
        setProgress(progRes.data);
      } catch (err) {
        console.error(err);
        // Fallback dummy data if DB empty
        setSubjects([
          { slug: 'dsa', title: 'Data Structures & Algorithms', description: 'Arrays, Strings, Trees, Graphs, DP' },
          { slug: 'system-design', title: 'System Design', description: 'Scalability, Microservices, CAP Theorem' },
          { slug: 'dbms', title: 'Database Management', description: 'SQL, Normalization, ACID Properties' },
          { slug: 'react', title: 'React.js', description: 'Hooks, Lifecycle, Context, Redux' },
          { slug: 'nodejs', title: 'Node.js', description: 'Event Loop, Express, Streams, APIs' },
          { slug: 'os', title: 'Operating Systems', description: 'Threads, Processes, Deadlocks, Memory' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSubjects = subjects.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold mb-3 text-white tracking-tight">Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Preparation</span></h1>
            <p className="text-lg text-[var(--color-text-muted)] max-w-xl">Master technical concepts, practice real-world questions, and take AI-powered mock interviews.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="w-full md:w-72 relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f172a]/60 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors backdrop-blur-md shadow-lg"
            />
          </motion.div>
        </header>

        {progress && progress.mockInterviewScores?.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-8 rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 relative z-10">
              <Activity size={22} className="text-purple-400"/> Recent Mock Interviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {progress.mockInterviewScores.slice(0, 3).map((score, i) => (
                <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider">{new Date(score.date).toLocaleDateString()}</div>
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-300">
                      {score.score}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 line-clamp-3 leading-relaxed">{score.feedback}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <section>
          <motion.h2 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-8"
          >
            Preparation Modules
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.length > 0 ? filteredSubjects.map((sub, i) => {
              const Icon = SUBJECT_ICONS[sub.slug] || BookOpen;
              return (
                <Link 
                  key={i} 
                  to={`/interview/${sub.slug}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="glass-card p-6 md:p-8 rounded-3xl hover:border-[var(--color-primary)]/40 transition-all cursor-pointer flex flex-col h-full bg-[#0f172a]/80 backdrop-blur-xl shadow-xl group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-blue-600/10 flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform relative z-10">
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{sub.title}</h3>
                    <p className="text-sm text-gray-400 flex-1 leading-relaxed relative z-10">{sub.description}</p>
                    
                    <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center text-sm font-bold text-[var(--color-primary)] relative z-10">
                      <span>Start Module</span>
                      <ChevronRight size={18} className="transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              );
            }) : (
              <div className="col-span-full py-12 text-center text-gray-400 bg-white/5 rounded-3xl border border-white/10">
                <Search size={32} className="mx-auto mb-4 opacity-50" />
                <p>No subjects found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default InterviewDashboard;
