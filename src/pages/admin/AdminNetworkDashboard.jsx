import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';

export default function AdminNetworkDashboard() {
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectRes, topicsRes] = await Promise.all([
        axios.get('/api/admin/network/subject', { withCredentials: true }),
        axios.get('/api/admin/network/topics', { withCredentials: true })
      ]);
      setSubject(subjectRes.data);
      setTopics(topicsRes.data);
    } catch (error) {
      console.error('Error fetching admin network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    const title = prompt("Enter Topic Title (e.g. Introduction to Networking):");
    if (!title) return;
    try {
      await axios.post('/api/admin/network/topic', { 
        title, 
        subjectId: subject._id,
        order: topics.length + 1
      }, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to create topic');
    }
  };

  const deleteTopic = async (id) => {
    if (!window.confirm("Are you sure? This deletes the topic and ALL its notes, questions, and quizzes.")) return;
    try {
      await axios.delete(`/api/admin/network/topic/${id}`, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to delete topic');
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-[#111] p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FiBookOpen className="text-blue-500" />
              {subject?.title || 'Computer Networks'} - Admin
            </h1>
            <p className="text-gray-400">Manage Syllabus, Notes, Questions, and Quizzes.</p>
          </div>
          <button 
            onClick={createTopic}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-colors"
          >
            <FiPlus /> Add Topic
          </button>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/40 border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-4 w-16">Order</th>
                <th className="p-4">Title</th>
                <th className="p-4 w-32 text-center">Resources</th>
                <th className="p-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => (
                <tr key={topic._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-500">{topic.order}</td>
                  <td className="p-4 font-semibold text-lg">{topic.title}</td>
                  <td className="p-4 text-center text-sm text-gray-400">
                    {topic.notes && <span className="mr-2 text-green-400">Notes</span>}
                    {topic.quiz && <span className="text-blue-400">Quiz</span>}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/network/topic/${topic._id}`)}
                      className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded-lg transition-colors"
                      title="Edit Content"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      onClick={() => deleteTopic(topic._id)}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors"
                      title="Delete Topic"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {topics.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No topics created yet. Click "Add Topic" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
