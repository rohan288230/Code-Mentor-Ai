import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function AdminSystemDesignTopicEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('notes'); // notes, questions, quiz
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Notes State
  const [notesContent, setNotesContent] = useState('');
  
  // Questions State
  const [questions, setQuestions] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '', difficulty: 'Medium', companyTags: '' });

  // Quiz State
  const [quiz, setQuiz] = useState({ title: 'Topic Quiz', passingScore: 70, questions: [] });

  useEffect(() => {
    fetchData();
  }, [id, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'notes') {
        const res = await apiClient.get(`/admin/system-design/topic/${id}/notes`, { withCredentials: true });
        setNotesContent(res.data.content || '');
      } else if (activeTab === 'questions') {
        const res = await apiClient.get(`/admin/system-design/topic/${id}/questions`, { withCredentials: true });
        setQuestions(res.data);
      } else if (activeTab === 'quiz') {
        const res = await apiClient.get(`/admin/system-design/topic/${id}/quiz`, { withCredentials: true });
        if (res.data.questions) {
          setQuiz(res.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await axios.post(`/api/admin/system-design/topic/${id}/notes`, { content: notesContent, sections: [] }, { withCredentials: true });
      alert('Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const tags = newQuestion.companyTags.split(',').map(t => t.trim()).filter(t => t);
      await axios.post(`/api/admin/system-design/topic/${id}/question`, {
        ...newQuestion,
        companyTags: tags
      }, { withCredentials: true });
      
      setIsAddingQuestion(false);
      setNewQuestion({ question: '', answer: '', difficulty: 'Medium', companyTags: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await axios.delete(`/api/admin/system-design/question/${qId}`, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      setSaving(true);
      await axios.post(`/api/admin/system-design/topic/${id}/quiz`, quiz, { withCredentials: true });
      alert('Quiz saved successfully');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const addQuizQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
    });
  };

  const updateQuizQuestion = (index, field, value) => {
    const newQs = [...quiz.questions];
    if (field === 'questionText' || field === 'correctAnswerIndex') {
      newQs[index][field] = value;
    } else {
      // options array update
      newQs[index].options[field] = value;
    }
    setQuiz({ ...quiz, questions: newQs });
  };

  const removeQuizQuestion = (index) => {
    const newQs = [...quiz.questions];
    newQs.splice(index, 1);
    setQuiz({ ...quiz, questions: newQs });
  };

  if (loading && !notesContent && questions.length === 0 && quiz.questions.length === 0) {
    return <div className="p-8 text-center">Loading editor...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/system-design')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Topic Editor</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-4 px-4 font-medium transition-colors border-b-2 ${
            activeTab === 'notes' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Architecture Notes
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-4 px-4 font-medium transition-colors border-b-2 ${
            activeTab === 'questions' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Interview Questions
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-4 px-4 font-medium transition-colors border-b-2 ${
            activeTab === 'quiz' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Practice Quiz
        </button>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'notes' && (
          <div className="grid grid-cols-2 gap-8 h-[600px]">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-gray-300">Markdown Editor</label>
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  <FiSave /> {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <textarea
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
                className="flex-1 w-full bg-[#111] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-green-500 font-mono text-sm resize-none"
                placeholder="# Enter markdown content here..."
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-300 mb-4 block">Live Preview</label>
              <div className="flex-1 bg-[#111] border border-white/10 rounded-xl p-6 overflow-y-auto prose prose-invert prose-green max-w-none">
                <ReactMarkdown>{notesContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Interview Questions</h2>
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FiPlus /> Add Question
              </button>
            </div>

            {isAddingQuestion && (
              <form onSubmit={handleAddQuestion} className="bg-[#111] p-6 rounded-xl border border-white/10 mb-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-green-500 text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Scenario">Scenario</option>
                      <option value="Architecture">Architecture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Company Tags (comma separated)</label>
                    <input
                      type="text"
                      value={newQuestion.companyTags}
                      onChange={(e) => setNewQuestion({ ...newQuestion, companyTags: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-green-500"
                      placeholder="e.g., Google, Netflix, Amazon"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Question</label>
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Expected Answer</label>
                  <textarea
                    value={newQuestion.answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-green-500 h-32"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingQuestion(false)}
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Save Question
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {questions.map(q => (
                <div key={q._id} className="bg-[#111] p-6 rounded-xl border border-white/10 relative group">
                  <button 
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 />
                  </button>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded bg-white/10">{q.difficulty}</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                      {q.companyTags.join(', ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{q.question}</h4>
                  <p className="text-gray-400 whitespace-pre-wrap">{q.answer}</p>
                </div>
              ))}
              {questions.length === 0 && !isAddingQuestion && (
                <p className="text-gray-500 text-center py-8">No questions added yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Quiz Builder</h2>
              <button
                onClick={handleSaveQuiz}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FiSave /> {saving ? 'Saving...' : 'Save Quiz'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Passing Score (%)</label>
                <input
                  type="number"
                  value={quiz.passingScore}
                  onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) })}
                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-[#111] p-6 rounded-xl border border-white/10 relative">
                  <button 
                    onClick={() => removeQuizQuestion(qIndex)}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                  
                  <div className="mb-4 pr-8">
                    <label className="block text-sm text-gray-400 mb-1">Question {qIndex + 1}</label>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => updateQuizQuestion(qIndex, 'questionText', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm text-gray-400 mb-1">Options (Select radio for correct answer)</label>
                    {[0, 1, 2, 3].map(oIndex => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswerIndex === oIndex}
                          onChange={() => updateQuizQuestion(qIndex, 'correctAnswerIndex', oIndex)}
                          className="w-4 h-4 text-green-500 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={q.options[oIndex] || ''}
                          onChange={(e) => updateQuizQuestion(qIndex, oIndex, e.target.value)}
                          className={`flex-1 bg-black/50 border rounded-lg p-2 focus:outline-none ${
                            q.correctAnswerIndex === oIndex ? 'border-green-500' : 'border-white/10 focus:border-gray-500'
                          }`}
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addQuizQuestion}
              className="mt-6 w-full py-4 border-2 border-dashed border-white/20 hover:border-green-500 text-gray-400 hover:text-green-400 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <FiPlus /> Add Multiple Choice Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
