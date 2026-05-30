import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import apiClient from '../../services/apiClient';
import { ROUTES } from '../../constants/routes';
import { ArrowLeft, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCourseEditor = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/admin/courses/${courseId}`);
      setCourse(data);
    } catch (err) {
      toast.error('Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // MODULE OPERATIONS
  const handleAddModule = async () => {
    const title = window.prompt("Enter module title:");
    if (!title) return;
    try {
      await apiClient.post('/admin/modules', {
        courseId,
        title,
        description: 'New module description',
        order: course.modules.length + 1
      });
      toast.success("Module added");
      fetchCourse();
    } catch (err) {
      toast.error("Failed to add module");
    }
  };

  const handleDeleteModule = async (modId) => {
    if (window.confirm("Delete this module and all its lessons/quizzes?")) {
      try {
        await apiClient.delete(`/admin/modules/${modId}`);
        toast.success("Module deleted");
        fetchCourse();
      } catch (err) {
        toast.error("Failed to delete module");
      }
    }
  };

  // LESSON OPERATIONS
  const handleAddLesson = async (moduleId) => {
    const title = window.prompt("Enter lesson title:");
    if (!title) return;
    try {
      await apiClient.post('/admin/lessons', {
        moduleId,
        title,
        content: 'Lesson content goes here...',
        order: 1
      });
      toast.success("Lesson added");
      fetchCourse();
    } catch (err) {
      toast.error("Failed to add lesson");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Delete this lesson?")) {
      try {
        await apiClient.delete(`/admin/lessons/${lessonId}`);
        toast.success("Lesson deleted");
        fetchCourse();
      } catch (err) {
        toast.error("Failed to delete lesson");
      }
    }
  };

  // QUIZ OPERATIONS
  const handleAddQuiz = async (moduleId) => {
    const title = window.prompt("Enter quiz title:");
    if (!title) return;
    try {
      await apiClient.post('/admin/quizzes', {
        moduleId,
        title,
        passingScore: 70,
        questions: [{ questionText: "Sample Question?", options: ["A","B","C","D"], correctAnswerIndex: 0 }]
      });
      toast.success("Quiz added");
      fetchCourse();
    } catch (err) {
      toast.error("Failed to add quiz");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Delete this quiz?")) {
      try {
        await apiClient.delete(`/admin/quizzes/${quizId}`);
        toast.success("Quiz deleted");
        fetchCourse();
      } catch (err) {
        toast.error("Failed to delete quiz");
      }
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-[60vh] text-[var(--color-primary)]">
        <Loader2 size={40} className="animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-12 px-6">
        <Link to="/admin/courses" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Admin Courses
        </Link>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2">{course.title}</h1>
              <p className="text-gray-400">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Curriculum Modules</h2>
          <button 
            onClick={handleAddModule}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors border border-white/10"
          >
            <Plus size={18} /> Add Module
          </button>
        </div>

        <div className="space-y-4">
          {course.modules?.map((mod, idx) => (
            <div key={mod._id} className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
              <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedModule(expandedModule === mod._id ? null : mod._id)}
              >
                <div className="flex items-center gap-4">
                  {expandedModule === mod._id ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                  <h3 className="text-lg font-bold text-white">Module {idx + 1}: {mod.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod._id); }}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {expandedModule === mod._id && (
                <div className="p-5 pt-0 border-t border-white/5 bg-black/40">
                  <div className="mt-4 mb-2 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Lessons</h4>
                    <button 
                      onClick={() => handleAddLesson(mod._id)}
                      className="text-xs text-[var(--color-primary)] hover:text-white flex items-center gap-1 bg-[var(--color-primary)]/10 px-2 py-1 rounded"
                    >
                      <Plus size={14} /> Add Lesson
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {mod.lessons?.map((les, lIdx) => (
                      <div key={les._id} className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl p-3">
                        <span className="text-sm text-gray-300 font-medium">{lIdx + 1}. {les.title}</span>
                        <button 
                          onClick={() => handleDeleteLesson(les._id)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(!mod.lessons || mod.lessons.length === 0) && (
                      <div className="text-sm text-gray-600 italic">No lessons added yet.</div>
                    )}
                  </div>

                  <div className="mt-6 mb-2 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quiz</h4>
                    {!mod.quiz && (
                      <button 
                        onClick={() => handleAddQuiz(mod._id)}
                        className="text-xs text-[var(--color-secondary)] hover:text-white flex items-center gap-1 bg-[var(--color-secondary)]/10 px-2 py-1 rounded"
                      >
                        <Plus size={14} /> Add Quiz
                      </button>
                    )}
                  </div>

                  {mod.quiz ? (
                    <div className="flex justify-between items-center bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 rounded-xl p-3">
                      <span className="text-sm text-[var(--color-secondary)] font-medium">Quiz: {mod.quiz.title}</span>
                      <button 
                        onClick={() => handleDeleteQuiz(mod.quiz._id)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 italic">No quiz added yet.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCourseEditor;
