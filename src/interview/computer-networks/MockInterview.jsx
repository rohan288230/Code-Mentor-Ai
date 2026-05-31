import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiClock, FiCheck, FiX, FiRefreshCcw } from 'react-icons/fi';
import apiClient from '../../services/apiClient';

export default function MockInterview() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('Beginner'); // Beginner, Intermediate, Advanced
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && started && !finished) {
      handleNext(false); // Time up -> wrong answer basically
    }
    return () => clearInterval(timer);
  }, [timeLeft, started, finished]);

  const startInterview = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/interview/computer-networks/mock-interview?difficulty=${difficulty}&count=5`, { withCredentials: true });
      if (res.data.length === 0) {
        alert("Not enough questions available for this difficulty yet!");
        setLoading(false);
        return;
      }
      setQuestions(res.data);
      setCurrentIndex(0);
      setScore(0);
      setShowAnswer(false);
      setFinished(false);
      setTimeLeft(120); // 2 minutes per question
      setStarted(true);
    } catch (error) {
      console.error('Error fetching mock questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (correct) => {
    if (correct) setScore(prev => prev + 1);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setTimeLeft(120);
    } else {
      setFinished(true);
      // save score
      const finalScore = Math.round(((score + (correct ? 1 : 0)) / questions.length) * 100);
      try {
        await axios.post('/api/interview/computer-networks/mock-interview/score', { score: finalScore, difficulty }, { withCredentials: true });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <button onClick={() => navigate('/interview/computer-networks')} className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2">
          <FiArrowLeft /> Back
        </button>
        
        <div className="bg-[#111] p-10 rounded-3xl border border-white/10 max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-3xl">
            <FiCheck />
          </div>
          <h1 className="text-3xl font-bold mb-4">Mock Interview Mode</h1>
          <p className="text-gray-400 mb-8">
            Test your knowledge under pressure. You will be asked 5 random questions based on your selected difficulty. You have 2 minutes per question.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-3 rounded-xl border font-semibold transition-all ${
                  difficulty === level 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
          >
            {loading ? 'Loading...' : 'Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-[#111] p-10 rounded-3xl border border-white/10 max-w-lg w-full text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-2">Interview Completed</h2>
          <p className="text-gray-400 mb-8">Difficulty: {difficulty}</p>
          
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
            {finalScore}%
          </div>
          
          <p className="text-xl mb-8">
            You answered {score} out of {questions.length} questions correctly.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/interview/computer-networks')}
              className="flex-1 py-4 bg-black/50 hover:bg-black/80 rounded-xl border border-white/10 font-bold transition-colors"
            >
              Exit
            </button>
            <button
              onClick={startInterview}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <FiRefreshCcw /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-400 font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
            <FiClock /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex gap-2 mb-6">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
              {currentQ.difficulty}
            </span>
            {currentQ.companyTags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          
          <h2 className="text-3xl font-bold mb-8 leading-relaxed">
            {currentQ.question}
          </h2>

          {showAnswer ? (
            <div className="bg-black/50 border border-white/5 p-6 rounded-2xl animate-fade-in">
              <h3 className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">Expected Answer</h3>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{currentQ.answer}</p>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center bg-black/30 border border-white/5 border-dashed rounded-2xl text-gray-500">
              Think about your answer, then click "Reveal Answer"
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg transition-colors"
            >
              Reveal Answer
            </button>
          ) : (
            <>
              <button
                onClick={() => handleNext(false)}
                className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <FiX /> I Got it Wrong
              </button>
              <button
                onClick={() => handleNext(true)}
                className="flex-1 py-4 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/30 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <FiCheck /> I Got it Right
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
