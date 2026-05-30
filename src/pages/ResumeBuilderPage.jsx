import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import html2pdf from 'html2pdf.js';
import { Download, Sparkles, Loader2, Wand2, ChevronDown, Plus, Trash2, X, Settings2, LayoutTemplate, Briefcase, GraduationCap, Code2, User2 } from 'lucide-react';
import apiClient from '../services/apiClient';
import TemplateRenderer from '../components/resume-templates/TemplateRenderer';

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-white/10 shadow-xl mb-8 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex justify-between items-center p-6 transition-colors hover:bg-white/5 ${isOpen ? 'rounded-t-2xl border-b border-white/5' : 'rounded-2xl'}`}
      >
        <h3 className="text-lg font-extrabold text-white flex items-center gap-4">
          <div className="p-3 bg-[var(--color-primary)]/20 rounded-xl text-[var(--color-primary)] shadow-sm">
            {Icon && <Icon size={22} />}
          </div>
          {title}
        </h3>
        <ChevronDown size={24} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-8 space-y-8 bg-[#0f172a]/20 rounded-b-2xl">
          {children}
        </div>
      )}
    </div>
  );
};

const ResumeBuilderPage = () => {
  const location = useLocation();
  const initialTemplate = location.state?.initialTemplate || 'Modern Software Engineer';

  const [resumeData, setResumeData] = useState({
    personalInfo: { fullName: 'Alex Rivera', email: 'alex@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/arivera', github: 'github.com/arivera', photoUrl: 'https://i.pravatar.cc/300' },
    summary: 'Innovative Software Engineer with 4+ years of experience in building scalable web applications. Proficient in React, Node.js, and Cloud architecture.',
    experience: [{ company: 'TechNova', position: 'Senior Frontend Engineer', startDate: '2021', endDate: 'Present', description: ['Architected a micro-frontend architecture.', 'Improved performance scores by 40%.'] }],
    education: [{ institution: 'State University', degree: 'B.S.', field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '3.9' }],
    projects: [{ name: 'AI Image Generator', technologies: ['React', 'Python'], link: 'github.com/arivera/ai-gen', description: ['Built a full-stack AI platform.'] }],
    skills: { languages: ['JavaScript', 'Python', 'TypeScript'], frameworks: ['React', 'Next.js', 'Express'], tools: ['Docker', 'AWS', 'Git'] },
    certifications: [{ name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023', link: '' }],
    achievements: ['Won First Place at Global Hackathon 2022']
  });

  const [themeConfig, setThemeConfig] = useState({ themeColor: '#3b82f6', fontFamily: 'Inter, sans-serif' });
  const [template, setTemplate] = useState(initialTemplate);
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  
  const resumeRef = useRef(null);

  const handlePersonalChange = (e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, [e.target.name]: e.target.value } });
  const handleArrayChange = (field, index, key, value) => { const newArray = [...resumeData[field]]; newArray[index][key] = value; setResumeData({ ...resumeData, [field]: newArray }); };
  const handleArrayBulletChange = (field, itemIndex, bulletIndex, value) => { const newArray = [...resumeData[field]]; newArray[itemIndex].description[bulletIndex] = value; setResumeData({ ...resumeData, [field]: newArray }); };
  const addArrayItem = (field, defaultItem) => setResumeData({ ...resumeData, [field]: [...resumeData[field], defaultItem] });
  const removeArrayItem = (field, index) => { const newArray = [...resumeData[field]]; newArray.splice(index, 1); setResumeData({ ...resumeData, [field]: newArray }); };
  const addBullet = (field, index) => { const newArray = [...resumeData[field]]; newArray[index].description.push(''); setResumeData({ ...resumeData, [field]: newArray }); };
  const removeBullet = (field, itemIndex, bulletIndex) => { const newArray = [...resumeData[field]]; newArray[itemIndex].description.splice(bulletIndex, 1); setResumeData({ ...resumeData, [field]: newArray }); };
  const handleSkillsChange = (category, value) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, [category]: value.split(',').map(s=>s.trim()).filter(s=>s!=='') } });

  const downloadPDF = () => {
    const element = resumeRef.current;
    const opt = { margin: 0, filename: `${resumeData.personalInfo.fullName.replace(' ', '_')}_Resume.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'px', format: [816, 1056], orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
  };

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data } = await apiClient.post('/resume/analyze', { resumeData, targetRole: 'Software Engineer' });
      setAiAnalysis(data);
    } catch {
      alert('Failed to run AI analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const { data } = await apiClient.post('/resume/summary', { resumeData });
      setResumeData({ ...resumeData, summary: data.summary });
    } catch {
      alert('Failed to generate summary.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Improved spacious styling for inputs
  const inputClass = "w-full bg-[#0f172a] border border-white/20 rounded-xl p-4 text-[15px] text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-gray-500 shadow-inner";
  const labelClass = "text-xs font-extrabold text-gray-300 mb-2 block uppercase tracking-widest pl-1";
  
  // Specific styling for bullet point textareas
  const textareaBulletClass = "w-full bg-[#0f172a] border border-white/20 rounded-xl p-4 text-[14px] text-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-gray-500 shadow-inner min-h-[80px] resize-y leading-relaxed";

  return (
    <DashboardLayout>
      <div className="max-w-[1900px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-10 h-auto xl:h-[calc(100vh-100px)] overflow-x-hidden">
        
        {/* Editor Sidebar - Wider, clearly visible, spacious */}
        <div className="w-full xl:w-[800px] flex flex-col xl:overflow-y-auto custom-scrollbar xl:pr-4 pb-10 xl:pb-20 scroll-smooth">
          
          <header className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">Resume Editor</h1>
            <p className="text-base text-gray-400 font-medium">Craft your professional story. Changes save automatically.</p>
          </header>

          <div className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-xl mb-10 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2 text-[var(--color-primary)] font-bold text-lg">
              <Settings2 size={24} /> Template Settings
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Select Layout</label>
                <div className="relative">
                  <LayoutTemplate className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select value={template} onChange={(e) => setTemplate(e.target.value)} className={`${inputClass} pl-12 appearance-none cursor-pointer font-semibold`}>
                    <option value="Modern Software Engineer">Modern Tech</option>
                    <option value="ATS Friendly">ATS Minimal</option>
                    <option value="Creative Dark">Creative Dark</option>
                    <option value="Student Fresher">Student Fresher</option>
                    <option value="Corporate Professional">Corporate Professional</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Theme Color</label>
                <div className="flex items-center gap-4 bg-[#0f172a] border border-white/20 rounded-xl p-3 px-4">
                  <input type="color" value={themeConfig.themeColor} onChange={(e) => setThemeConfig({...themeConfig, themeColor: e.target.value})} className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-0 p-0" />
                  <span className="text-base font-mono text-white font-bold">{themeConfig.themeColor}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Accordion title="Personal Details" icon={User2} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div><label className={labelClass}>Full Name</label><input name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalChange} className={inputClass} placeholder="John Doe" /></div>
              <div><label className={labelClass}>Email</label><input name="email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} className={inputClass} placeholder="john@example.com" /></div>
              <div><label className={labelClass}>Phone</label><input name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} className={inputClass} placeholder="+1 234 567 890" /></div>
              <div><label className={labelClass}>Location</label><input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalChange} className={inputClass} placeholder="City, Country" /></div>
              <div><label className={labelClass}>LinkedIn</label><input name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalChange} className={inputClass} placeholder="linkedin.com/in/johndoe" /></div>
              <div><label className={labelClass}>GitHub</label><input name="github" value={resumeData.personalInfo.github} onChange={handlePersonalChange} className={inputClass} placeholder="github.com/johndoe" /></div>
              <div className="md:col-span-2"><label className={labelClass}>Photo URL</label><input name="photoUrl" value={resumeData.personalInfo.photoUrl} onChange={handlePersonalChange} className={inputClass} placeholder="https://..." /></div>
            </div>
          </Accordion>

          <Accordion title="Professional Summary" icon={Wand2}>
            <div className="flex justify-between items-center mb-4">
              <label className={labelClass}>Summary</label>
              <button onClick={handleGenerateSummary} disabled={generatingSummary} className="text-[13px] font-bold flex items-center gap-2 text-purple-400 hover:text-white transition-colors bg-purple-500/10 px-4 py-2.5 rounded-lg border border-purple-500/30 hover:bg-purple-500/20 shadow-sm">
                {generatingSummary ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Auto-Write with AI
              </button>
            </div>
            <textarea value={resumeData.summary} onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} className={`${inputClass} min-h-[200px] resize-y leading-relaxed text-[15px]`} placeholder="Write a brief summary of your professional background..." />
          </Accordion>

          <Accordion title="Experience" icon={Briefcase}>
            <div className="space-y-10">
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="bg-black/40 p-8 rounded-3xl border border-white/10 relative group shadow-lg">
                  <button onClick={() => removeArrayItem('experience', i)} className="absolute top-6 right-6 text-gray-400 hover:text-red-400 transition-colors p-2.5 bg-white/5 rounded-xl hover:bg-red-500/10" title="Delete Experience">
                    <Trash2 size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pr-16">
                    <div><label className={labelClass}>Company</label><input value={exp.company} onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)} className={inputClass} placeholder="e.g. Google" /></div>
                    <div><label className={labelClass}>Position</label><input value={exp.position} onChange={(e) => handleArrayChange('experience', i, 'position', e.target.value)} className={inputClass} placeholder="e.g. Software Engineer" /></div>
                    <div><label className={labelClass}>Start Date</label><input value={exp.startDate} onChange={(e) => handleArrayChange('experience', i, 'startDate', e.target.value)} className={inputClass} placeholder="e.g. Jan 2021" /></div>
                    <div><label className={labelClass}>End Date</label><input value={exp.endDate} onChange={(e) => handleArrayChange('experience', i, 'endDate', e.target.value)} className={inputClass} placeholder="e.g. Present" /></div>
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Description / Responsibilities</label>
                    {exp.description.map((desc, j) => (
                      <div key={j} className="flex gap-4 items-start">
                        <div className="mt-5 w-2 h-2 rounded-full bg-gray-500 shrink-0"></div>
                        <textarea value={desc} onChange={(e) => handleArrayBulletChange('experience', i, j, e.target.value)} className={textareaBulletClass} placeholder="Describe your responsibilities and impact..." />
                        <button onClick={() => removeBullet('experience', i, j)} className="mt-4 text-gray-500 hover:text-red-400 p-2.5 bg-white/5 rounded-xl hover:bg-red-500/10" title="Remove Bullet">
                          <X size={20}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addBullet('experience', i)} className="text-[14px] font-bold text-[var(--color-primary)] hover:text-blue-300 flex items-center gap-2 mt-4 ml-6 px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg transition-colors border border-[var(--color-primary)]/20">
                      <Plus size={18} /> Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: [''] })} className="w-full py-6 border-2 border-dashed border-white/20 rounded-3xl text-gray-300 hover:text-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-base font-extrabold flex justify-center items-center gap-3 transition-all bg-black/20">
                <Plus size={22} /> Add New Experience
              </button>
            </div>
          </Accordion>

          <Accordion title="Projects" icon={Code2}>
            <div className="space-y-10">
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="bg-black/40 p-8 rounded-3xl border border-white/10 relative group shadow-lg">
                  <button onClick={() => removeArrayItem('projects', i)} className="absolute top-6 right-6 text-gray-400 hover:text-red-400 transition-colors p-2.5 bg-white/5 rounded-xl hover:bg-red-500/10">
                    <Trash2 size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pr-16">
                    <div><label className={labelClass}>Project Name</label><input value={proj.name} onChange={(e) => handleArrayChange('projects', i, 'name', e.target.value)} className={inputClass} placeholder="e.g. E-Commerce Platform" /></div>
                    <div><label className={labelClass}>Link</label><input value={proj.link} onChange={(e) => handleArrayChange('projects', i, 'link', e.target.value)} className={inputClass} placeholder="e.g. github.com/user/repo" /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Technologies Used (comma separated)</label><input value={proj.technologies?.join(', ')} onChange={(e) => handleArrayChange('projects', i, 'technologies', e.target.value.split(',').map(s=>s.trim()))} className={inputClass} placeholder="React, Node.js, MongoDB..." /></div>
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Project Description</label>
                    {proj.description.map((desc, j) => (
                      <div key={j} className="flex gap-4 items-start">
                        <div className="mt-5 w-2 h-2 rounded-full bg-gray-500 shrink-0"></div>
                        <textarea value={desc} onChange={(e) => handleArrayBulletChange('projects', i, j, e.target.value)} className={textareaBulletClass} placeholder="Explain what you built and the impact..." />
                        <button onClick={() => removeBullet('projects', i, j)} className="mt-4 text-gray-500 hover:text-red-400 p-2.5 bg-white/5 rounded-xl hover:bg-red-500/10">
                          <X size={20}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addBullet('projects', i)} className="text-[14px] font-bold text-[var(--color-primary)] hover:text-blue-300 flex items-center gap-2 mt-4 ml-6 px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg transition-colors border border-[var(--color-primary)]/20">
                      <Plus size={18} /> Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem('projects', { name: '', technologies: [], link: '', description: [''] })} className="w-full py-6 border-2 border-dashed border-white/20 rounded-3xl text-gray-300 hover:text-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-base font-extrabold flex justify-center items-center gap-3 transition-all bg-black/20">
                <Plus size={22} /> Add New Project
              </button>
            </div>
          </Accordion>

          <Accordion title="Education" icon={GraduationCap}>
            <div className="space-y-10">
              {resumeData.education.map((edu, i) => (
                <div key={i} className="bg-black/40 p-8 rounded-3xl border border-white/10 relative group shadow-lg">
                  <button onClick={() => removeArrayItem('education', i)} className="absolute top-6 right-6 text-gray-400 hover:text-red-400 transition-colors p-2.5 bg-white/5 rounded-xl hover:bg-red-500/10">
                    <Trash2 size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pr-16">
                    <div className="md:col-span-2"><label className={labelClass}>Institution Name</label><input value={edu.institution} onChange={(e) => handleArrayChange('education', i, 'institution', e.target.value)} className={inputClass} placeholder="e.g. Stanford University" /></div>
                    <div><label className={labelClass}>Degree</label><input value={edu.degree} onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)} className={inputClass} placeholder="e.g. B.S. or M.S."/></div>
                    <div><label className={labelClass}>Field of Study</label><input value={edu.field} onChange={(e) => handleArrayChange('education', i, 'field', e.target.value)} className={inputClass} placeholder="e.g. Computer Science"/></div>
                    <div><label className={labelClass}>Start Date</label><input value={edu.startDate} onChange={(e) => handleArrayChange('education', i, 'startDate', e.target.value)} className={inputClass} placeholder="e.g. Aug 2018"/></div>
                    <div><label className={labelClass}>End Date</label><input value={edu.endDate} onChange={(e) => handleArrayChange('education', i, 'endDate', e.target.value)} className={inputClass} placeholder="e.g. May 2022"/></div>
                    <div className="md:col-span-2"><label className={labelClass}>GPA / Grade (Optional)</label><input value={edu.gpa} onChange={(e) => handleArrayChange('education', i, 'gpa', e.target.value)} className={inputClass} placeholder="e.g. 3.9/4.0" /></div>
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })} className="w-full py-6 border-2 border-dashed border-white/20 rounded-3xl text-gray-300 hover:text-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-base font-extrabold flex justify-center items-center gap-3 transition-all bg-black/20">
                <Plus size={22} /> Add Education
              </button>
            </div>
          </Accordion>

          <Accordion title="Skills" icon={Sparkles}>
            <div className="space-y-8">
              <div>
                <label className={labelClass}>Languages</label>
                <textarea placeholder="e.g. JavaScript, Python, C++" value={resumeData.skills.languages?.join(', ')} onChange={(e) => handleSkillsChange('languages', e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
              <div>
                <label className={labelClass}>Frameworks & Libraries</label>
                <textarea placeholder="e.g. React, Next.js, Django, Node.js" value={resumeData.skills.frameworks?.join(', ')} onChange={(e) => handleSkillsChange('frameworks', e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
              <div>
                <label className={labelClass}>Tools & Platforms</label>
                <textarea placeholder="e.g. Git, Docker, AWS, Linux" value={resumeData.skills.tools?.join(', ')} onChange={(e) => handleSkillsChange('tools', e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
            </div>
          </Accordion>
        </div>

        {/* Sticky Live Preview Pane */}
        <div className="flex-1 xl:sticky xl:top-0 h-auto xl:h-[calc(100vh-100px)] flex flex-col gap-4 lg:gap-6 mt-4 xl:mt-0 w-full max-w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1e293b] p-4 lg:p-6 rounded-3xl border border-white/10 shadow-2xl">
            <span className="text-sm lg:text-base font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_#22c55e]"></span> Live Preview
            </span>
            <div className="flex flex-wrap gap-2 lg:gap-4">
              <button onClick={runAiAnalysis} disabled={analyzing} className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-bold transition-colors flex items-center gap-2">
                {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} ATS Check
              </button>
              <button onClick={downloadPDF} className="bg-white text-black hover:bg-gray-200 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-black transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Download size={16} /> Export PDF
              </button>
            </div>
          </div>

          {aiAnalysis && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-3xl shadow-2xl flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                    <span className="text-2xl font-black text-indigo-400">{aiAnalysis.score}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">ATS Analysis</h3>
                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Score out of 100</p>
                  </div>
                </div>
                <button onClick={() => setAiAnalysis(null)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg"><X size={24}/></button>
              </div>
              
              {aiAnalysis.missingKeywords?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-widest">Missing Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.missingKeywords.map((kw, i) => <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-300 rounded-lg text-xs font-bold border border-red-500/20">{kw}</span>)}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-widest">Suggestions</p>
                <ul className="text-sm text-gray-300 space-y-3">
                  {aiAnalysis.suggestions?.map((sug, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl"><span className="text-indigo-400 font-black mt-0.5">•</span> <span className="leading-relaxed">{sug}</span></li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
          
          <div className="flex-1 overflow-auto custom-scrollbar flex xl:justify-center items-start pt-8 pb-20 px-4 bg-[#0f172a] rounded-3xl border border-white/10 shadow-inner w-full max-w-full">
            <div ref={resumeRef} className="shrink-0 transition-all duration-300 shadow-[0_30px_60px_rgba(0,0,0,0.6)] origin-top-left xl:origin-top mx-auto">
              <TemplateRenderer data={resumeData} template={template} themeConfig={themeConfig} scale={0.8} />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilderPage;
