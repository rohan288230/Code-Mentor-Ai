import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, BookOpen, FileText, Sparkles, Terminal, ChevronRight, CheckCircle2, Zap, BrainCircuit, ChevronDown, GraduationCap, MessageCircle, Code, Briefcase } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const FAQS = [
  { question: "Is Code Mentor AI completely free?", answer: "Yes, you can access the core DSA platform and practice with our AI mentor completely free. Premium courses and advanced AI resume tools are available in our Pro plan." },
  { question: "Which languages are supported in the code editor?", answer: "Our Piston-powered execution engine supports Python, Java, C++, and C. We are constantly working on adding more languages based on community feedback." },
  { question: "How does the AI code optimization work?", answer: "When you submit a solution, our AI analyzes your code for Time and Space Complexity. It then provides hints and optimized alternatives to help you learn better patterns." },
  { question: "Can I use the resume builder for non-tech roles?", answer: "While the resume builder is optimized for software engineering and tech roles with ATS-friendly templates, you can certainly customize it for any profession." }
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Software Engineer @ Google", text: "The AI feedback on my DSA solutions helped me realize I was constantly failing to account for edge cases. It's like having a senior dev looking over your shoulder." },
  { name: "Marcus Johnson", role: "Frontend Developer", text: "I used the ATS Resume Builder and finally started getting callbacks. The clean templates paired with the AI bullet point suggestions are a game changer." },
  { name: "Priya Patel", role: "CS Student", text: "The structured courses made learning System Design actually enjoyable. The interactive quizzes keep you engaged unlike 10-hour video tutorials." }
];

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#020617] text-white selection:bg-[var(--color-primary)] selection:text-white overflow-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 grid-bg opacity-[0.15] pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-primary)]/10 blur-[120px] animate-blob pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-secondary)]/10 blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 pt-32 pb-20 z-10 gap-12 min-h-[90vh]">
        
        <div className="flex-1 max-w-2xl space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[var(--color-primary)] text-sm font-semibold backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Sparkles size={14} /> <span>Introducing AI Resume Builder v2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight"
          >
            Code faster.<br/>
            Learn smarter.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              Get Hired.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            The ultimate developer platform. Practice DSA with AI-powered feedback, master System Design, and build ATS-friendly resumes all in one place.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
          >
            <Link to={ROUTES.LOGIN} className="bg-white text-black font-semibold text-base px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform">
              Start Building Free <ChevronRight size={18} />
            </Link>
            <Link to={ROUTES.COURSES} className="bg-white/5 border border-white/10 text-white font-semibold text-base px-8 py-4 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              Explore Platform
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium pt-6"
          >
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Piston Execution Engine</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Powered by OpenAI</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> Free forever</div>
          </motion.div>
        </div>

        {/* Hero Interactive Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }} 
          animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
          transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
          className="flex-1 w-full max-w-xl lg:max-w-2xl perspective-1000 z-10 mt-10 lg:mt-0 hidden md:block"
        >
          <div className="relative w-full aspect-[4/3] transform-gpu hover:rotate-y-[-5deg] hover:rotate-x-[2deg] transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
              <div className="h-10 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-auto flex items-center gap-2 bg-white/5 px-3 py-1 rounded text-xs text-gray-400 font-mono">
                  <Terminal size={12}/> solution.py
                </div>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed overflow-hidden flex-1 text-gray-300">
                <span className="text-purple-400">def</span> <span className="text-blue-400">twoSum</span>(nums, target):<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;seen = {'{}'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> <span className="text-blue-400">enumerate</span>(nums):<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;diff = target - num<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> diff <span className="text-purple-400">in</span> seen:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> [seen[diff], i]<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seen[num] = i<br/>
              </div>
            </div>
            {/* Floating AI Notification */}
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl w-64 animate-float shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold text-xs uppercase tracking-wider">
                <Zap size={14} fill="currentColor" /> AI Mentor Feedback
              </div>
              <p className="text-xs text-white leading-snug">
                Excellent! Your solution runs in <span className="text-green-400 font-mono">O(N)</span> time complexity using a Hash Map.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="w-full px-6 md:px-12 py-24 bg-black/20 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3">Complete Ecosystem</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white">One platform, infinite growth.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 hover:border-[var(--color-primary)]/50 transition-colors group relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-primary)]/10 blur-[80px] rounded-full group-hover:bg-[var(--color-primary)]/30 transition-all duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] mb-6">
                <Code2 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">DSA Practice Environment</h3>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Master algorithms with our blazing-fast code editor. Support for Python, Java, and C++ with hidden test cases and performance metrics powered by Piston.
              </p>
            </div>

            <div className="col-span-1 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 hover:border-[var(--color-secondary)]/50 transition-colors group relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--color-secondary)]/10 blur-[60px] rounded-full group-hover:bg-[var(--color-secondary)]/30 transition-all duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)] mb-6">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Code Optimization</h3>
              <p className="text-gray-400 leading-relaxed">
                Don't just solve problems, optimize them. Get instant AI feedback on space and time complexity for every submission.
              </p>
            </div>

            <div className="col-span-1 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 hover:border-[var(--color-accent)]/50 transition-colors group relative overflow-hidden">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-[var(--color-accent)]/10 blur-[60px] rounded-full group-hover:bg-[var(--color-accent)]/30 transition-all duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ATS Resume Builder</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate beautifully formatted, ATS-compliant resumes with smart AI suggestions for your bullet points.
              </p>
            </div>

            <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 hover:border-[#ff4d94]/50 transition-colors group relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ff4d94]/10 blur-[80px] rounded-full group-hover:bg-[#ff4d94]/30 transition-all duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-[#ff4d94]/20 flex items-center justify-center text-[#ff4d94] mb-6">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Structured Premium Courses</h3>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Learn System Design, OOPs, and React with interactive modules, progress tracking, and embedded quizzes to solidify your knowledge.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full px-6 py-24 z-10 relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Loved by developers</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">See how Code Mentor AI is helping engineers land roles at top tech companies.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <p className="text-gray-300 italic mb-6">"{t.text}"</p>
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-sm text-[var(--color-primary)]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-6 py-24 bg-black/30 z-10 relative">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center text-white font-semibold hover:bg-white/5 transition-colors focus:outline-none"
                >
                  {faq.question}
                  <ChevronDown className={`transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[var(--color-primary)]' : 'text-gray-500'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-gray-400 text-sm leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-32 z-10 relative border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">Ready to level up?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of developers using Code Mentor AI to prepare for their next big opportunity.
          </p>
          <Link to={ROUTES.LOGIN} className="inline-block bg-white text-black font-bold text-lg px-12 py-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#020617] pt-16 pb-8 px-6 z-10 relative text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to={ROUTES.HOME} className="text-xl font-extrabold text-white flex items-center gap-2 mb-4">
              <GraduationCap size={24} className="text-[var(--color-primary)]" />
              Code Mentor AI
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              The ultimate platform for developers to practice coding, build resumes, and learn system design with AI assistance.
            </p>
            <div className="flex gap-4 text-gray-500">
              <a href="#" className="hover:text-white transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Code size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Briefcase size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to={ROUTES.DSA} className="hover:text-white transition-colors">DSA Practice</Link></li>
              <li><Link to={ROUTES.COURSES} className="hover:text-white transition-colors">Premium Courses</Link></li>
              <li><Link to={ROUTES.RESUME} className="hover:text-white transition-colors">AI Resume Builder</Link></li>
              <li><Link to={ROUTES.DASHBOARD} className="hover:text-white transition-colors">Global Ranking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Code Mentor AI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <Sparkles size={14} className="text-[var(--color-primary)]" />
            <span className="text-gray-300 font-semibold">OpenAI & Piston</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
