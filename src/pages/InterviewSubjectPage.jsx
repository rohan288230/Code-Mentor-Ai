import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import { ChevronLeft, BrainCircuit, BookOpen, Lightbulb, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import apiClient from '../services/apiClient';
import MockInterviewModal from '../components/interview/MockInterviewModal';

const InterviewSubjectPage = () => {
  const { slug } = useParams();
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showMockModal, setShowMockModal] = useState(false);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  useEffect(() => {
    const fetchSubjectAndProgress = async () => {
      try {
        const [subRes, qRes, progRes] = await Promise.all([
          apiClient.get(`/interview/subjects/${slug}`),
          apiClient.get(`/interview/subjects/${slug}/questions`),
          apiClient.get('/interview/progress')
        ]);
        setSubject(subRes.data);
        setQuestions(qRes.data);
        if (progRes.data && progRes.data.bookmarkedQuestions) {
          setBookmarkedIds(new Set(progRes.data.bookmarkedQuestions));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectAndProgress();
  }, [slug]);

  const toggleBookmark = async (questionId) => {
    try {
      const res = await apiClient.post('/interview/bookmark', { questionId });
      setBookmarkedIds(new Set(res.data.bookmarkedQuestions));
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  if (loading || !subject) {
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
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/interview" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
        </motion.div>

        <motion.header 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-black"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white relative z-10 tracking-tight">{subject.title}</h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-2xl relative z-10 leading-relaxed">{subject.description}</p>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <button 
              onClick={() => setShowMockModal(true)}
              className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-colors shadow-xl"
            >
              <BrainCircuit size={20} className="text-[var(--color-primary)]" /> Start AI Mock Interview
            </button>
          </div>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Sticky Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="w-full lg:w-1/4"
          >
            <div className="sticky top-24 glass-card p-6 rounded-2xl border border-white/5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Study Modules</h3>
              <ul className="space-y-2">
                {subject.topics?.map((topic, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => setActiveTopicIndex(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${activeTopicIndex === i ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <span className="truncate pr-2">{topic.title}</span>
                      {activeTopicIndex === i && <ChevronLeft size={16} className="rotate-180" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Main Content Area */}
          <div className="w-full lg:w-3/4 space-y-8">
            
            <motion.div 
              key={activeTopicIndex}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-10 rounded-3xl border border-white/5"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <BookOpen size={24} className="text-[var(--color-primary)]"/> 
                {subject.topics?.[activeTopicIndex]?.title || 'Study Notes'}
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-[15px] text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {subject.topics?.[activeTopicIndex]?.content || <span className="italic text-gray-500">Select a topic to view notes.</span>}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2 px-2">
                <Lightbulb size={20} className="text-yellow-500"/> Practice Questions & MCQs
              </h2>
              <div className="glass-card p-6 md:p-8 rounded-3xl grid gap-4 border border-white/5">
                {questions.map((q, i) => {
                  const isBookmarked = bookmarkedIds.has(q._id);
                  return (
                    <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <CheckCircle2 size={18} className="text-[var(--color-primary)]" />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-semibold text-gray-200 leading-snug mb-2">{q.questionText}</h4>
                            <div className="flex gap-2 items-center">
                              <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-md">{q.type}</span>
                              {q.difficulty && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                                  q.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                  q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                  'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                  {q.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(q._id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                        >
                          {isBookmarked ? <BookmarkCheck size={20} className="text-yellow-500" /> : <Bookmark size={20} />}
                        </button>
                      </div>

                      {q.type === 'MCQ' && q.options && (
                        <div className="mt-3 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className={`p-3 rounded-xl border text-sm font-medium ${optIdx === q.correctOptionIndex ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                              {opt} {optIdx === q.correctOptionIndex && '(Correct)'}
                            </div>
                          ))}
                          {q.aiExplanation && (
                            <div className="col-span-1 sm:col-span-2 mt-2 text-xs text-gray-400 bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl">
                              <strong className="text-blue-400">Explanation:</strong> {q.aiExplanation}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {(q.type === 'Technical' || q.type === 'System Design') && q.expectedAnswer && (
                        <div className="mt-2 pl-8 text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
                          <strong className="text-white">Expected Answer:</strong> {q.expectedAnswer}
                        </div>
                      )}

                    </div>
                  );
                })}
                {questions.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-8">More questions coming soon.</div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {showMockModal && (
        <MockInterviewModal 
          subject={subject} 
          questions={questions.filter(q => q.type !== 'MCQ')} 
          onClose={() => setShowMockModal(false)} 
        />
      )}
    </DashboardLayout>
  );
};

export default InterviewSubjectPage;
