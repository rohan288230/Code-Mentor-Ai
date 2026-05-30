

const TemplateRenderer = ({ data, template, themeConfig, scale = 1 }) => {
  const { themeColor, fontFamily } = themeConfig;
  const { personalInfo, summary, experience, education, projects, skills, certifications } = data;

  const isDark = template === 'Creative Dark';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#111827';
  const mutedColor = isDark ? '#94a3b8' : '#4b5563';
  const borderColor = isDark ? '#1e293b' : '#e5e7eb';

  const renderSectionHeader = (title) => {
    if (template === 'Modern Software Engineer' || template === 'Creative Dark') {
      return <h2 className="text-[16px] font-bold uppercase tracking-widest mb-4 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>{title}</h2>;
    }
    if (template === 'Corporate Professional') {
      return <h2 className="text-[18px] font-bold uppercase mb-3 border-b pb-1" style={{ color: '#111827', borderColor }}>{title}</h2>;
    }
    return <h2 className="text-[16px] font-bold uppercase mb-3 border-b-2 pb-1" style={{ color: themeColor, borderColor }}>{title}</h2>;
  };

  return (
    <div 
      className="w-[816px] h-[1056px] overflow-hidden relative shadow-2xl origin-top-left flex flex-col"
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        fontFamily: fontFamily || 'Inter, sans-serif',
        transform: `scale(${scale})`
      }}
    >
      {/* ========================================================= */}
      {/* 1. Modern Software Engineer (Gradient sidebar, progress bars) */}
      {/* ========================================================= */}
      {template === 'Modern Software Engineer' && (
        <div className="flex h-full">
          {/* Gradient Sidebar */}
          <div className="w-[30%] h-full p-8 text-white flex flex-col gap-8" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #1e1e1e 100%)` }}>
            <div className="text-center">
              {personalInfo.photoUrl && <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/20 object-cover" />}
              <h1 className="text-2xl font-extrabold">{personalInfo.fullName}</h1>
              <p className="text-[13px] uppercase tracking-widest mt-1 text-white/80">Software Engineer</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-1">Contact</h3>
              <div className="text-[12px] space-y-2 text-white/90">
                <p>{personalInfo.email}</p>
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.location}</p>
                <p>{personalInfo.linkedin}</p>
                <p>{personalInfo.github}</p>
              </div>
            </div>

            {skills && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-1">Skills</h3>
                <div className="text-[12px] space-y-4">
                  <div>
                    <strong className="block mb-2 text-[13px]">Languages</strong>
                    <div className="space-y-2">
                      {skills.languages?.slice(0,4).map((s,i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1"><span>{s}</span></div>
                          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${(s.length * 7) % 40 + 60}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-[70%] p-10 flex flex-col gap-6">
            {summary && (
              <section>
                {renderSectionHeader('Profile')}
                <p className="text-[13px] leading-relaxed" style={{ color: mutedColor }}>{summary}</p>
              </section>
            )}
            {experience?.length > 0 && (
              <section>
                {renderSectionHeader('Experience')}
                {experience.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between font-bold text-[14px]">
                      <span style={{ color: themeColor }}>{exp.position}</span>
                      <span className="text-[12px]" style={{ color: mutedColor }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="font-semibold text-[13px] mb-1">{exp.company}</div>
                    <ul className="list-disc pl-4 text-[12px] leading-relaxed" style={{ color: mutedColor }}>
                      {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}
            {projects?.length > 0 && (
              <section>
                {renderSectionHeader('Projects')}
                {projects.map((proj, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between font-bold text-[14px]">
                      <span style={{ color: themeColor }}>{proj.name}</span>
                    </div>
                    <div className="italic text-[12px] mb-1 font-medium">{proj.technologies.join(' • ')}</div>
                    <ul className="list-disc pl-4 text-[12px] leading-relaxed" style={{ color: mutedColor }}>
                      {proj.description.map((desc, j) => <li key={j}>{desc}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}
            {education?.length > 0 && (
              <section>
                {renderSectionHeader('Education')}
                {education.map((edu, i) => (
                  <div key={i} className="flex justify-between text-[13px] mb-2">
                    <div>
                      <strong style={{ color: themeColor }}>{edu.institution}</strong><br/>
                      <span style={{ color: mutedColor }}>{edu.degree} in {edu.field}</span>
                    </div>
                    <div className="text-right text-[12px]" style={{ color: mutedColor }}>
                      {edu.startDate} - {edu.endDate}<br/>
                      GPA: {edu.gpa}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ATS Friendly Template (Minimal, One-column) */}
      {/* ========================================================= */}
      {template === 'ATS Friendly' && (
        <div className="p-12 flex flex-col gap-4">
          <header className="text-center border-b-2 pb-4 mb-2" style={{ borderColor: themeColor }}>
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personalInfo.fullName}</h1>
            <div className="text-[13px] flex flex-wrap justify-center gap-2" style={{ color: mutedColor }}>
              {personalInfo.email && <span>{personalInfo.email} |</span>}
              {personalInfo.phone && <span>{personalInfo.phone} |</span>}
              {personalInfo.location && <span>{personalInfo.location} |</span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin} |</span>}
              {personalInfo.github && <span>{personalInfo.github}</span>}
            </div>
          </header>

          {summary && (
            <p className="text-[13px] leading-relaxed text-justify">{summary}</p>
          )}

          {experience?.length > 0 && (
            <section>
              {renderSectionHeader('Experience')}
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold text-[14px]">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="italic text-[13px] mb-1" style={{ color: themeColor }}>{exp.position}</div>
                  <ul className="list-disc pl-5 text-[12px] leading-relaxed">
                    {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section>
              {renderSectionHeader('Projects')}
              {projects.map((proj, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between font-bold text-[14px]">
                    <span>{proj.name}</span>
                    {proj.link && <span className="text-[12px] font-normal" style={{ color: themeColor }}>{proj.link}</span>}
                  </div>
                  <div className="italic text-[12px] mb-1" style={{ color: mutedColor }}>{proj.technologies.join(', ')}</div>
                  <ul className="list-disc pl-5 text-[12px] leading-relaxed">
                    {proj.description.map((desc, j) => <li key={j}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {skills && (
            <section>
              {renderSectionHeader('Skills')}
              <div className="text-[13px] space-y-1">
                {skills.languages?.length > 0 && <p><strong>Languages:</strong> {skills.languages.join(', ')}</p>}
                {skills.frameworks?.length > 0 && <p><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</p>}
                {skills.tools?.length > 0 && <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>}
              </div>
            </section>
          )}

          {education?.length > 0 && (
            <section>
              {renderSectionHeader('Education')}
              {education.map((edu, i) => (
                <div key={i} className="mb-2 flex justify-between text-[13px]">
                  <div>
                    <span className="font-bold">{edu.institution}</span><br/>
                    <span className="italic" style={{ color: mutedColor }}>{edu.degree} in {edu.field}</span>
                  </div>
                  <div className="text-right">
                    <span>{edu.startDate} - {edu.endDate}</span><br/>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Creative Dark Template (Dark UI, stylish headers) */}
      {/* ========================================================= */}
      {template === 'Creative Dark' && (
        <div className="flex flex-col h-full">
          <header className="h-[220px] flex items-center justify-between px-12 text-white relative overflow-hidden" style={{ backgroundColor: themeColor }}>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="z-10">
              <h1 className="text-5xl font-extrabold uppercase tracking-widest">{personalInfo.fullName}</h1>
              <p className="text-xl font-light mt-2 tracking-widest text-white/80">SOFTWARE ENGINEER</p>
            </div>
            {personalInfo.photoUrl && (
              <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white/20 object-cover shadow-2xl z-10" />
            )}
          </header>
          
          <div className="flex-1 flex px-12 py-8 gap-10">
            <div className="w-1/3 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">Contact</h3>
                <div className="text-[12px] space-y-2 font-medium" style={{ color: mutedColor }}>
                  <p>{personalInfo.location}</p>
                  <p>{personalInfo.phone}</p>
                  <p>{personalInfo.email}</p>
                  <p>{personalInfo.linkedin}</p>
                </div>
              </div>

              {skills && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">Skills</h3>
                  <div className="text-[12px] space-y-2">
                    {skills.languages.map((s,i) => <div key={i} className="px-3 py-1.5 rounded bg-white/5 border border-white/10">{s}</div>)}
                    {skills.frameworks.map((s,i) => <div key={i} className="px-3 py-1.5 rounded bg-white/5 border border-white/10">{s}</div>)}
                  </div>
                </div>
              )}
              
              {education?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">Education</h3>
                  {education.map((edu, i) => (
                    <div key={i} className="mb-3 text-[12px]">
                      <span className="font-bold block text-white">{edu.degree}</span>
                      <span className="block" style={{ color: themeColor }}>{edu.institution}</span>
                      <span className="text-[10px]" style={{ color: mutedColor }}>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-2/3 flex flex-col gap-6">
              {summary && (
                <section>
                  {renderSectionHeader('Profile')}
                  <p className="text-[13px] leading-relaxed font-medium" style={{ color: mutedColor }}>{summary}</p>
                </section>
              )}

              {experience?.length > 0 && (
                <section>
                  {renderSectionHeader('Experience')}
                  {experience.map((exp, i) => (
                    <div key={i} className="mb-5">
                      <div className="flex justify-between font-bold text-[14px]">
                        <span className="text-white">{exp.position}</span>
                        <span className="text-[12px]" style={{ color: themeColor }}>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-[13px] mb-2 font-bold" style={{ color: mutedColor }}>{exp.company}</div>
                      <ul className="list-disc pl-5 text-[12px] leading-relaxed text-gray-400">
                        {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
              
              {projects?.length > 0 && (
                <section>
                  {renderSectionHeader('Projects')}
                  {projects.map((proj, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between font-bold text-[14px] text-white">
                        <span>{proj.name}</span>
                      </div>
                      <div className="text-[11px] mb-1 mt-1 font-mono" style={{ color: themeColor }}>{proj.technologies.join(' / ')}</div>
                      <ul className="list-disc pl-5 text-[12px] leading-relaxed text-gray-400 mt-1">
                        {proj.description.map((desc, j) => <li key={j}>{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Student Fresher Template (Education-first, projects) */}
      {/* ========================================================= */}
      {template === 'Student Fresher' && (
        <div className="p-12 flex flex-col gap-4 h-full">
          <header className="text-center mb-4">
            <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2" style={{ color: themeColor }}>{personalInfo.fullName}</h1>
            <div className="text-[13px] flex flex-wrap justify-center gap-3 font-medium" style={{ color: mutedColor }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
              {personalInfo.github && <span>• {personalInfo.github}</span>}
            </div>
          </header>

          {summary && <p className="text-[13px] leading-relaxed text-center mb-2 italic" style={{ color: mutedColor }}>{summary}</p>}

          {education?.length > 0 && (
            <section>
              <h2 className="text-[16px] font-bold uppercase mb-2 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-2 flex justify-between text-[13px]">
                  <div>
                    <span className="font-extrabold text-[14px]">{edu.institution}</span><br/>
                    <span className="font-semibold">{edu.degree} in {edu.field}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{edu.startDate} - {edu.endDate}</span><br/>
                    {edu.gpa && <span style={{ color: mutedColor }}>Cumulative GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section>
              <h2 className="text-[16px] font-bold uppercase mb-2 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>Technical Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold text-[14px]">
                    <span>{proj.name} | <span className="font-normal italic text-[12px]">{proj.technologies.join(', ')}</span></span>
                    {proj.link && <span className="text-[12px] font-normal" style={{ color: themeColor }}>{proj.link}</span>}
                  </div>
                  <ul className="list-disc pl-5 text-[13px] leading-relaxed mt-1">
                    {proj.description.map((desc, j) => <li key={j}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {experience?.length > 0 && (
            <section>
              <h2 className="text-[16px] font-bold uppercase mb-2 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>Work & Leadership Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold text-[14px]">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="italic text-[13px] mb-1" style={{ color: themeColor }}>{exp.position}</div>
                  <ul className="list-disc pl-5 text-[13px] leading-relaxed">
                    {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {skills && (
            <section>
              <h2 className="text-[16px] font-bold uppercase mb-2 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>Technical Skills</h2>
              <div className="text-[13px] space-y-1">
                {skills.languages?.length > 0 && <p><strong>Languages:</strong> {skills.languages.join(', ')}</p>}
                {skills.frameworks?.length > 0 && <p><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</p>}
                {skills.tools?.length > 0 && <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. Corporate Professional Template (Multi-column clean) */}
      {/* ========================================================= */}
      {template === 'Corporate Professional' && (
        <div className="p-10 flex flex-col h-full bg-[#f8fafc]">
          <header className="mb-6 border-b-4 pb-4" style={{ borderColor: themeColor }}>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{personalInfo.fullName}</h1>
                <p className="text-[16px] font-semibold" style={{ color: themeColor }}>Professional Software Engineer</p>
              </div>
              <div className="text-right text-[12px] text-gray-600 space-y-0.5">
                <p>{personalInfo.email}</p>
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.linkedin}</p>
              </div>
            </div>
          </header>

          <div className="flex gap-8 h-full">
            <div className="w-2/3 flex flex-col gap-5">
              {summary && (
                <section>
                  {renderSectionHeader('Professional Summary')}
                  <p className="text-[13px] leading-relaxed text-gray-700">{summary}</p>
                </section>
              )}

              {experience?.length > 0 && (
                <section>
                  {renderSectionHeader('Professional Experience')}
                  {experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-[15px] text-gray-900">{exp.position}</span>
                        <span className="text-[12px] font-semibold text-gray-500">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-[13px] font-semibold mb-2" style={{ color: themeColor }}>{exp.company}</div>
                      <ul className="list-square pl-4 text-[12px] text-gray-700 leading-relaxed">
                        {exp.description.map((desc, j) => <li key={j} className="mb-1">{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {projects?.length > 0 && (
                <section>
                  {renderSectionHeader('Key Projects')}
                  {projects.map((proj, i) => (
                    <div key={i} className="mb-3">
                      <div className="font-bold text-[14px] text-gray-900 mb-1">{proj.name}</div>
                      <ul className="list-square pl-4 text-[12px] text-gray-700 leading-relaxed">
                        {proj.description.map((desc, j) => <li key={j}>{desc}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="w-1/3 flex flex-col gap-5">
              {skills && (
                <section>
                  {renderSectionHeader('Core Competencies')}
                  <div className="text-[13px] text-gray-700 flex flex-col gap-2">
                    {skills.languages.map((s,i) => <div key={i} className="border-b border-gray-200 pb-1">{s}</div>)}
                    {skills.frameworks.map((s,i) => <div key={i} className="border-b border-gray-200 pb-1">{s}</div>)}
                    {skills.tools.map((s,i) => <div key={i} className="border-b border-gray-200 pb-1">{s}</div>)}
                  </div>
                </section>
              )}

              {education?.length > 0 && (
                <section>
                  {renderSectionHeader('Education')}
                  {education.map((edu, i) => (
                    <div key={i} className="mb-3 text-[13px]">
                      <span className="font-bold text-gray-900 block">{edu.degree}</span>
                      <span className="text-gray-700 block">{edu.institution}</span>
                      <span className="text-[11px] text-gray-500">{edu.startDate} – {edu.endDate}</span>
                    </div>
                  ))}
                </section>
              )}

              {certifications?.length > 0 && (
                <section>
                  {renderSectionHeader('Certifications')}
                  {certifications.map((cert, i) => (
                    <div key={i} className="mb-2 text-[12px]">
                      <span className="font-bold text-gray-900 block">{cert.name}</span>
                      <span className="text-gray-600 block">{cert.issuer}</span>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TemplateRenderer;
