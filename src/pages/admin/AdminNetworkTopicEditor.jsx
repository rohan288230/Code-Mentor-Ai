import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiBook, FiHelpCircle, FiEdit3 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminNetworkTopicEditor() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(true);

  // Data States
  const [notes, setNotes] = useState({ content: '', sections: [] });
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState({ title: 'Topic Quiz', passingScore: 70, questions: [] });

  useEffect(() => {
    fetchData();
  }, [topicId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notesRes, questionsRes, quizRes] = await Promise.all([
        apiClient.get(`/admin/network/topic/${topicId}/notes`, { withCredentials: true }),
        apiClient.get(`/admin/network/topic/${topicId}/questions`, { withCredentials: true }),
        apiClient.get(`/admin/network/topic/${topicId}/quiz`, { withCredentials: true })
      ]);
      if (notesRes.data.content) setNotes(notesRes.data);
      setQuestions(questionsRes.data || []);
      if (quizRes.data.questions) setQuiz(quizRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async () => {
    try {
      await axios.post(`/api/admin/network/topic/${topicId}/notes`, notes, { withCredentials: true });
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const saveQuiz = async () => {
    try {
      await axios.post(`/api/admin/network/topic/${topicId}/quiz`, quiz, { withCredentials: true });
      toast.success('Quiz saved successfully');
    } catch (error) {
      toast.error('Failed to save quiz');
    }
  };

  // Questions Handlers
  const addQuestion = async () => {
    const qText = prompt("Enter the question:");
    if (!qText) return;
    try {
      await axios.post(`/api/admin/network/topic/${topicId}/question`, {
        question: qText,
        answer: 'Provide answer here...',
        difficulty: 'Medium',
        companyTags: []
      }, { withCredentials: true });
      fetchData();
      toast.success('Question added');
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  const updateQuestion = async (id, field, value) => {
    try {
      await axios.put(`/api/admin/network/question/${id}`, { [field]: value }, { withCredentials: true });
      fetchData();
    } catch (error) {
      toast.error('Failed to update question');
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`/api/admin/network/question/${id}`, { withCredentials: true });
      fetchData();
      toast.success('Question deleted');
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/admin/network')}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Topic Editor</h1>
        </div>

        <div className="flex gap-4 border-b border-white/10 pb-2 mb-6">
          {[
            { id: 'notes', label: 'Notes', icon: FiBook },
            { id: 'questions', label: 'Interview Questions', icon: FiHelpCircle },
            { id: 'quiz', label: 'Quiz', icon: FiEdit3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Markdown Content</h2>
              <button onClick={saveNotes} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold">
                <FiSave /> Save Notes
              </button>
            </div>
            <textarea
              value={notes.content}
              onChange={e => setNotes({...notes, content: e.target.value})}
              className="w-full h-[600px] bg-[#111] border border-white/10 rounded-xl p-4 font-mono text-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="# Markdown supported..."
            />
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Interview Questions</h2>
              <button onClick={addQuestion} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold">
                <FiPlus /> Add Question
              </button>
            </div>

            {questions.map((q, idx) => (
              <div key={q._id} className="bg-[#111] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-gray-400">Question {idx + 1}</h3>
                  <button onClick={() => deleteQuestion(q._id)} className="text-red-500 hover:text-red-400">
                    <FiTrash2 />
                  </button>
                </div>
                
                <input
                  type="text"
                  defaultValue={q.question}
                  onBlur={e => updateQuestion(q._id, 'question', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                  placeholder="Question text"
                />
                
                <textarea
                  defaultValue={q.answer}
                  onBlur={e => updateQuestion(q._id, 'answer', e.target.value)}
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                  placeholder="Expected Answer"
                />
                
                <div className="flex gap-4">
                  <select 
                    defaultValue={q.difficulty}
                    onChange={e => updateQuestion(q._id, 'difficulty', e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Scenario">Scenario</option>
                  </select>
                  
                  <input
                    type="text"
                    defaultValue={q.companyTags.join(', ')}
                    onBlur={e => updateQuestion(q._id, 'companyTags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                    placeholder="Company Tags (comma separated)"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Practice Quiz</h2>
              <button onClick={saveQuiz} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold">
                <FiSave /> Save Quiz
              </button>
            </div>

            <div className="flex gap-4 bg-[#111] p-6 rounded-xl border border-white/10">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Quiz Title</label>
                <input 
                  type="text" 
                  value={quiz.title}
                  onChange={e => setQuiz({...quiz, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm text-gray-400 mb-1">Passing %</label>
                <input 
                  type="number" 
                  value={quiz.passingScore}
                  onChange={e => setQuiz({...quiz, passingScore: parseInt(e.target.value) || 70})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2"
                />
              </div>
            </div>

            {quiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-[#111] p-6 rounded-xl border border-white/10 space-y-4 relative">
                <button 
                  onClick={() => {
                    const newQ = [...quiz.questions];
                    newQ.splice(qIdx, 1);
                    setQuiz({...quiz, questions: newQ});
                  }}
                  className="absolute top-4 right-4 text-red-500"
                >
                  <FiTrash2 />
                </button>
                
                <h3 className="font-bold text-gray-400">Quiz Question {qIdx + 1}</h3>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={e => {
                    const newQ = [...quiz.questions];
                    newQ[qIdx].questionText = e.target.value;
                    setQuiz({...quiz, questions: newQ});
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                  placeholder="Question text"
                />
                
                <div className="space-y-2 pl-4 border-l-2 border-white/10">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-4 items-center">
                      <input 
                        type="radio" 
                        name={`correct-${qIdx}`} 
                        checked={q.correctAnswerIndex === oIdx}
                        onChange={() => {
                          const newQ = [...quiz.questions];
                          newQ[qIdx].correctAnswerIndex = oIdx;
                          setQuiz({...quiz, questions: newQ});
                        }}
                      />
                      <input 
                        type="text"
                        value={opt}
                        onChange={e => {
                          const newQ = [...quiz.questions];
                          newQ[qIdx].options[oIdx] = e.target.value;
                          setQuiz({...quiz, questions: newQ});
                        }}
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2"
                        placeholder={`Option ${oIdx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={() => setQuiz({
                ...quiz, 
                questions: [...quiz.questions, { questionText: '', options: ['','','',''], correctAnswerIndex: 0 }]
              })}
              className="w-full py-4 border-2 border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/50 rounded-xl transition-all font-bold"
            >
              + Add Quiz Question
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
