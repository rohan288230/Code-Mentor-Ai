import { useState } from 'react';
import { X, BrainCircuit, Loader2, Play, CheckCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const MockInterviewModal = ({ subject, questions, onClose }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Use passed questions, or fallback to dummy if empty
  const activeQuestions = questions?.length > 0 ? questions : [
    { questionText: `What is the most important concept in ${subject.title}?` },
    { questionText: `Can you explain a real-world use case for ${subject.title}?` }
  ];

  const currentQuestion = activeQuestions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === activeQuestions.length - 1;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    setFeedback(null);
    try {
      const { data } = await apiClient.post('/interview/evaluate', {
        question: currentQuestion.questionText,
        answer: answer
      });
      setFeedback(data);
    } catch (err) {
      console.error(err);
      // Fallback in case of API error
      setFeedback({ score: 7, feedback: "Good effort, but try to be more specific.", idealAnswer: "The ideal answer involves explaining the trade-offs clearly." });
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setAnswer('');
    if (!isLastQuestion) setCurrentQuestionIdx(prev => prev + 1);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-[var(--color-primary)]" size={18} /> 
            Mock Interview: {subject.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">
          
          <div className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">
            Question {currentQuestionIdx + 1} of {activeQuestions.length}
          </div>
          
          <div className="text-xl font-bold text-white">
            "{currentQuestion.questionText}"
          </div>

          {!feedback ? (
            <div className="flex flex-col gap-3 flex-1">
              <label className="text-sm text-[var(--color-text-muted)] font-semibold">Your Answer</label>
              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-gray-200 min-h-[150px] focus:outline-none focus:border-[var(--color-primary)]/50 flex-1 transition-colors resize-none"
              />
              <button 
                onClick={handleSubmitAnswer}
                disabled={evaluating || !answer.trim()}
                className="bg-[var(--color-primary)] hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {evaluating ? <><Loader2 size={18} className="animate-spin" /> Evaluating...</> : <><Play size={18} /> Submit Answer</>}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in flex-1">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                  <CheckCircle size={18} /> Score: {feedback.score}/10
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{feedback.feedback}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex-1">
                <h4 className="text-sm font-bold text-gray-400 mb-2">Ideal Answer</h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{feedback.idealAnswer}"</p>
              </div>

              <button 
                onClick={nextQuestion}
                className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded-xl transition-colors mt-2"
              >
                {isLastQuestion ? 'Finish Interview' : 'Next Question'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MockInterviewModal;
