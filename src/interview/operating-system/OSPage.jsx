import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBookOpen, FiCheckCircle, FiPlayCircle, FiClock, FiActivity, FiTerminal } from 'react-icons/fi';

export default function OSPage() {
  const [subject, setSubject] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectRes, progressRes] = await Promise.all([
        axios.get('/api/interview/os/topics', { withCredentials: true }),
        axios.get('/api/interview/os/progress', { withCredentials: true })
      ]);
      setSubject(subjectRes.data.subject);
      // Attach topics inside subject for easy rendering
      if(subjectRes.data.subject) {
        subjectRes.data.subject.topics = subjectRes.data.topics;
      }
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching OS data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0a] text-white">
        <h2>Operating System content not found.</h2>
      </div>
    );
  }

  const completedCount = progress?.completedTopics?.length || 0;
  const totalTopics = subject.topics?.length || 0;
  const progressPercent = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <FiTerminal size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-4 font-semibold tracking-wider text-sm uppercase">
              <FiBookOpen />
              <span>Interview Preparation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {subject.title}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mb-8 leading-relaxed">
              {subject.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigate('/interview/os/mock')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <FiPlayCircle className="text-xl" />
                Start Mock Interview
              </button>
              
              <div className="flex items-center gap-6 bg-black/30 px-6 py-3 rounded-xl border border-white/5 ml-auto">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Overall Progress</div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="font-mono font-semibold">{progressPercent}%</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Topics Completed</div>
                  <div className="font-semibold">{completedCount} / {totalTopics}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FiTerminal className="text-emerald-500" />
            OS Roadmap
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.topics?.map((topic, index) => {
              const isCompleted = progress?.completedTopics?.includes(topic._id);
              const quizScore = progress?.quizScores?.find(q => q.quizId === topic._id)?.score; // simplified check
              
              return (
                <div 
                  key={topic._id}
                  onClick={() => navigate(`/interview/os/topic/${topic._id}`)}
                  className="group bg-[#111] border border-white/5 hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:transform hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                      {index + 1}
                    </div>
                    {isCompleted && (
                      <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-emerald-500/20">
                        <FiCheckCircle /> Completed
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                    {topic.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                    <span className="flex items-center gap-1.5">
                      <FiClock /> {topic.estimatedDuration || '45 mins'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiActivity /> {topic.difficulty}
                    </span>
                    {quizScore !== undefined && (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        Score: {quizScore}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
