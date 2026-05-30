import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import { ChevronRight, X, Play } from 'lucide-react';
import TemplateRenderer from '../components/resume-templates/TemplateRenderer';
import { ROUTES } from '../constants/routes';

const TEMPLATES = [
  { id: 'Modern Software Engineer', name: 'Modern Tech', description: 'Gradient sidebar and clean progress layout. Perfect for devs.', color: '#3b82f6' },
  { id: 'ATS Friendly', name: 'ATS Minimalist', description: 'Clean, one-column design optimized for Applicant Tracking Systems.', color: '#10b981' },
  { id: 'Creative Dark', name: 'Creative Dark', description: 'Dark UI with stylish accents. Stand out from the crowd.', color: '#8b5cf6' },
  { id: 'Student Fresher', name: 'Student Fresher', description: 'Education and Project focused layout for new grads.', color: '#f59e0b' },
  { id: 'Corporate Professional', name: 'Corporate', description: 'Elegant, multi-column enterprise design.', color: '#6366f1' }
];

// Dummy data for previews
const DUMMY_DATA = {
  personalInfo: { fullName: 'Alex Rivera', email: 'alex@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/arivera', github: 'github.com/arivera', photoUrl: 'https://i.pravatar.cc/300' },
  summary: 'Innovative Software Engineer with 4+ years of experience in building scalable web applications. Proficient in React, Node.js, and Cloud architecture.',
  experience: [
    { company: 'TechNova', position: 'Senior Frontend Engineer', startDate: '2021', endDate: 'Present', description: ['Architected a micro-frontend architecture.', 'Improved performance scores by 40%.'] },
    { company: 'StartupX', position: 'Software Engineer', startDate: '2019', endDate: '2021', description: ['Developed core product features.', 'Led a team of 3 interns.'] }
  ],
  education: [{ institution: 'State University', degree: 'B.S.', field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '3.9' }],
  projects: [{ name: 'AI Image Generator', technologies: ['React', 'Python'], link: 'github.com/arivera/ai-gen', description: ['Built a full-stack AI platform.'] }],
  skills: { languages: ['JavaScript', 'Python', 'TypeScript'], frameworks: ['React', 'Next.js', 'Express'], tools: ['Docker', 'AWS', 'Git'] },
  certifications: [],
  achievements: []
};

const ResumeTemplateSelector = () => {
  const navigate = useNavigate();
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleUseTemplate = (templateId) => {
    // Navigate to builder and pass the selected template via state
    navigate(`${ROUTES.RESUME}/builder`, { state: { initialTemplate: templateId } });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        <header className="text-center pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight"
          >
            Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Template</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto"
          >
            Select a professional design to start building your resume. You can customize colors and switch templates later.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4">
          {TEMPLATES.map((tpl, i) => (
            <motion.div 
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group relative bg-[#0f172a]/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer flex flex-col h-full shadow-2xl"
              onClick={() => setSelectedPreview(tpl)}
            >
              {/* Thumbnail Container */}
              <div className="w-full aspect-[1/1.2] bg-neutral-900 relative overflow-hidden flex justify-center items-start pt-6 border-b border-white/10">
                {/* CSS scaled render of the template */}
                <div className="pointer-events-none transform origin-top" style={{ transform: 'scale(0.35)' }}>
                  <TemplateRenderer data={DUMMY_DATA} template={tpl.id} themeConfig={{ themeColor: tpl.color, fontFamily: 'Inter' }} />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPreview(tpl); }}
                      className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors shadow-lg"
                    >
                      <Play size={20} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{tpl.name}</h3>
                  <p className="text-sm text-gray-400 mb-6">{tpl.description}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUseTemplate(tpl.id); }}
                  className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  Use Template <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Screen Preview Modal */}
        <AnimatePresence>
          {selectedPreview && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedPreview(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0f172a] rounded-3xl w-full max-w-5xl h-[90vh] flex overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex-1 bg-neutral-900 overflow-auto custom-scrollbar flex justify-center py-10 relative">
                  <TemplateRenderer data={DUMMY_DATA} template={selectedPreview.id} themeConfig={{ themeColor: selectedPreview.color, fontFamily: 'Inter' }} scale={0.9} />
                </div>
                
                <div className="w-80 p-8 flex flex-col border-l border-white/10 bg-[#0f172a]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{selectedPreview.name}</h2>
                    <button onClick={() => setSelectedPreview(null)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-8 leading-relaxed">{selectedPreview.description}</p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleUseTemplate(selectedPreview.id)}
                      className="w-full bg-[var(--color-primary)] hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    >
                      Start Building <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};

export default ResumeTemplateSelector;
