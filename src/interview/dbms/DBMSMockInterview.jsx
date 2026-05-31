import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiClock, FiPlayCircle, FiCheckSquare, FiRefreshCw, FiEdit2, FiDatabase } from 'react-icons/fi';
import apiClient from '../../services/apiClient';

export default function DBMSMockInterview() {
  const navigate = useNavigate();
  
  const [difficulty, setDifficulty] = useState('Medium');
  const [inProgress, setInProgress] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // 45 mins
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Whiteboard State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    let timer;
    if (inProgress && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && inProgress) {
      handleComplete(0); // auto submit if time runs out
    }
    return () => clearInterval(timer);
  }, [inProgress, timeLeft]);

  const startInterview = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/interview/dbms/mock-interview?difficulty=${difficulty}&count=3`, { withCredentials: true });
      setQuestions(res.data);
      setInProgress(true);
      setTimeLeft(45 * 60); // 45 minutes
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
      setSessionCompleted(false);
      setShowWhiteboard(false);
    } catch (error) {
      console.error('Error fetching mock interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (points) => {
    setScore(prev => prev + points);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      clearWhiteboard();
    } else {
      handleComplete(points);
    }
  };

  const handleComplete = async (finalPoints = 0) => {
    const finalScore = score + finalPoints;
    const maxScore = questions.length * 10;
    const percentage = Math.round((finalScore / maxScore) * 100);
    
    try {
      await axios.post('/api/interview/dbms/mock-interview/score', {
        score: percentage,
        difficulty
      }, { withCredentials: true });
      
      setScore(percentage);
      setInProgress(false);
      setSessionCompleted(true);
    } catch (error) {
      console.error('Error saving mock interview score:', error);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- Whiteboard Logic ---
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  // ------------------------

  if (sessionCompleted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-lg w-full text-center">
          <FiCheckSquare className="text-6xl text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">Mock Interview Completed</h2>
          <p className="text-gray-400 mb-6">Difficulty: {difficulty}</p>
          
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 mb-8">
            <div className="text-sm text-gray-500 mb-2">Your DBMS Score</div>
            <div className={`text-5xl font-bold ${score >= 70 ? 'text-blue-500' : 'text-yellow-500'}`}>
              {score}%
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/interview/dbms')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-semibold"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => { setSessionCompleted(false); startInterview(); }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (inProgress && questions.length > 0) {
    const q = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 z-40">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg text-gray-300">Question {currentQuestionIndex + 1} / {questions.length}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold bg-white/10 border border-white/5`}>
                {q.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xl bg-blue-500/10 px-4 py-1.5 rounded-lg border border-blue-500/20">
              <FiClock />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Side */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">{q.question}</h2>
              
              <div className="flex gap-2 mb-8 flex-wrap">
                {q.companyTags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              {!showAnswer ? (
                <button 
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-xl transition-colors font-semibold"
                >
                  Reveal Expected Answer
                </button>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-black/50 p-6 rounded-xl border border-white/5">
                    <h4 className="text-blue-400 font-semibold mb-3">Expected Answer:</h4>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{q.answer}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-300">Self Evaluation: How well did you do?</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button onClick={() => handleNext(0)} className="py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-xl text-red-400 font-semibold transition-colors">
                        Missed it completely (0)
                      </button>
                      <button onClick={() => handleNext(5)} className="py-3 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 rounded-xl text-yellow-400 font-semibold transition-colors">
                        Partially Correct (5)
                      </button>
                      <button onClick={() => handleNext(10)} className="py-3 bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 rounded-xl text-green-400 font-semibold transition-colors">
                        Nailed it! (10)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Whiteboard Side */}
          <div className="bg-[#111] border border-white/10 rounded-2xl flex flex-col h-[600px] overflow-hidden relative">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30">
              <h3 className="font-bold flex items-center gap-2">
                <FiEdit2 className="text-blue-500" /> DBMS Whiteboard
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={clearWhiteboard}
                  className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-md transition-colors"
                >
                  Clear Board
                </button>
                <button 
                  onClick={() => setShowWhiteboard(!showWhiteboard)}
                  className="text-xs px-3 py-1.5 bg-white/10 text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  {showWhiteboard ? 'Hide' : 'Show'} Whiteboard
                </button>
              </div>
            </div>
            
            {showWhiteboard ? (
              <div className="flex-1 bg-[#1a1a1a] cursor-crosshair relative">
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={550}
                  className="absolute top-0 left-0 w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                <FiDatabase size={48} className="mb-4 opacity-50 text-blue-500" />
                <p>Use the whiteboard to sketch out your ER Diagrams, schemas, and query structures.</p>
                <button 
                  onClick={() => setShowWhiteboard(true)}
                  className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg"
                >
                  Open Whiteboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Setup Screen
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <button 
        onClick={() => navigate('/interview/dbms')}
        className="absolute top-8 left-8 p-3 hover:bg-white/10 rounded-full transition-colors"
      >
        <FiArrowLeft size={24} />
      </button>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg shadow-blue-500/20">
            <FiPlayCircle size={32} className="text-white ml-1" />
          </div>
          <h1 className="text-3xl font-bold mb-3">DBMS Mock Interview</h1>
          <p className="text-gray-400">Simulate a real database engineering interview with whiteboard support.</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4 text-gray-300">Select Difficulty</h3>
          <div className="grid grid-cols-1 gap-3">
            {['Beginner', 'Medium', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  difficulty === diff 
                    ? 'bg-blue-600/20 border-blue-500' 
                    : 'bg-black/50 border-white/5 hover:border-white/20'
                }`}
              >
                <span className={`font-semibold ${difficulty === diff ? 'text-blue-400' : 'text-gray-300'}`}>{diff}</span>
                {difficulty === diff && <FiCheckSquare className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startInterview}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>Start Interview (45 Mins)</>
          )}
        </button>
      </div>
    </div>
  );
}
