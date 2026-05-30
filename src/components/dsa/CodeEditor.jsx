import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Copy, Maximize2, Minimize2 } from 'lucide-react';

const CodeEditor = ({
  language,
  theme,
  code,
  handleCodeChange,
  fontSize,
  onSave,
  onRun,
  onSubmit,
  onReset,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const editorRef = useRef(null);

  const monacoLanguage =
    language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language;

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit?.();
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code || '');
    } catch {
      // ignore
    }
  };

  const rootClass = isFullscreen
    ? 'fixed inset-0 z-[60] flex flex-col bg-[#020617] pt-14'
    : 'flex flex-col flex-1 min-h-[160px] w-full bg-[#020617] relative';

  return (
    <div className={rootClass}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-[#1e293b]/40 shrink-0 gap-2">
        <span className="text-xs text-gray-500 font-mono hidden sm:inline">
          Ctrl+Enter Run · Ctrl+Shift+Enter Submit · Ctrl+S Save
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Reset to starter code"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Copy code"
          >
            <Copy size={15} />
          </button>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen editor'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <Editor
          height="100%"
          language={monacoLanguage}
          theme={theme}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Loading editor…
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            fontLigatures: true,
            formatOnPaste: true,
            automaticLayout: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
