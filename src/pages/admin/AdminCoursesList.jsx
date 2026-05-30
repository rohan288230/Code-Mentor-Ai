import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import apiClient from '../../services/apiClient';
import { ROUTES } from '../../constants/routes';
import { Plus, Edit2, Trash2, Loader2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', language: '' });
  const [creating, setCreating] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/admin/courses');
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await apiClient.post('/admin/courses', newCourse);
      toast.success('Course created successfully');
      setShowCreateModal(false);
      setNewCourse({ title: '', description: '', language: '' });
      navigate(`/admin/courses/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to completely delete this course? This action is irreversible.")) {
      try {
        await apiClient.delete(`/admin/courses/${id}`);
        toast.success("Course deleted");
        setCourses(courses.filter(c => c._id !== id));
      } catch (err) {
        toast.error("Failed to delete course");
      }
    }
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-[var(--color-primary)]" /> Admin Course Management
            </h1>
            <p className="text-gray-400">Manage all your independent courses, modules, lessons, and quizzes.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Plus size={20} /> Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-xl text-white font-bold mb-2">No Courses Found</h3>
            <p className="text-gray-400 mb-6">You haven't created any courses yet.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-lg transition-colors border border-white/10"
            >
              Create One Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded">
                      {course.language}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                  
                  <div className="text-sm font-medium text-gray-500 mb-6">
                    {course.modules?.length || 0} Modules
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    to={`/admin/courses/${course._id}`}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-center font-bold py-2.5 rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 size={16} /> Edit Content
                  </Link>
                  <button 
                    onClick={() => handleDeleteCourse(course._id)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                    title="Delete Course"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
                <input 
                  type="text" 
                  required
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  placeholder="e.g. Master C++ Programming"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Language Tags (e.g. C++, Java, Web)</label>
                <input 
                  type="text" 
                  required
                  value={newCourse.language}
                  onChange={e => setNewCourse({...newCourse, language: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  placeholder="e.g. C++"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                  placeholder="A brief overview of the course..."
                ></textarea>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminCoursesList;
