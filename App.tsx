import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Briefcase, 
  Code, 
  Cpu, 
  MessageSquare,
  Download,
  GraduationCap
} from 'lucide-react';
import { RESUME_DATA, API_URL } from './constants';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { personalInfo, experience, education, projects, skills } = RESUME_DATA;

  // Handle responsive checks
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Open chat by default on desktop after a short delay
    if (window.innerWidth >= 1024) {
        const timer = setTimeout(() => setIsChatOpen(true), 1500);
        return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header / Hero Section */}
        <header className="mb-16 text-center lg:text-left lg:flex lg:items-end lg:justify-between border-b border-slate-800 pb-12 animate-fade-in-up">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-100 tracking-tight">
                {personalInfo.name}
              </h1>
              <p className="text-xl sm:text-2xl text-slate-400 font-light">
                {personalInfo.title}
              </p>
            </div>
            
            <p className="max-w-2xl text-slate-400 leading-relaxed">
              {personalInfo.bio}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all text-sm">
                <Mail size={16} /> {personalInfo.email}
              </a>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm">
                <MapPin size={16} /> {personalInfo.location}
              </div>
            </div>

            <div className="flex gap-4 justify-center lg:justify-start">
                {personalInfo.socials.github && (
                   <a href={`https://${personalInfo.socials.github}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
                       <Github size={24} />
                   </a>
                )}
                {personalInfo.socials.linkedin && (
                   <a href={`https://${personalInfo.socials.linkedin}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
                       <Linkedin size={24} />
                   </a>
                )}
                 {personalInfo.socials.twitter && (
                   <a href={`https://twitter.com/${personalInfo.socials.twitter}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
                       <Twitter size={24} />
                   </a>
                )}
            </div>
          </div>

          <div className="mt-8 lg:mt-0 hidden lg:block">
             <a 
                href={`${API_URL}/me/cv`}
                download="CV_PALTSOKAS_PANAGIOTIS.pdf"
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-white transition-all shadow-lg shadow-white/5 active:scale-95"
             >
               <Download size={18} />
               Download Resume
             </a>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Experience Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-8">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Briefcase size={24} />
                </div>
                Experience
              </h2>
              <div className="space-y-8 border-l-2 border-slate-800 pl-8 ml-4">
                {experience.map((job) => (
                  <div key={job.id} className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-slate-950 bg-indigo-500 group-hover:scale-125 transition-transform"></div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-xl font-semibold text-slate-200">{job.role}</h3>
                        <span className="text-sm font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          {job.period}
                        </span>
                      </div>
                      <div className="text-indigo-400 font-medium">{job.company}</div>
                      <p className="text-slate-400 leading-relaxed">{job.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {job.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-8">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <GraduationCap size={24} />
                </div>
                Education
              </h2>
              <div className="grid gap-6">
                {education.map((edu) => (
                   <div key={edu.id} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                         <h3 className="text-lg font-bold text-slate-200">{edu.degree}</h3>
                         <div className="text-slate-400">{edu.school}</div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <span className="text-sm font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 mb-1">
                           {edu.year}
                         </span>
                         {edu.grade && <span className="text-xs text-indigo-400 font-medium">Grade: {edu.grade}</span>}
                      </div>
                   </div>
                ))}
              </div>
            </section>

            {/* Projects Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-8">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Code size={24} />
                </div>
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => {
                  const hasPdf = project.pdfPath !== undefined;
                  const pdfUrl = hasPdf ? `${API_URL}/kb/pdf/${encodeURIComponent(project.pdfPath)}` : null;
                  
                  const ProjectContent = (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                        {hasPdf && (
                          <ExternalLink size={18} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-4 min-h-[3rem]">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                         {project.technologies.map((tech) => (
                            <span key={tech} className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {tech}
                            </span>
                          ))}
                      </div>
                    </>
                  );
                  
                  if (hasPdf && pdfUrl) {
                    return (
                      <a
                        key={project.id}
                        href={pdfUrl}
                        download
                        className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-colors hover:bg-slate-800/50 cursor-pointer block"
                      >
                        {ProjectContent}
                      </a>
                    );
                  }
                  
                  return (
                    <div key={project.id} className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-colors hover:bg-slate-800/50">
                      {ProjectContent}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column (Skills & Tech) */}
          <div className="space-y-12">
            
            {/* Skills Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-8">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <Cpu size={24} />
                </div>
                Technical Skills
              </h2>
              <div className="space-y-6">
                {skills.map((category) => (
                  <div key={category.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <div key={skill} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 hover:text-white transition-colors cursor-default">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-xl font-bold mb-2">Want to chat?</h3>
              <p className="text-indigo-100 mb-4 text-sm">
                My virtual self can tell you about my mathematics background, my shift to AI, or my favorite movies!
              </p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full py-2 px-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                Chat with Virtual Panos
              </button>
            </div>

          </div>
        </main>

        <footer className="mt-24 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} {personalInfo.name}. Built with React, Tailwind, and Gemini API.</p>
        </footer>
      </div>

      {/* Floating Chat Button (Only visible if chat is closed) */}
      <button
        onClick={toggleChat}
        className={`fixed z-40 bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-2xl hover:bg-indigo-500 transition-all duration-300 hover:scale-110 active:scale-95 ${isChatOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        isMobile={isMobile}
      />
    </div>
  );
};

export default App;