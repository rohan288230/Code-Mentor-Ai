import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import apiClient from '../../services/apiClient';
import { ROUTES } from '../../constants/routes';
import { BookOpen, Loader2, ArrowLeft, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const [courseRes, progRes] = await Promise.all([
          apiClient.get(`/courses/${courseId}`),
          apiClient.get('/courses/my-progress')
        ]);
        setCourse(courseRes.data);
        setProgressData(progRes.data);
      } catch {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndProgress();
  }, [courseId]);

  const handleEnrollAndStart = async (moduleId) => {
    if (enrolling) return;
    if (!progressData?.enrolledCourses?.includes(courseId)) {
      setEnrolling(true);
      try {
        const res = await apiClient.post(`/courses/${courseId}/enroll`);
        if (res.data?.success || res.data?.message === 'Enrolled successfully') {
          toast.success("Successfully enrolled!");
          // Update local state so it knows it's enrolled immediately
          setProgressData(prev => ({
            ...prev,
            enrolledCourses: [...(prev?.enrolledCourses || []), courseId]
          }));
        }
      } catch (err) {
        console.error("Enrollment error:", err);
        toast.error(err.response?.data?.error || "Failed to enroll");
        setEnrolling(false);
        return;
      } finally {
        setEnrolling(false);
      }
    }
    navigate(`${ROUTES.COURSES}/${courseId}/module/${moduleId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh] text-[var(--color-primary)]">
          <Loader2 size={40} className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12">
          <Link to={ROUTES.COURSES} className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
            {error || 'Course not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isEnrolled = progressData?.enrolledCourses.includes(courseId);
  const courseProg = progressData?.courseProgress?.[courseId] || { completedModules: [], completedLessons: [] };
  
  // Find first uncompleted module
  let firstUncompletedModuleId = course.modules?.[0]?._id;
  for (const mod of course.modules || []) {
    if (!courseProg.completedModules.includes(mod._id)) {
      firstUncompletedModuleId = mod._id;
      break;
    }
  }

  // Calculate progress %
  const totalModules = course.modules?.length || 0;
  const completedCount = courseProg.completedModules.length;
  const progressPercentage = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-6">
        <Link to={ROUTES.COURSES} className="text-gray-400 hover:text-white flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)]/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] mb-6">
              {course.language}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed">
              {course.description}
            </p>

            {isEnrolled && (
              <div className="w-full max-w-md mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">Course Progress</span>
                  <span className="text-sm font-bold text-[var(--color-primary)]">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {firstUncompletedModuleId ? (
                <button 
                  onClick={() => handleEnrollAndStart(firstUncompletedModuleId)}
                  disabled={enrolling}
                  className="bg-white text-black font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {enrolling ? <Loader2 size={20} className="animate-spin" /> : <PlayCircle size={20} />} 
                  {isEnrolled ? (progressPercentage > 0 ? "Continue Learning" : "Start Learning") : "Enroll & Start"}
                </button>
              ) : (
                <button disabled className="bg-green-500/20 text-green-400 border border-green-500/30 font-bold px-8 py-3.5 rounded-full flex items-center gap-2">
                  <CheckCircle2 size={20} /> Course Completed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen size={24} className="text-[var(--color-primary)]" /> Course Syllabus
          </h2>
          
          <div className="space-y-4">
            {course.modules?.map((module, idx) => {
              const isCompleted = courseProg.completedModules.includes(module._id);
              // Simple sequential unlock logic: module is locked if previous module is not completed
              const isLocked = idx > 0 && !courseProg.completedModules.includes(course.modules[idx-1]._id);

              return (
                <div key={module._id} className={`border rounded-2xl p-6 transition-colors ${isCompleted ? 'bg-green-500/5 border-green-500/20' : isLocked ? 'bg-black/40 border-white/5 opacity-60' : 'bg-black/20 border-white/10 hover:border-[var(--color-primary)]/30'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold shrink-0 ${isCompleted ? 'bg-green-500/20 border-green-500 text-green-400' : isLocked ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-white/5 border-white/20 text-white'}`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={16} /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                          {module.title}
                          {isLocked && <span className="text-[10px] uppercase tracking-wider bg-white/10 text-gray-400 px-2 py-0.5 rounded">Locked</span>}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1"><BookOpen size={14} /> {module.lessons?.length || 0} Lessons</span>
                          {module.quiz && <span className="flex items-center gap-1 text-[var(--color-secondary)]"><CheckCircle2 size={14} /> Quiz Included</span>}
                          {isCompleted && courseProg.quizScores?.[module._id] !== undefined && (
                            <span className="flex items-center gap-1 text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded">
                              Score: {courseProg.quizScores[module._id]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleEnrollAndStart(module._id)}
                      disabled={isLocked || enrolling}
                      className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full sm:w-auto ${isCompleted ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30' : (isLocked || enrolling) ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                    >
                      {enrolling ? <Loader2 size={16} className="animate-spin mx-auto" /> : isCompleted ? 'Review Module' : isLocked ? 'Locked' : 'Start Module'}
                    </button>
                  </div>
                </div>
              );
            })}

            {(!course.modules || course.modules.length === 0) && (
              <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                Modules are currently being mapped for this course.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailsPage;
