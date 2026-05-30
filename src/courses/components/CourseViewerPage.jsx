import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import apiClient from '../../services/apiClient';
import { ROUTES } from '../../constants/routes';
import { Loader2, ArrowLeft, CheckCircle2, ChevronRight, Menu, X, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseViewerPage = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for sidebar mobile toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Active lesson/quiz states
  const [activeType, setActiveType] = useState('lesson'); // 'lesson' or 'quiz'
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/courses/${courseId}`);
        setCourse(data);
        setActiveType('lesson');
        setActiveItemIndex(0);
        setQuizAnswers({});
        setQuizSubmitted(false);
      } catch {
        setError('Failed to load module content.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, moduleId]);

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

  const currentModule = course.modules?.find(m => m._id === moduleId);
  
  if (!currentModule) {
    return (
      <DashboardLayout>
         <div className="max-w-4xl mx-auto py-12 text-center text-gray-400">
           Module not found.
         </div>
      </DashboardLayout>
    );
  }

  const activeLesson = currentModule.lessons?.[activeItemIndex];

  const recordLessonProgress = async (lessonId) => {
    try {
      await apiClient.post(`/courses/${courseId}/progress`, { lessonId });
    } catch {
      console.error('Failed to record lesson progress');
    }
  };

  const handleNext = () => {
    if (activeType === 'lesson') {
      // Mark current lesson as complete
      if (activeLesson) recordLessonProgress(activeLesson._id);

      if (activeItemIndex < (currentModule.lessons?.length || 0) - 1) {
        setActiveItemIndex(prev => prev + 1);
      } else if (currentModule.quiz) {
        setActiveType('quiz');
      } else {
        toast.success("Module Completed!");
        // Mark module as complete with score 0 since no quiz
        apiClient.post(`/courses/${courseId}/progress`, { moduleId: currentModule._id, quizScore: 100 })
          .finally(() => navigate(`${ROUTES.COURSES}/${courseId}`));
      }
    }
  };

  const handlePrev = () => {
    if (activeType === 'quiz') {
      if (currentModule.lessons?.length > 0) {
        setActiveType('lesson');
        setActiveItemIndex(currentModule.lessons.length - 1);
      }
    } else if (activeType === 'lesson' && activeItemIndex > 0) {
      setActiveItemIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    let score = 0;
    currentModule.quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    toast.success(`Quiz Completed! Score: ${score}/${currentModule.quiz.questions.length}`);
    
    // Save quiz score and unlock next module
    try {
      const percentageScore = Math.round((score / currentModule.quiz.questions.length) * 100);
      await apiClient.post(`/courses/${courseId}/progress`, { moduleId: currentModule._id, quizScore: percentageScore });
    } catch {
      console.error('Failed to save quiz score');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full overflow-hidden bg-[var(--color-bg-darker)]">
        
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4 border-b border-white/10 bg-[#0f172a] flex justify-between items-center z-20 shrink-0">
          <Link to={`${ROUTES.COURSES}/${courseId}`} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} /> Course Overview
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div className={`
          absolute md:static inset-0 z-10 bg-[#0f172a] border-r border-white/10 w-full md:w-80 shrink-0 overflow-y-auto custom-scrollbar transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0 mt-16 md:mt-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 hidden md:block border-b border-white/10">
            <Link to={`${ROUTES.COURSES}/${courseId}`} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Course
            </Link>
          </div>
          
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Module Content</h3>
            <div className="space-y-1">
              {currentModule.lessons?.map((lesson, idx) => (
                <button
                  key={lesson._id}
                  onClick={() => { setActiveType('lesson'); setActiveItemIndex(idx); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-start gap-3 transition-colors ${
                    activeType === 'lesson' && activeItemIndex === idx 
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30' 
                      : 'text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Circle size={16} className={`shrink-0 mt-0.5 ${activeType === 'lesson' && activeItemIndex === idx ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium leading-snug">{idx + 1}. {lesson.title}</span>
                </button>
              ))}

              {currentModule.quiz && (
                <button
                  onClick={() => { setActiveType('quiz'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-start gap-3 transition-colors mt-4 ${
                    activeType === 'quiz' 
                      ? 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30' 
                      : 'text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${activeType === 'quiz' ? 'fill-current text-[var(--color-secondary)]' : ''}`} />
                  <span className="text-sm font-medium leading-snug">Module Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative bg-[#020617]">
          <div className="max-w-4xl mx-auto w-full p-6 md:p-12 pb-32">
            
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              {course.title} &nbsp;/&nbsp; {currentModule.title}
            </div>

            {activeType === 'lesson' && activeLesson && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">{activeLesson.title}</h1>
                <div 
                  className="prose prose-invert prose-lg max-w-none text-gray-300 prose-headings:text-white prose-a:text-[var(--color-primary)] prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-white/10"
                  dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                />
              </div>
            )}

            {activeType === 'quiz' && currentModule.quiz && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">{currentModule.quiz.title}</h1>
                
                {quizSubmitted ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-lg text-gray-300">You scored <strong className="text-green-400">{quizScore}</strong> out of {currentModule.quiz.questions.length}</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentModule.quiz.questions.map((q, qIdx) => (
                      <div key={qIdx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">{qIdx + 1}. {q.questionText}</h3>
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                quizAnswers[qIdx] === oIdx 
                                  ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-white' 
                                  : 'bg-black/20 border-white/5 text-gray-300 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  quizAnswers[qIdx] === oIdx ? 'border-[var(--color-primary)]' : 'border-gray-500'
                                }`}>
                                  {quizAnswers[qIdx] === oIdx && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                                </div>
                                {opt}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < currentModule.quiz.questions.length}
                      className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                      Submit Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="fixed bottom-0 left-0 md:left-80 right-0 bg-[#0f172a] border-t border-white/10 p-4 flex justify-between items-center z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button 
              onClick={handlePrev}
              disabled={activeType === 'lesson' && activeItemIndex === 0}
              className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 font-medium px-4 py-2 transition-colors"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            
            {activeType === 'lesson' && (
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-6 py-2 rounded-full transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
            {activeType === 'quiz' && quizSubmitted && (
              <button 
                onClick={() => {
                  toast.success("Module Saved!");
                  navigate(`${ROUTES.COURSES}/${courseId}`);
                }}
                className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 font-bold px-6 py-2 rounded-full transition-colors"
              >
                Complete Module & Return <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseViewerPage;
