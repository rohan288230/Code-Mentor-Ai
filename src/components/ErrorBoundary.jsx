import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle size={64} className="text-red-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-gray-400 max-w-lg mb-8">
            An unexpected error occurred while rendering this page. Our team has been notified.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-colors border border-white/20"
            >
              <RefreshCcw size={18} /> Reload Page
            </button>
            <a 
              href="/"
              className="bg-[var(--color-primary)] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-colors shadow-lg"
            >
              <Home size={18} /> Go Home
            </a>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <div className="mt-12 text-left bg-black/40 p-6 rounded-xl border border-red-500/30 max-w-4xl w-full overflow-auto custom-scrollbar">
              <p className="text-red-400 font-mono text-sm mb-2 font-bold">{this.state.error.toString()}</p>
              <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
