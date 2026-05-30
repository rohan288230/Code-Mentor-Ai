import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const ProblemList = ({ problems, selectedProblem, selectProblem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');

  const topics = useMemo(() => {
    const t = new Set(problems.map(p => p.topic));
    return ['All', ...Array.from(t)];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      const matchTopic = topicFilter === 'All' || p.topic === topicFilter;
      return matchSearch && matchDiff && matchTopic;
    });
  }, [problems, searchTerm, difficultyFilter, topicFilter]);

  return (
    <div className="w-full md:w-[280px] lg:w-[320px] h-1/3 md:h-full border-b md:border-b-0 md:border-r border-white/10 bg-[#0f172a]/80 flex flex-col shrink-0">
      <div className="p-4 border-b border-white/10 font-bold bg-[#1e293b]/50">Problems</div>
      
      <div className="p-3 border-b border-white/10 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search problems..."
            className="w-full bg-black/30 border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-[var(--color-primary)] text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="flex-1 bg-black/30 border border-white/10 rounded-md py-1.5 px-2 text-xs focus:outline-none focus:border-[var(--color-primary)] text-white"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <select 
            className="flex-1 bg-black/30 border border-white/10 rounded-md py-1.5 px-2 text-xs focus:outline-none focus:border-[var(--color-primary)] text-white"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          >
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow p-2 space-y-2 custom-scrollbar">
        {filteredProblems.length > 0 ? filteredProblems.map((p) => (
          <div
            key={p._id}
            onClick={() => selectProblem(p)}
            className={`p-3 rounded-lg cursor-pointer transition-colors border ${
              selectedProblem?._id === p._id
                ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50'
                : 'bg-white/5 border-transparent hover:bg-white/10'
            }`}
          >
            <div className="font-medium text-sm text-white line-clamp-1">{p.title}</div>
            <div className="flex justify-between items-center mt-2">
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  p.difficulty === 'Easy'
                    ? 'bg-green-500/10 text-green-400'
                    : p.difficulty === 'Medium'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {p.difficulty}
              </span>
              <span className="text-[10px] text-gray-400 truncate ml-2">{p.topic}</span>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 text-sm mt-10">No problems found</div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
