import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Star, Award, Laptop, Briefcase, ArrowRight, Flame, TrendingUp, Target, Activity, BookOpen } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';
import { ROUTES } from '../constants/routes';

const DashboardPage = () => {
  const { user } = useAuth();
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [courseProgressPercent, setCourseProgressPercent] = useState(0);
  
  // Fetch enrolled courses to show actual progress
  useEffect(() => {
    let cancelled = false;
    const fetchProgress = async () => {
      try {
        const { data } = await apiClient.get('/courses/my-progress');
        if (!cancelled && data?.enrolledCourses?.length > 0) {
          // Get the most recent course
          const courseId = data.enrolledCourses[data.enrolledCourses.length - 1];
          const courseData = await apiClient.get(`/courses/${courseId}`);
          setEnrolledCourse(courseData.data);
          
          const prog = data.courseProgress[courseId];
          if (prog && courseData.data.modules?.length > 0) {
            setCourseProgressPercent(Math.round((prog.completedModules.length / courseData.data.modules.length) * 100));
          }
        }
      } catch (e) {
        console.error("Failed to load course progress", e);
      }
    };
    if (user) fetchProgress();
    return () => { cancelled = true; };
  }, [user]);
  
  // Stats mapped from user
  const stats = {
    solved: user?.solvedProblems || 0,
    total: 450,
    streak: user?.streak || 0,
    acceptanceRate: user?.acceptanceRate || 0,
    rank: user?.globalRanking || 'Unranked',
    mockScore: user?.mockInterviewScore || 0,
    difficulty: {
      easy: { solved: user?.easySolved || 0, total: 150 },
      medium: { solved: user?.mediumSolved || 0, total: 200 },
      hard: { solved: user?.hardSolved || 0, total: 100 }
    },
    topicProgress: user?.topicProgress || []
  };

  // Process activity log for heatmap (last 30 days)
  const heatmapData = useMemo(() => {
    const data = Array(30).fill(0);
    if (!user || !user.activityLog || user.activityLog.length === 0) return data;
    
    const now = new Date();
    now.setHours(0,0,0,0);
    
    user.activityLog.forEach(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0,0,0,0);
      const diffTime = Math.abs(now - logDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        // Increment activity level for that day (capped at 4)
        const idx = 29 - diffDays;
        if (data[idx] < 4) data[idx]++;
      }
    });
    return data;
  }, [user]);

  if (!user) return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading profile...</div>;

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8 pb-12"
      >
        
        {/* Top Header */}
        <header className="flex justify-between items-center flex-wrap gap-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white">Welcome back, {user.name}! 👋</h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <Target size={16} className="text-[var(--color-secondary)]" /> Keep up the great work on your DSA journey.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-xl border border-white/10 text-white relative z-10 backdrop-blur-md">
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
              <Flame size={24} fill="currentColor" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.streak}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Day Streak</div>
            </div>
          </div>
        </header>

        {/* Progress Tracking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Stat Card - Solved Problems */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-1 glass-card p-6 flex flex-col justify-between border-t-4 border-t-[var(--color-primary)]"
          >
            <div>
              <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 mb-6">
                <Code size={16} className="text-[var(--color-primary)]" /> Problems Solved
              </h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-6xl font-black text-white leading-none">{stats.solved}</span>
                <span className="text-gray-500 text-lg font-bold mb-1">/ {stats.total}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mb-6 overflow-hidden">
                <div className="bg-[var(--color-primary)] h-2 rounded-full shadow-[0_0_10px_var(--color-primary)]" style={{ width: `${(stats.solved/stats.total)*100}%` }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
               <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                 <div className="text-green-400 text-xl font-bold">{stats.difficulty.easy.solved}</div>
                 <div className="text-[10px] text-gray-500 uppercase mt-1">Easy</div>
               </div>
               <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                 <div className="text-yellow-400 text-xl font-bold">{stats.difficulty.medium.solved}</div>
                 <div className="text-[10px] text-gray-500 uppercase mt-1">Medium</div>
               </div>
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                 <div className="text-red-400 text-xl font-bold">{stats.difficulty.hard.solved}</div>
                 <div className="text-[10px] text-gray-500 uppercase mt-1">Hard</div>
               </div>
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Acceptance & Rank */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 mb-4">
                  <Activity size={16} className="text-[var(--color-secondary)]" /> Performance
                </h3>
                
                <div className="flex justify-between items-center mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div>
                    <div className="text-gray-400 text-xs uppercase font-bold mb-1">Acceptance Rate</div>
                    <div className="text-3xl font-bold text-white">{stats.acceptanceRate}%</div>
                  </div>
                  {/* CSS Circle Chart */}
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-black/40" style={{ background: `conic-gradient(var(--color-secondary) ${stats.acceptanceRate}%, transparent 0)` }}>
                    <div className="absolute inset-1 bg-[#1e293b] rounded-full"></div>
                    <span className="relative z-10 text-xs font-bold text-white">{stats.acceptanceRate}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                   <div>
                    <div className="text-gray-400 text-xs uppercase font-bold mb-1">Global Ranking</div>
                    <div className="text-3xl font-bold text-white">{typeof stats.rank === 'number' ? `#${stats.rank.toLocaleString()}` : stats.rank}</div>
                  </div>
                  <TrendingUp className="text-green-400" size={32} />
                </div>
              </div>
            </motion.div>

            {/* Heatmap / Activity */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col justify-between">
               <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 mb-4">
                  <Flame size={16} className="text-orange-400" /> Recent Activity (30 Days)
                </h3>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-10 gap-1.5 mb-4">
                    {heatmapData.map((level, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-[3px] ${
                          level === 0 ? 'bg-white/5' :
                          level === 1 ? 'bg-green-500/30' :
                          level === 2 ? 'bg-green-500/50' :
                          level === 3 ? 'bg-green-500/80' :
                          'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                        }`}
                        title={`${level} submissions`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-bold uppercase">
                    <span>Less</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 bg-white/5 rounded-sm"></div>
                      <div className="w-2 h-2 bg-green-500/30 rounded-sm"></div>
                      <div className="w-2 h-2 bg-green-500/50 rounded-sm"></div>
                      <div className="w-2 h-2 bg-green-500/80 rounded-sm"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
            </motion.div>

          </div>
        </div>

        {/* Modules & Courses */}
        <h2 className="text-xl font-bold mt-8 flex justify-between items-center text-white border-b border-white/10 pb-4">
          Continue Learning 
          <Link to={ROUTES.COURSES} className="text-sm text-[var(--color-primary)] flex items-center gap-1 font-medium hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* DSA Module */}
          <div className="module-card group relative flex flex-col gap-4 p-6 bg-gradient-to-b from-[var(--color-card-bg)] to-[#1e293b]/50 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-secondary)] hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Laptop className="text-[var(--color-primary)]" size={20} /> DSA Practice
            </h3>
            
            <div className="space-y-3 mt-2 mb-4">
              {stats.topicProgress.length > 0 ? (
                stats.topicProgress.slice(0, 3).map((topic, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between text-xs mb-1 text-gray-400">
                      <span>{topic.topic}</span>
                      <span className="font-bold text-white">{topic.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" style={{ width: `${topic.percent}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center">Start practicing to see topic progress.</div>
              )}
            </div>

            <Link to={ROUTES.DSA} className="btn btn-primary w-full justify-center mt-auto shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">Continue Practice</Link>
          </div>

          {/* Enrolled Course - Dynamic */}
          {enrolledCourse ? (
            <div className="module-card group relative flex flex-col gap-4 p-6 bg-gradient-to-b from-[var(--color-card-bg)] to-[#1e293b]/50 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Star className="text-amber-500" size={20} fill="currentColor" /> {enrolledCourse.title}
              </h3>
              <p className="text-gray-400 flex-1 text-sm leading-relaxed line-clamp-3">{enrolledCourse.description}</p>
              <div className="mt-2 mb-4">
                <div className="flex justify-between text-xs mb-1.5 text-gray-400">
                  <span>Course Progress</span>
                  <span className="font-bold text-white">{courseProgressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${courseProgressPercent}%` }} />
                </div>
              </div>
              <Link to={`${ROUTES.COURSES}/${enrolledCourse._id}`} className="btn btn-outline w-full justify-center mt-auto border-white/20 text-white hover:bg-white hover:text-black">Resume Course</Link>
            </div>
          ) : (
            <div className="module-card group relative flex flex-col gap-4 p-6 bg-gradient-to-b from-[var(--color-card-bg)] to-[#1e293b]/50 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <BookOpen className="text-amber-500" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Explore Courses</h3>
                  <p className="text-gray-400 text-sm">Enroll in expert-led programming courses to track your progress here.</p>
                </div>
              </div>
              <Link to={ROUTES.COURSES} className="btn btn-outline w-full justify-center mt-auto border-white/20 text-white hover:bg-white hover:text-black">Browse Catalog</Link>
            </div>
          )}

          {/* Resume & Interview */}
          <div className="module-card group relative flex flex-col gap-4 p-6 bg-gradient-to-b from-[var(--color-card-bg)] to-[#1e293b]/50 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-secondary)] hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-pink-600" />
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Briefcase className="text-[var(--color-secondary)]" size={20} /> Interview Prep
            </h3>
            <p className="text-gray-400 flex-1 text-sm leading-relaxed">Prepare for top tech companies with our curated interview questions and ATS-friendly resume builder.</p>
            <div className="flex items-center gap-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/5">
              <Award className="text-pink-400" size={24} />
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase">Mock Score</div>
                <div className="text-lg font-bold text-white">{stats.mockScore}/100</div>
              </div>
            </div>
            <Link to={ROUTES.RESUME} className="btn btn-outline w-full justify-center mt-auto border-white/20 text-white hover:bg-white hover:text-black">Open Resume Builder</Link>
          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;
