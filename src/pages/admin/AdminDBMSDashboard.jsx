import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiDatabase } from 'react-icons/fi';

export default function AdminDBMSDashboard() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', description: '', estimatedDuration: '60 Minutes', difficulty: 'Intermediate', order: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectRes, topicsRes] = await Promise.all([
        axios.get('/api/admin/dbms/subject', { withCredentials: true }),
        axios.get('/api/admin/dbms/topics', { withCredentials: true })
      ]);
      setSubject(subjectRes.data);
      setTopics(topicsRes.data);
      if (topicsRes.data.length > 0) {
        setNewTopic(prev => ({ ...prev, order: topicsRes.data.length + 1 }));
      }
    } catch (error) {
      console.error('Error fetching admin DBMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!subject) return;

    try {
      await axios.post('/api/admin/dbms/topic', {
        ...newTopic,
        subjectId: subject._id
      }, { withCredentials: true });
      setIsAddingTopic(false);
      setNewTopic({ title: '', description: '', estimatedDuration: '60 Minutes', difficulty: 'Intermediate', order: topics.length + 2 });
      fetchData();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm('Are you sure you want to delete this topic and all its contents?')) return;
    try {
      await axios.delete(`/api/admin/dbms/topic/${id}`, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiDatabase className="text-blue-500" /> DBMS Editor
          </h1>
          <p className="text-gray-400 mt-2">Manage database topics, interview questions, and quizzes.</p>
        </div>
        <button
          onClick={() => setIsAddingTopic(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <FiPlus /> Add Topic
        </button>
      </div>

      {isAddingTopic && (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mb-8 animate-fadeIn">
          <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
          <form onSubmit={handleAddTopic} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Order</label>
                <input
                  type="number"
                  value={newTopic.order}
                  onChange={(e) => setNewTopic({ ...newTopic, order: parseInt(e.target.value) })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Estimated Duration</label>
                <input
                  type="text"
                  value={newTopic.estimatedDuration}
                  onChange={(e) => setNewTopic({ ...newTopic, estimatedDuration: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 60 Minutes"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                <select
                  value={newTopic.difficulty}
                  onChange={(e) => setNewTopic({ ...newTopic, difficulty: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 h-24"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddingTopic(false)}
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Save Topic
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {topics.map(topic => (
          <div key={topic._id} className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xl">
                {topic.order}
              </div>
              <div>
                <h3 className="text-xl font-bold">{topic.title}</h3>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>{topic.estimatedDuration}</span>
                  <span>•</span>
                  <span>{topic.difficulty}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => navigate(`/admin/dbms/topic/${topic._id}`)}
                className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                title="Edit Content"
              >
                <FiEdit2 />
              </button>
              <button 
                onClick={() => handleDeleteTopic(topic._id)}
                className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Delete Topic"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        {topics.length === 0 && !isAddingTopic && (
          <div className="text-center py-12 bg-[#111] rounded-xl border border-white/5">
            <FiDatabase className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No topics found. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
