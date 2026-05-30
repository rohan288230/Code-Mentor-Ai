import { Sparkles, X, Activity, Zap, Lightbulb, Code2 } from 'lucide-react';
import AITypingEffect from '../AITypingEffect';

const AIFeedbackPanel = ({ aiFeedback, onClose, activeTab, setActiveTab }) => {
  if (!aiFeedback) return null;

  const tabs = [
    { id: 'review', label: 'Explain', icon: Code2, color: 'text-blue-400' },
    { id: 'optimize', label: 'Optimize', icon: Zap, color: 'text-purple-400' },
    { id: 'complexity', label: 'Complexity', icon: Activity, color: 'text-pink-400' },
    { id: 'hint', label: 'Hint', icon: Lightbulb, color: 'text-yellow-400' }
  ];

  return (
    <div className="absolute right-0 top-auto md:top-14 bottom-0 w-full md:w-[450px] h-[60%] md:h-auto bg-[#0f172a] border-t md:border-t-0 md:border-l border-white/10 shadow-2xl flex flex-col z-50 transition-transform duration-300">
      
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#1e293b]/50">
        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
          <Sparkles className="text-[var(--color-secondary)]" size={18} /> AI Assistant
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[var(--color-secondary)] text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? tab.color : 'text-gray-500'} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {aiFeedback.error ? (
           <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl">
             <p className="text-sm text-red-300">{aiFeedback[activeTab] || 'An error occurred fetching AI response.'}</p>
           </div>
        ) : (
          <div className="space-y-6 h-full">
            {activeTab === 'review' && (
              <div className="bg-blue-500/5 p-5 rounded-xl border border-blue-500/10 h-full">
                <h4 className="font-bold text-sm mb-3 text-blue-400">Code Explanation</h4>
                <div className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap">
                  <AITypingEffect text={aiFeedback.review || "Loading explanation..."} speed={10} />
                </div>
              </div>
            )}

            {activeTab === 'optimize' && (
              <div className="bg-purple-500/5 p-5 rounded-xl border border-purple-500/10 h-full">
                <h4 className="font-bold text-sm mb-3 text-purple-400">Optimization Suggestions</h4>
                <div className="text-[13px] text-purple-100/80 leading-relaxed whitespace-pre-wrap">
                  <AITypingEffect text={aiFeedback.optimize || "Loading optimizations..."} speed={10} />
                </div>
              </div>
            )}

            {activeTab === 'complexity' && (
              <div className="bg-pink-500/5 p-5 rounded-xl border border-pink-500/10 h-full">
                <h4 className="font-bold text-sm mb-3 text-pink-400">Complexity Analysis</h4>
                <div className="text-[13px] text-pink-100/80 leading-relaxed whitespace-pre-wrap">
                  <AITypingEffect text={aiFeedback.complexity || "Loading complexity analysis..."} speed={10} />
                </div>
              </div>
            )}

            {activeTab === 'hint' && (
              <div className="bg-yellow-500/5 p-5 rounded-xl border border-yellow-500/10 h-full flex flex-col items-center text-center">
                <Lightbulb size={40} className="text-yellow-400 mb-4 opacity-50" />
                <h4 className="font-bold text-sm mb-2 text-yellow-400">Quick Hint</h4>
                <div className="text-[13px] text-yellow-100/80 leading-relaxed w-full mx-auto whitespace-pre-wrap text-left">
                  <AITypingEffect text={aiFeedback.hint || "Loading hint..."} speed={15} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFeedbackPanel;
