import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  Sparkles,
  Loader2,
  Save,
  Minus,
  Plus,
  Moon,
  Sun,
  Lightbulb,
  Zap,
  Activity,
  Send,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  fetchProblems,
  fetchProblemById,
  runCode as runCodeApi,
  submitCode as submitCodeApi,
  fetchSubmissions,
  fetchSavedCode,
  saveCodeDB,
} from '../services/dsaService';

import ProblemList from '../components/dsa/ProblemList';
import CodeEditor from '../components/dsa/CodeEditor';
import OutputConsole from '../components/dsa/OutputConsole';
import AIFeedbackPanel from '../components/dsa/AIFeedbackPanel';
import apiClient from '../services/apiClient';

const DSAPracticePage = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');

  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customStdin, setCustomStdin] = useState('');

  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAITab, setActiveAITab] = useState('review');
  const [showHints, setShowHints] = useState(false);

  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(260);
  const [consoleTab, setConsoleTab] = useState('output');
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [descPanelWidth, setDescPanelWidth] = useState(35);
  const abortControllerRef = useRef(null);

  const resizeRef = useRef({ dragging: false, startY: 0, startH: 260 });

  const loadCodeForProblem = useCallback(async (problem, lang) => {
    if (!problem) return;
    try {
      const dbCode = await fetchSavedCode(problem._id, lang);
      if (dbCode) {
        setCode(dbCode);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    const saved = localStorage.getItem(`dsa_code_${problem._id}_${lang}`);
    if (saved) {
      setCode(saved);
    } else if (problem.starterCode?.[lang]) {
      setCode(problem.starterCode[lang]);
    } else {
      let defaultCode = '';
      if (lang === 'java') defaultCode = 'class Solution {\n    public int sum(int a, int b) {\n        return 0;\n    }\n}\n';
      else if (lang === 'cpp') defaultCode = 'class Solution {\npublic:\n    int sum(int a, int b) {\n        return 0;\n    }\n};\n';
      else if (lang === 'c') defaultCode = 'int sum(int a, int b) {\n    return 0;\n}\n';
      else if (lang === 'python') defaultCode = 'class Solution:\n    def sum(self, a: int, b: int) -> int:\n        return 0\n';
      else if (lang === 'javascript') defaultCode = 'class Solution {\n    sum(a, b) {\n        return 0;\n    }\n}\n';
      setCode(defaultCode);
    }
  }, []);

  const applyProblem = useCallback(
    async (summary) => {
      setSelectedProblem(summary);
      setExecutionResult(null);
      setAiFeedback(null);
      setIsSaved(false);
      setShowHints(false);
      setConsoleTab('output');

      await loadCodeForProblem(summary, language);

      try {
        const full = await fetchProblemById(summary._id);
        setSelectedProblem(full);
        await loadCodeForProblem(full, language);
        const firstPublic = full.testCases?.find((tc) => !tc.isHidden && tc.input);
        if (firstPublic?.input) {
          setCustomStdin(firstPublic.input);
        } else if (full.examples?.[0]?.input) {
          setCustomStdin(String(full.examples[0].input).replace(/^[^=]+=\s*/, ''));
        } else {
          setCustomStdin('');
        }
      } catch (err) {
        console.error(err);
      }
    },
    [language, loadCodeForProblem]
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProblems();
        setProblems(data);
        if (data.length > 0) {
          await applyProblem(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProblem?._id || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchSubmissions(selectedProblem._id);
        if (!cancelled) setSubmissionHistory(rows);
      } catch {
        if (!cancelled) setSubmissionHistory([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProblem?._id, user, executionResult?.status, executionResult?.executionTime]);

  useEffect(() => {
    if (!selectedProblem || !code) return;
    const tLocal = setTimeout(() => {
      localStorage.setItem(`dsa_code_${selectedProblem._id}_${language}`, code);
    }, 700);
    const tDb = setTimeout(async () => {
      if (user) {
        try {
          await saveCodeDB({ problemId: selectedProblem._id, language, code });
        } catch (err) {
          console.error('Auto-save to DB failed:', err);
        }
      }
    }, 3000);
    return () => {
      clearTimeout(tLocal);
      clearTimeout(tDb);
    };
  }, [code, selectedProblem, language, user]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setIsSaved(false);
    if (selectedProblem) {
      loadCodeForProblem(selectedProblem, newLang);
    }
  };

  const handleCodeChange = (val) => {
    setCode(val ?? '');
    setIsSaved(false);
  };

  const handleSaveCode = async () => {
    if (selectedProblem) {
      localStorage.setItem(`dsa_code_${selectedProblem._id}_${language}`, code);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      if (user) {
        try {
          await saveCodeDB({ problemId: selectedProblem._id, language, code });
        } catch (err) {
          console.error('Save code to DB failed:', err);
        }
      }
    }
  };

  const handleResetCode = () => {
    if (!selectedProblem) return;
    const starter = selectedProblem.starterCode?.[language] || '';
    setCode(starter);
    setIsSaved(false);
  };

  const handleRunCode = async () => {
    if (!code?.trim()) {
      setExecutionResult({
        success: false,
        status: 'Invalid',
        error: 'Please write some code before running.',
        mode: 'run',
      });
      return;
    }
    setIsExecuting(true);
    setExecutionResult(null);
    setConsoleTab('output');
    handleSaveCode();
    try {
      const isCustomModified = customStdin !== (selectedProblem?.testCases?.find(tc => !tc.isHidden)?.input || '');
      const payload = { language, code };
      if (isCustomModified && customStdin.trim()) {
        payload.stdin = customStdin;
      } else if (selectedProblem?._id) {
        payload.problemId = selectedProblem._id;
      } else {
        payload.stdin = customStdin;
      }
      
      const data = await runCodeApi(payload);
      setExecutionResult({ ...data, mode: 'run' });
      // If we got test case results back, switch to 'tests' tab for a better view
      if (data.results && data.results.length > 0) {
        setConsoleTab('tests');
      }
    } catch (err) {
      setExecutionResult({
        success: false,
        error: err.response?.data?.message || err.message || 'Run failed',
        status: 'API Error',
        mode: 'run',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code?.trim()) {
      setExecutionResult({
        success: false,
        status: 'Invalid',
        error: 'Please write some code before submitting.',
        mode: 'submit',
      });
      return;
    }
    if (!selectedProblem?._id) return;

    setIsExecuting(true);
    setExecutionResult(null);
    setConsoleTab('tests');
    handleSaveCode();
    try {
      const data = await submitCodeApi({
        language,
        code,
        problemId: selectedProblem._id,
      });
      setExecutionResult({ ...data, mode: 'submit' });
    } catch (err) {
      setExecutionResult({
        success: false,
        error: err.response?.data?.message || err.message || 'Submit failed',
        status: 'API Error',
        mode: 'submit',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const requestAIAssist = async (tab) => {
    if (!code || !selectedProblem) return;
    setActiveAITab(tab);

    const tabToApi = {
      review: '/ai/explain',
      optimize: '/ai/optimize',
      complexity: '/ai/complexity',
      hint: '/ai/hint'
    };

    const endpoint = tabToApi[tab];
    if (!endpoint) return;

    // If we already have feedback for this tab, don't fetch again
    if (aiFeedback && aiFeedback[tab] && !aiFeedback.error) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsAnalyzing(true);
    try {
      const { data } = await apiClient.post(endpoint, {
        code,
        problemDescription: selectedProblem.description,
        language,
      }, {
        signal: abortControllerRef.current.signal
      });
      
      setAiFeedback(prev => ({
        ...(prev || {}),
        [tab]: data.response,
        error: false
      }));
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        console.log('AI Request cancelled');
        return; // don't set error or finish analyzing flag yet, let the new request handle it
      }
      setAiFeedback(prev => ({
        ...(prev || {}),
        error: true,
        [tab]: err.response?.data?.error || 'Failed to get AI analysis. Ensure Gemini key is configured in backend.'
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearConsole = () => {
    setExecutionResult(null);
  };

  const onConsoleResizeStart = (e) => {
    resizeRef.current = { dragging: true, startY: e.clientY, startH: consoleHeight };
    const onMove = (ev) => {
      if (!resizeRef.current.dragging) return;
      const delta = resizeRef.current.startY - ev.clientY;
      setConsoleHeight(Math.min(520, Math.max(160, resizeRef.current.startH + delta)));
    };
    const onUp = () => {
      resizeRef.current.dragging = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onDescResizeStart = (e) => {
    const startX = e.clientX;
    const startW = descPanelWidth;
    const onMove = (ev) => {
      const container = window.innerWidth;
      const delta = ((ev.clientX - startX) / container) * 100;
      setDescPanelWidth(Math.min(50, Math.max(22, startW + delta)));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full overflow-hidden bg-[var(--color-bg-darker)]">
      <ProblemList
        problems={problems}
        selectedProblem={selectedProblem}
        selectProblem={applyProblem}
      />

      <div className="flex-1 flex flex-col relative h-full min-w-0">
        <div className="h-auto md:h-14 py-2 md:py-0 border-b border-white/10 flex flex-wrap items-center justify-between px-4 bg-[#1e293b]/50 shrink-0 gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-[#0f172a] border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)] text-white w-24 md:w-auto"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="javascript">JavaScript</option>
            </select>

            <div className="flex items-center gap-2 border-white/10 pl-2 md:border-l md:pl-4">
              <button
                type="button"
                onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
                className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                title="Toggle theme"
              >
                {theme === 'vs-dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="flex items-center bg-[#0f172a] rounded border border-white/10">
                <button
                  type="button"
                  onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                  className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs px-2 w-8 text-center text-gray-300">{fontSize}px</span>
                <button
                  type="button"
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveCode}
                className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors hidden sm:block"
                title="Save (Ctrl+S)"
              >
                <Save size={16} />
              </button>
              {isSaved && (
                <span className="text-xs text-green-400 flex items-center gap-1 ml-1 animate-pulse">
                  <Save size={12} /> Saved
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex bg-[#0f172a] border border-white/10 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => requestAIAssist('review')}
                disabled={isAnalyzing}
                className="p-1.5 px-3 text-xs flex items-center gap-1.5 text-blue-400 hover:bg-blue-500/20 transition-colors border-r border-white/10"
                title="Explain"
              >
                {isAnalyzing && activeAITab === 'review' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span className="hidden lg:inline">Explain</span>
              </button>
              <button
                type="button"
                onClick={() => requestAIAssist('optimize')}
                disabled={isAnalyzing}
                className="p-1.5 px-3 text-xs flex items-center gap-1.5 text-purple-400 hover:bg-purple-500/20 transition-colors border-r border-white/10"
                title="Optimize"
              >
                {isAnalyzing && activeAITab === 'optimize' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                <span className="hidden lg:inline">Optimize</span>
              </button>
              <button
                type="button"
                onClick={() => requestAIAssist('complexity')}
                disabled={isAnalyzing}
                className="p-1.5 px-3 text-xs flex items-center gap-1.5 text-pink-400 hover:bg-pink-500/20 transition-colors border-r border-white/10"
                title="Complexity"
              >
                {isAnalyzing && activeAITab === 'complexity' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Activity size={14} />
                )}
                <span className="hidden lg:inline">Complexity</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHints(true);
                  requestAIAssist('hint');
                }}
                disabled={isAnalyzing}
                className="p-1.5 px-3 text-xs flex items-center gap-1.5 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                title="Hints"
              >
                {isAnalyzing && activeAITab === 'hint' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Lightbulb size={14} />
                )}
                <span className="hidden lg:inline">Hint</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRunCode}
              disabled={isExecuting}
              className="btn btn-outline py-1.5 px-4 text-sm flex items-center gap-2 border-white/20"
            >
              {isExecuting && consoleTab === 'output' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Play size={16} />
              )}
              <span className="hidden sm:inline">Run</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitCode}
              disabled={isExecuting}
              className="btn btn-primary py-1.5 px-4 md:px-5 text-sm flex items-center gap-2 font-bold shadow-lg"
            >
              {isExecuting && consoleTab === 'tests' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span className="hidden sm:inline">Submit</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          <div
            className={`w-full lg:shrink-0 border-b lg:border-r lg:border-b-0 border-white/10 overflow-y-auto bg-[#0f172a]/80 h-1/3 lg:h-full custom-scrollbar relative max-lg:!w-full`}
            style={{ width: `min(100%, ${descPanelWidth}%)`, maxWidth: '50%' }}
          >
            {selectedProblem ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-white p-5 md:p-6 pb-0">
                  {selectedProblem.title}
                </h2>
                <div className="px-5 md:px-6 flex flex-wrap gap-2 mb-4">
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedProblem.difficulty === 'Easy'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedProblem.difficulty === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {selectedProblem.difficulty}
                  </div>
                  <div className="px-2 py-1 rounded text-xs font-semibold bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                    {selectedProblem.topic}
                  </div>
                </div>
                <div className="prose prose-invert max-w-none text-sm text-gray-300 px-5 md:px-6 pb-6">
                  <div className="whitespace-pre-wrap">{selectedProblem.description}</div>

                  {selectedProblem.examples?.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <p className="font-bold text-white">Examples</p>
                      {selectedProblem.examples.map((ex, idx) => (
                        <div key={idx} className="bg-black/20 rounded-lg p-4 border border-white/5">
                          <p className="font-bold text-white mb-2">Example {idx + 1}</p>
                          <div className="font-mono text-[13px] space-y-1 text-gray-300">
                            <div>
                              <span className="text-gray-500">Input: </span>
                              {ex.input}
                            </div>
                            <div>
                              <span className="text-gray-500">Output: </span>
                              {ex.output}
                            </div>
                            {ex.explanation && (
                              <div className="mt-2 text-gray-400">
                                <span className="text-gray-500">Explanation: </span>
                                {ex.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedProblem.constraints?.length > 0 && (
                    <div className="mt-6">
                      <p className="font-bold text-white mb-3">Constraints</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-gray-400 text-[13px] font-mono">
                        {selectedProblem.constraints.map((c, idx) => (
                          <li key={idx}>
                            <code className="bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                              {c}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {showHints && selectedProblem.hints?.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                      <p className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                        <Lightbulb size={16} /> Hints
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                        {selectedProblem.hints.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-[var(--color-text-muted)] text-sm flex h-full items-center justify-center p-8">
                Select a problem to view details.
              </div>
            )}
            <div
              role="separator"
              className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[var(--color-primary)]/40"
              onMouseDown={onDescResizeStart}
            />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-[#020617] min-h-0 min-w-0">
            <CodeEditor
              language={language}
              theme={theme}
              code={code}
              handleCodeChange={handleCodeChange}
              fontSize={fontSize}
              onSave={handleSaveCode}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              onReset={handleResetCode}
              isFullscreen={isEditorFullscreen}
              onToggleFullscreen={() => setIsEditorFullscreen((v) => !v)}
            />

            <div
              role="separator"
              className="h-1.5 shrink-0 cursor-row-resize bg-white/5 hover:bg-[var(--color-primary)]/30 transition-colors"
              onMouseDown={onConsoleResizeStart}
            />

            <OutputConsole
              isExecuting={isExecuting}
              executionResult={executionResult}
              customStdin={customStdin}
              onCustomStdinChange={setCustomStdin}
              onClear={clearConsole}
              submissionHistory={submissionHistory}
              consoleTab={consoleTab}
              onConsoleTabChange={setConsoleTab}
              consoleHeight={consoleHeight}
            />
          </div>
        </div>
      </div>

      <AIFeedbackPanel
        aiFeedback={aiFeedback}
        onClose={() => setAiFeedback(null)}
        activeTab={activeAITab}
        setActiveTab={setActiveAITab}
      />
    </div>
  );
};

export default DSAPracticePage;

