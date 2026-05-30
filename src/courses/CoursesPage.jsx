import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import apiClient from '../services/apiClient';
import { ROUTES } from '../constants/routes';
import { BookOpen, ChevronRight, Loader2, PlayCircle, Trophy } from 'lucide-react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState({ enrolledCourses: [], courseProgress: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [courseRes, progRes] = await Promise.all([
          apiClient.get('/courses'),
          apiClient.get('/courses/my-progress')
        ]);
        if (!cancelled) {
          setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
          setProgressData(progRes.data);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load courses. Please try again later.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const calculateProgress = (course) => {
    const prog = progressData.courseProgress[course._id];
    if (!prog || !course.modules || course.modules.length === 0) return 0;
    
    // Calculate based on completed modules vs total modules
    const totalModules = course.modules.length;
    const completedModules = prog.completedModules?.length || 0;
    return Math.round((completedModules / totalModules) * 100);
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8 pb-12"
      >
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <BookOpen className="text-[var(--color-primary)]" size={32} />
              All Courses
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2">
              Browse learning paths and modules. Progress syncs with your dashboard.
            </p>
          </div>
          <Link
            to={ROUTES.DSA}
            className="btn btn-outline py-2 px-4 text-sm self-start sm:self-auto border-white/20 text-white hover:bg-white hover:text-black inline-flex items-center gap-2"
          >
            DSA Practice <ChevronRight size={16} />
          </Link>
        </header>

        {loading && (
          <div className="flex justify-center py-24 text-[var(--color-primary)]">
            <Loader2 size={40} className="animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="glass-card p-8 text-center text-red-400 border border-red-500/20">{error}</div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="glass-card p-10 text-center text-[var(--color-text-muted)] border border-white/10">
            <p className="mb-4">No published courses yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const isEnrolled = progressData.enrolledCourses.includes(course._id);
              const progressPercentage = calculateProgress(course);
              
              return (
                <Link
                  key={course._id}
                  to={`${ROUTES.COURSES}/${course._id}`}
                  className="glass-card p-6 border border-white/10 flex flex-col gap-3 hover:border-[var(--color-primary)]/40 hover:-translate-y-1 transition-all relative overflow-hidden group"
                >
                  {isEnrolled && (
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                      <Trophy size={80} className="text-[var(--color-primary)] -mt-6 -mr-4" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <h2 className="text-xl font-bold text-white">{course.title}</h2>
                    <span className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded bg-[var(--color-primary)]/15 text-[var(--color-primary)] shrink-0">
                      {course.language}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[var(--color-text-muted)] flex-1 relative z-10">{course.description}</p>
                  
                  {isEnrolled ? (
                    <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">Your Progress</span>
                        <span className="text-xs font-bold text-white">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
                        <div className="bg-[var(--color-primary)] h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{course.modules?.length ?? 0} Modules</span>
                        <span className="text-sm font-bold text-white flex items-center gap-1 group-hover:text-[var(--color-primary)] transition-colors">
                          <PlayCircle size={16} /> Continue Learning
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-4 relative z-10">
                      <div className="text-xs text-gray-500">
                        {course.modules?.length ?? 0} module{(course.modules?.length ?? 0) === 1 ? '' : 's'}
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-primary)] flex items-center gap-1">
                        View Course <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default CoursesPage;
