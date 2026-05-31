import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiCheckCircle, FiBookOpen, FiHelpCircle, FiEdit3, FiBookmark, FiServer } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import apiClient from '../../services/apiClient';

export default function SystemDesignTopicViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [topicData, setTopicData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // notes, questions, quiz
  const [loading, setLoading] = useState(true);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicRes, progressRes] = await Promise.all([
        apiClient.get(`/interview/system-design/topic/${id}`, { withCredentials: true }),
        apiClient.get('/interview/system-design/progress', { withCredentials: true })
      ]);
      setTopicData(topicRes.data);
      setProgress(progressRes.data);
      
      if (progressRes.data.quizScores && progressRes.data.quizScores[id] !== undefined) {
        setQuizSubmitted(true);
        setQuizScore(progressRes.data.quizScores[id]);
      }
    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await axios.post('/api/interview/system-design/progress', { topicId: id }, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleQuizSubmit = async () => {
    if (!topicData?.topic?.quiz) return;
    
    let correct = 0;
    const questions = topicData.topic.quiz.questions;
    questions.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    
    try {
      await axios.post('/api/interview/system-design/quiz', { topicId: id, score }, { withCredentials: true });
      setQuizSubmitted(true);
      setQuizScore(score);
      if (score >= topicData.topic.quiz.passingScore) {
        handleMarkComplete();
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const toggleBookmark = async (type, itemId) => {
    try {
      await axios.post('/api/interview/system-design/bookmark', { type, itemId }, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!topicData || !topicData.topic) return <div className="p-8 text-white">Topic not found</div>;

  const { topic, questions } = topicData;
  const isCompleted = progress?.completedTopics?.includes(topic._id);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/interview/system-design')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-lg hidden sm:block flex items-center gap-2">
              <FiServer className="text-green-500 inline mr-2" />
              {topic.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isCompleted 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              <FiCheckCircle />
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-8 border-t border-white/5 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'notes' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            } flex items-center gap-2`}
          >
            <FiBookOpen /> Architecture Notes
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'questions' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'
            } flex items-center gap-2`}
          >
            <FiHelpCircle /> Interview Questions
            <span className="bg-white/10 text-xs py-0.5 px-2 rounded-full">{questions.length}</span>
          </button>
          {topic.quiz && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'quiz' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'
              } flex items-center gap-2`}
            >
              <FiEdit3 /> Practice Quiz
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {activeTab === 'notes' && topic.notes && (
          <div className="prose prose-invert max-w-none prose-headings:text-[var(--color-primary)] prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[var(--color-primary)] hover:prose-a:text-[var(--color-secondary)] prose-strong:text-white prose-ul:text-gray-300 prose-li:marker:text-[var(--color-primary)]">
            <ReactMarkdown>{topic.notes.content}</ReactMarkdown>
            
            {topic.notes.sections && topic.notes.sections.map((sec, idx) => (
              <div key={idx} className="mt-8">
                <h3 className="text-xl font-bold text-green-300 mb-3">{sec.title}</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{sec.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            {questions.length === 0 ? (
              <p className="text-gray-400">No questions available for this topic yet.</p>
            ) : (
              questions.map(q => {
                const isBookmarked = progress?.bookmarkedQuestions?.includes(q._id);
                return (
                  <div key={q._id} className="bg-[#111] border border-white/10 rounded-2xl p-6 relative group">
                    <button 
                      onClick={() => toggleBookmark('question', q._id)}
                      className="absolute top-6 right-6 text-gray-500 hover:text-green-400 transition-colors"
                    >
                      <FiBookmark className={isBookmarked ? 'fill-green-500 text-green-500' : ''} size={20} />
                    </button>
                    
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        q.difficulty === 'Easy' ? 'bg-blue-500/20 text-blue-400' :
                        q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        q.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400' // Architecture/Scenario
                      }`}>
                        {q.difficulty}
                      </span>
                      {q.companyTags.map(tag => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 pr-8">{q.question}</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-gray-300">
                      <p className="whitespace-pre-wrap">{q.answer}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'quiz' && topic.quiz && (
          <div className="space-y-8">
            {quizSubmitted ? (
              <div className={`p-8 rounded-2xl border text-center ${
                quizScore >= topic.quiz.passingScore 
                  ? 'bg-green-900/20 border-green-500/30' 
                  : 'bg-red-900/20 border-red-500/30'
              }`}>
                <h2 className="text-3xl font-bold mb-2">
                  {quizScore >= topic.quiz.passingScore ? 'System Designed Successfully!' : 'Needs More Iterations!'}
                </h2>
                <p className="text-xl mb-6">You scored {quizScore}%</p>
                <div className="text-sm text-gray-400">Passing score is {topic.quiz.passingScore}%</div>
                
                <button 
                  onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                  className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <>
                <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl mb-8">
                  <h3 className="font-bold text-xl mb-2">{topic.quiz.title}</h3>
                  <p className="text-green-200">Validate your architecture decisions. Passing score: {topic.quiz.passingScore}%</p>
                </div>

                {topic.quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-[#111] p-6 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-lg mb-6">{qIndex + 1}. {q.questionText}</h4>
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => (
                        <label 
                          key={oIndex}
                          className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all ${
                            quizAnswers[qIndex] === oIndex 
                              ? 'bg-green-600/20 border-green-500' 
                              : 'bg-black/40 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${qIndex}`}
                            className="hidden"
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                            quizAnswers[qIndex] === oIndex ? 'border-green-500' : 'border-gray-500'
                          }`}>
                            {quizAnswers[qIndex] === oIndex && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                          </div>
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== topic.quiz.questions.length}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-bold transition-colors"
                >
                  Submit Architecture Quiz
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
