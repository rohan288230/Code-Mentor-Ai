import { Loader2, Trash2 } from 'lucide-react';

const statusColor = (status) => {
  if (status === 'Accepted') return 'text-green-500';
  if (status === 'Wrong Answer') return 'text-amber-400';
  if (status === 'Compile Error' || status === 'Runtime Error') return 'text-red-500';
  if (status === 'Time Limit Exceeded') return 'text-orange-400';
  return 'text-red-400';
};

const OutputConsole = ({
  isExecuting,
  executionResult,
  customStdin,
  onCustomStdinChange,
  onClear,
  submissionHistory,
  consoleTab,
  onConsoleTabChange,
  consoleHeight,
}) => {
  const tabs = [
    { id: 'output', label: 'Output' },
    { id: 'tests', label: 'Test Results' },
    { id: 'history', label: 'Submissions' },
  ];

  return (
    <div
      className="border-t border-white/10 bg-[#0f172a] shrink-0 flex flex-col z-10"
      style={{ height: consoleHeight }}
    >
      <div className="flex border-b border-white/10 bg-[#1e293b]/50 items-center justify-between pr-2">
        <div className="flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onConsoleTabChange(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                consoleTab === t.id
                  ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-white/10"
          title="Clear console"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {consoleTab === 'output' && (
        <div className="px-4 py-2 border-b border-white/5 bg-black/20 shrink-0">
          <label className="text-xs text-gray-500 block mb-1">Custom input (stdin)</label>
          <textarea
            value={customStdin}
            onChange={(e) => onCustomStdinChange(e.target.value)}
            rows={2}
            placeholder="Paste input for Run (not used on Submit)"
            className="w-full bg-[#020617] border border-white/10 rounded px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-[var(--color-primary)] resize-y min-h-[48px]"
          />
        </div>
      )}

      <div className="p-4 font-mono text-sm overflow-y-auto flex-1 text-gray-300 whitespace-pre-wrap custom-scrollbar">
        {consoleTab === 'output' && (
          <>
            {isExecuting ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-primary)]">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm font-semibold animate-pulse">Executing code securely via Piston...</span>
              </div>
            ) : executionResult ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-3">
                  <span className={`text-lg font-bold ${statusColor(executionResult.status)}`}>
                    {executionResult.status}
                  </span>
                  {executionResult.mode && (
                    <span className="text-xs uppercase tracking-wide text-gray-500 bg-black/30 px-2 py-0.5 rounded">
                      {executionResult.mode}
                    </span>
                  )}
                  {executionResult.executionTime && (
                    <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                      {executionResult.executionTime}
                    </span>
                  )}
                  {executionResult.passedCases != null && (
                    <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                      {executionResult.passedCases}/{executionResult.totalCases} passed
                    </span>
                  )}
                </div>

                {executionResult.error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs overflow-x-auto">
                    <span className="font-bold block mb-1">Error</span>
                    {executionResult.error}
                  </div>
                )}

                {executionResult.output != null && (
                  <div className="bg-black/30 p-3 rounded text-xs border border-white/5">
                    <span className="text-gray-500 block mb-1">Stdout</span>
                    {executionResult.output === '' ? (
                      <span className="text-gray-600 italic">No output</span>
                    ) : (
                      <span className="whitespace-pre-wrap">{executionResult.output}</span>
                    )}
                  </div>
                )}

                {executionResult.mode === 'submit' &&
                  executionResult.results?.length > 0 && (
                    <p className="text-xs text-gray-500">
                      See the <button type="button" className="text-[var(--color-primary)] underline" onClick={() => onConsoleTabChange('tests')}>Test Results</button> tab for details.
                    </p>
                  )}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] italic text-center py-6">
                Run with custom input or Submit to grade all test cases.
              </p>
            )}
          </>
        )}

        {consoleTab === 'tests' && (
          <>
            {isExecuting ? (
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <Loader2 size={16} className="animate-spin" /> Running test cases…
              </div>
            ) : executionResult?.results?.length ? (
              <div className="space-y-2">
                {executionResult.results.map((r) => (
                  <div
                    key={r.testCase}
                    className={`p-3 border rounded text-xs ${
                      r.passed
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="font-bold mb-2 flex items-center gap-2 flex-wrap">
                      {r.passed ? (
                        <span className="text-green-500">✔ Passed</span>
                      ) : (
                        <span className="text-red-500">✘ Failed</span>
                      )}
                      <span className="text-gray-400">Case {r.testCase}</span>
                      {r.isHidden && (
                        <span className="text-[10px] uppercase bg-white/10 px-1.5 py-0.5 rounded text-gray-400">
                          Hidden
                        </span>
                      )}
                    </div>
                    {!r.passed && (
                      <div className="grid sm:grid-cols-2 gap-3 mt-2 bg-black/40 p-2 rounded">
                        <div>
                          <span className="text-gray-500 block">Your output</span>
                          <span className="text-red-300 break-all">{r.output || '""'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Expected</span>
                          <span className="text-green-300 break-all">{r.expected}</span>
                        </div>
                        {r.error && (
                          <div className="sm:col-span-2 text-red-400/80">{r.error}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] italic text-center py-6">
                Submit your solution to see test case results.
              </p>
            )}
          </>
        )}

        {consoleTab === 'history' && (
          <>
            {submissionHistory?.length ? (
              <ul className="space-y-2 text-xs">
                {submissionHistory.map((s) => (
                  <li
                    key={s._id}
                    className="flex flex-wrap items-center justify-between gap-2 p-2 rounded border border-white/10 bg-black/20"
                  >
                    <span className={statusColor(s.status)}>{s.status}</span>
                    <span className="text-gray-500">{s.language}</span>
                    <span className="text-gray-500">
                      {s.passedCases != null ? `${s.passedCases}/${s.totalCases}` : '—'}
                    </span>
                    <span className="text-gray-600">{s.executionTime || s.runtime || ''}</span>
                    <span className="text-gray-600">
                      {new Date(s.submittedAt || s.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--color-text-muted)] italic text-center py-6">
                No submissions yet for this problem. Sign in to save history.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OutputConsole;
