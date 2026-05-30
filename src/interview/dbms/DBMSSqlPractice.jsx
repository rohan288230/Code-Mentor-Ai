import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiTerminal, FiDatabase, FiCheckCircle } from 'react-icons/fi';

export default function DBMSSqlPractice() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('-- Write your SQL query here\nSELECT * FROM students;');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockTables = {
    students: [
      { id: 1, name: 'Alice', age: 20, grade: 'A' },
      { id: 2, name: 'Bob', age: 22, grade: 'B' },
      { id: 3, name: 'Charlie', age: 21, grade: 'A' },
      { id: 4, name: 'David', age: 23, grade: 'C' },
    ],
    courses: [
      { id: 101, title: 'Database Systems', credits: 4 },
      { id: 102, title: 'Data Structures', credits: 4 },
      { id: 103, title: 'Operating Systems', credits: 3 },
    ]
  };

  const handleRunQuery = () => {
    setLoading(true);
    // Simulate query processing
    setTimeout(() => {
      const q = query.toLowerCase();
      if (q.includes('select * from students')) {
        setOutput({ columns: ['id', 'name', 'age', 'grade'], rows: mockTables.students });
      } else if (q.includes('select * from courses')) {
        setOutput({ columns: ['id', 'title', 'credits'], rows: mockTables.courses });
      } else if (q.includes('select name from students')) {
        setOutput({ columns: ['name'], rows: mockTables.students.map(s => ({ name: s.name })) });
      } else {
        setOutput({ error: 'Syntax Error or Unsupported Query in this Mock Environment. Try: SELECT * FROM students;' });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/10 h-16 flex items-center px-6 gap-4 shrink-0">
        <button 
          onClick={() => navigate('/interview/dbms')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
        >
          <FiArrowLeft size={20} />
        </button>
        <FiTerminal className="text-blue-500 text-xl" />
        <h1 className="font-bold text-lg text-gray-200">SQL Practice Environment</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#111] border-r border-white/10 p-4 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Available Tables</h2>
          
          <div className="bg-black/50 border border-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
              <FiDatabase /> students
            </div>
            <ul className="text-sm text-gray-400 space-y-1 pl-6">
              <li>id (INT)</li>
              <li>name (VARCHAR)</li>
              <li>age (INT)</li>
              <li>grade (VARCHAR)</li>
            </ul>
          </div>
          
          <div className="bg-black/50 border border-white/5 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
              <FiDatabase /> courses
            </div>
            <ul className="text-sm text-gray-400 space-y-1 pl-6">
              <li>id (INT)</li>
              <li>title (VARCHAR)</li>
              <li>credits (INT)</li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Practice Problems</h2>
            <div className="space-y-2 text-sm">
              <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-colors flex items-center gap-2">
                <FiCheckCircle className="text-green-500" /> Retrieve all students
              </button>
              <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                Get only student names
              </button>
              <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                List all courses
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
          <div className="h-1/2 border-b border-black flex flex-col">
            <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center text-sm border-b border-black shadow-sm">
              <span className="font-mono text-gray-300">query.sql</span>
              <button 
                onClick={handleRunQuery}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded flex items-center gap-2 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiPlay />}
                Run Query
              </button>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck="false"
            />
          </div>
          
          <div className="h-1/2 flex flex-col bg-[#111]">
            <div className="bg-[#2d2d2d] px-4 py-2 text-sm text-gray-400 border-b border-black">
              Output Terminal
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-sm">
              {!output && <div className="text-gray-500 italic">Run a query to see the output...</div>}
              {output && output.error && <div className="text-red-400">{output.error}</div>}
              {output && output.columns && (
                <table className="w-full text-left border-collapse border border-white/10 text-gray-300">
                  <thead className="bg-black/40">
                    <tr>
                      {output.columns.map(col => (
                        <th key={col} className="border border-white/10 px-4 py-2 font-bold text-blue-400">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {output.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-white/5">
                        {output.columns.map(col => (
                          <td key={col} className="border border-white/10 px-4 py-2">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
