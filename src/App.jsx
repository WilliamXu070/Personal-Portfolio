import React, { useState, createContext, useContext, useEffect } from "react";

// Brittany Chiang–style layout: sticky left sidebar (name, role, intro, section nav)
// with a scrollable right content column using lighthearted light/dark theme. Tailwind only.
// Note: keep content minimal & fast. Adjust data below as needed.

const ThemeContext = createContext();

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full transition-all duration-500 ease-in-out ${
        theme === 'dark' 
          ? 'bg-gray-800' 
          : 'bg-gray-200'
      } shadow-lg hover:shadow-xl transform hover:scale-105`}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 ease-in-out transform ${
          theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {theme === 'dark' ? (
            <span className="text-white text-sm">🌙</span>
          ) : (
            <span className="text-black text-sm">☀️</span>
          )}
        </div>
      </div>
    </button>
  );
};

const data = {
  name: "William Xu",
  role: "Engineering Science @ UofT",
  tagline: "Quantum • Semiconductors • ML • Founder of CellScope Limited",
  blurb:
    "I build high‑performance, accessible scientific software and hardware — from quantum/photonic simulation tools to $100 smartphone microscopes. I'm focused on research and product that scale impact.",
  email: "willy.xu@mail.utoronto.ca",
  phone: "+1 (416) 123-4567", // <-- Add your real phone number here
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/william-xu-willy/", icon: "linkedin" },
    { label: "CellScope.ca", href: "https://cellscope.ca", icon: "globe" },
    { label: "GitHub", href: "https://github.com/WilliamXu070", icon: "github" },
  ],
  sections: ["about", "experience", "projects", "awards", "skills"],
};

const experiences = [
  {
    company: "McMaster University",
    title: "Researcher, Quantum Photonics",
    period: "2024 — Present",
    href: null,
    summary: [
      "Built end-to-end SPDC simulation toolchain on PICs (phasematching, JSA/JSI, Schmidt number, heralding/pair rates)",
      "Implemented parameter sweeps, temperature/dispersion models, and automated testing",
      "Produced publication-ready plots enabling rapid research iteration"
    ],
    tags: ["Python", "NumPy/SciPy", "Optics", "SPDC", "Simulation"],
  },
  {
    company: "CellScope Limited",
    title: "Founder & President",
    period: "2024 — Present",
    href: "https://cellscope.ca",
    summary: [
      "Designed ~$100 smartphone Fourier Ptychography microscope rivaling $40k lab systems",
      "Engineered LED array drivers + phase retrieval algorithms on embedded hardware",
      "Led demos/workshops, launched e-commerce platform, and positioned product for education & healthcare markets"
    ],
    tags: ["Fourier Ptychography", "Raspberry Pi", "Python", "Hardware", "Product"],
  },
  {
    company: "McMaster Biophotonics Lab",
    title: "Research Assistant",
    period: "2023",
    href: null,
    summary: [
      "Contributed to shadow imaging and FLIM experiments with novel setups",
      "Developed Python utilities for automated data capture, analysis, and workflow acceleration"
    ],
    tags: ["Biophotonics", "Experimentation", "Python"],
  },
];


const projects = [
  {
    name: "AR Reference Pose (Hack the North 2025)",
    href: "https://devpost.com/software/ar-reference-pose?ref_content=my-projects-tab&ref_feature=my_projects",
    summary: [
      "Built AR pipeline with AI-based 3D model generation + pose detection",
      "Integrated CV with Snap Spectacles for real-time artist guidance",
      "Led full-stack dev (Node.js backend, 3D auto-rigging, live AR rendering)",
    ],
    tags: ["AR", "AI", "Hackathon", "Node.js", "3D"],
  },
  {
    name: "FrameGen — Deep Learning Video Frame Interpolation",
    href: "https://github.com/WilliamXu070/framegen",
    summary: [
      "Developed PyTorch pipeline for video frame interpolation (UCF101 dataset)",
      "Implemented YAML configs for reproducible training + inference",
      "Optimized training on RTX 5070 + Apple M4 Pro (MPS acceleration)",
      "Explored slow-motion video + AR/VR animation applications"
    ],
    tags: ["PyTorch", "Deep Learning", "Video", "AI", "GPU"],
  },
  {
    name: "SPDC Explorer",
    href: null,
    summary: [
      "Created interactive notebooks to study SPDC physics",
      "Explored pump bandwidth, waveguide geometry, and temperature effects",
      "Visualized JSA/JSI and heralding efficiency"
    ],
    tags: ["Python", "Optics", "Jupyter"],
  },
  {
    name: "CellScope Microscope",
    href: "https://cellscope.ca",
    summary: [
      "Designed <$100 smartphone Fourier Ptychography microscope",
      "Achieved gigapixel reconstructions rivaling $40k lab systems",
      "Launched as accessible tool for education + healthcare"
    ],
    tags: ["Hardware", "Imaging", "Reconstruction"],
  },
];


const awards = [
  {
    title: "Schulich Leader Scholarship",
    details: [
      "$120,000 scholarship to pursue Engineering Science at the University of Toronto",
      "Canada’s most coveted and prestigious STEM scholarship",
      "Top 100 undergraduate students in STEM & entrepreneurship across Canada"
    ],
    issuer: "Governor General of Canada",
    date: "Jun 2025"
  },
  {
    title: "Governor General’s Academic Medal",
    details: [
      "Awarded to the graduating student with the highest academic average at a Canadian secondary school.",
      "Presented by the Governor General of Canada, Mary Simon."
    ],
    issuer: "Governor General of Canada",
    date: "Jun 2025"
  },
  {
    title: "Regeneron ISEF Finalist",
    details: [
      "One of ≈1,800 finalists worldwide at the world’s largest pre-college STEM competition",
      "Represented Team Canada among finalists from 80+ countries, regions, and territories, showcasing independent research"
    ],
    issuer: "Society for Science",
    date: "May 2024"
  },
];

const skills = [
  "Python", "NumPy", "SciPy", "Matplotlib", "C/C++", "Git", "Linux",
  "Fourier Ptychography", "SPDC/Optics", "Raspberry Pi", "3D Printing", "CAD",
];

const Pill = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs transition-colors duration-300 ${
      theme === 'dark' 
        ? 'border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:border-gray-500' 
        : 'border border-gray-400 bg-gray-200 text-gray-800 hover:bg-gray-300 hover:border-gray-500'
    }`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
      theme === 'dark' 
        ? 'border border-gray-700 bg-gray-900/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-gray-600 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-white/10' 
        : 'border border-gray-300 bg-gray-100/80 shadow-[inset_0_1px_0_rgba(0,0,0,0.1)] hover:border-gray-400 hover:bg-gray-200/90 hover:shadow-lg hover:shadow-black/10'
    } ${className}`}>
      {children}
    </div>
  );
};

const SectionHeader = ({ id, title }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <h2 id={id} className={`text-xl md:text-2xl font-semibold tracking-tight mb-4 transition-colors duration-500 ${
      theme === 'dark' ? 'text-white' : 'text-black'
    }`}>
      {title}
    </h2>
  );
};

export default function PersonalSite() {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('about');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Scroll detection to highlight current section
  useEffect(() => {
    const handleScroll = () => {
      const sections = data.sections;
      const scrollPosition = window.scrollY + 150; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeValue = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <div className={`min-h-screen transition-all duration-700 ease-in-out ${
        theme === 'dark' 
          ? 'bg-black text-white' 
          : 'bg-white text-black'
      }`}>
      {/* Theme Toggle at the very top */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 lg:px-12 overflow-x-hidden">
        {/* Responsive 1 or 2‑column layout */}
        <div className="flex flex-col md:grid md:gap-10 md:grid-cols-[1fr_1.6fr] lg:grid-cols-[1fr_1.8fr] py-8 sm:py-12 md:py-14">
          {/* Left sticky sidebar */}
          <aside className="w-full md:sticky md:top-20 md:self-start md:h-[calc(100vh-10rem)] flex flex-col justify-start mb-8 md:mb-0">
            <div>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>{data.name}</h1>
              <p className={`mt-3 text-base sm:text-lg transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{data.role}</p>
              <p className={`mt-3 max-w-sm transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>{data.blurb}</p>
              <nav className="mt-8 sm:mt-10 space-y-2 sm:space-y-3 text-sm flex flex-wrap gap-2 sm:block sm:gap-0">
                {data.sections.map((s) => (
                  <a 
                    key={s} 
                    href={`#${s}`} 
                    className={`group flex items-center gap-3 transition-all duration-300 ${
                      activeSection === s 
                        ? (theme === 'dark' 
                            ? 'text-white' 
                            : 'text-black')
                        : (theme === 'dark' 
                            ? 'text-gray-400 hover:text-white' 
                            : 'text-gray-600 hover:text-black')
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span className={`h-px transition-all duration-300 ${
                      activeSection === s 
                        ? (theme === 'dark' 
                            ? 'w-16 bg-white/80' 
                            : 'w-16 bg-black/80')
                        : (theme === 'dark' 
                            ? 'w-10 bg-gray-400/20 group-hover:bg-white/60 group-hover:w-16' 
                            : 'w-10 bg-gray-400/20 group-hover:bg-black/60 group-hover:w-16')
                    }`} />
                    <span className="uppercase tracking-wider relative">
                      {s}
                      <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                        activeSection === s 
                          ? (theme === 'dark' 
                              ? 'w-full bg-white' 
                              : 'w-full bg-black')
                          : (theme === 'dark' 
                              ? 'w-0 bg-white group-hover:w-full' 
                              : 'w-0 bg-black group-hover:w-full')
                      }`}></span>
                    </span>
                  </a>
                ))}
              </nav>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm pl-0 sm:pl-2 md:pl-4">
              <span className={`transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>{data.email}</span>
              <span className={`transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              } hidden sm:inline`}>•</span>
              <span className={`transition-colors duration-200 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              } whitespace-nowrap`}>{data.phone}</span>
              <span className={`transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              } hidden sm:inline`}>•</span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {data.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`relative transition-colors duration-200 group flex items-center gap-1 ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {l.icon === 'linkedin' && (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z"/></svg>
                    )}
                    {l.icon === 'github' && (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    )}
                    {l.icon === 'globe' && (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c1.657 0 3.156.672 4.242 1.758A5.978 5.978 0 0 0 18 12c0 1.306-.418 2.512-1.133 3.5A7.963 7.963 0 0 1 12 20a7.963 7.963 0 0 1-4.867-4.5A5.978 5.978 0 0 0 6 12c0-1.306.418-2.512 1.133-3.5A7.963 7.963 0 0 0 12 4zm0 2a5.978 5.978 0 0 0-4.242 1.758A5.978 5.978 0 0 0 6 12c0 1.306.418 2.512 1.133 3.5A7.963 7.963 0 0 0 12 20a7.963 7.963 0 0 0 4.867-4.5A5.978 5.978 0 0 0 18 12c0-1.306-.418-2.512-1.133-3.5A7.963 7.963 0 0 0 12 6z"/></svg>
                    )}
                    <span className="sr-only">{l.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Right content column */}
          <main className="space-y-16 pb-20">
            {/* About */}
            <section 
              id="about"
              className={`transition-all duration-500 ${
                hoveredSection === 'about' 
                  ? 'opacity-100' 
                  : hoveredSection 
                    ? 'opacity-50' 
                    : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSection('about')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <SectionHeader id="about" title="About" />
              <Card className={hoveredSection === 'about' ? (theme === 'dark' ? 'ring-1 ring-white/50' : 'ring-1 ring-black/50') : ''}>
                <p className={`leading-relaxed transition-colors duration-500 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Schulich Leader Scholar (EngSci 2025). Researcher in quantum photonics & biophotonics; founder of CellScope — a ~$100 smartphone Fourier Ptychography microscope rivaling ~$40k lab systems. Regeneron ISEF Finalist.
                </p>
              </Card>
            </section>

            {/* Experience */}
            <section 
              id="experience"
              className={`transition-all duration-500 ${
                hoveredSection === 'experience' 
                  ? 'opacity-100' 
                  : hoveredSection 
                    ? 'opacity-50' 
                    : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSection('experience')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <SectionHeader id="experience" title="Experience" />
              <div className="space-y-6">
                {experiences.map((e, i) => (
                  <div key={i} className="grid grid-cols-[10ch_1fr] gap-6">
                    <div className={`text-sm mt-1 transition-colors duration-500 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{e.period}</div>
                    <Card className={hoveredSection === 'experience' ? (theme === 'dark' ? 'ring-1 ring-white/50' : 'ring-1 ring-black/50') : ''}>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className={`text-base md:text-lg font-medium transition-colors duration-500 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>{e.title}</h3>
                        <span className={`transition-colors duration-500 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>·</span>
                        {e.href ? (
                          <a 
                            href={e.href} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={`relative transition-colors duration-200 group ${
                              theme === 'dark' 
                                ? 'text-gray-300 hover:text-white' 
                                : 'text-gray-700 hover:text-black'
                            }`}
                          >
                            {e.company} ↗
                            <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                              theme === 'dark' ? 'bg-white' : 'bg-black'
                            }`}></span>
                          </a>
                        ) : (
                          <span className={`transition-colors duration-500 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{e.company}</span>
                        )}
                      </div>
                      {/* Summary: support string or array (bullet points) */}
                      {Array.isArray(e.summary) ? (
                        <ul className="list-disc pl-6 mt-2 text-sm transition-colors duration-500" style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}>
                          {e.summary.map((point, idx) => (
                            <li key={idx} className="mb-2" style={{ textIndent: 0, paddingLeft: 0, marginLeft: 0, textAlign: 'start', listStylePosition: 'outside' }}>
                              <span style={{ display: 'block', paddingLeft: '0.2em', textIndent: '-0.2em', marginLeft: 0 }}>
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`mt-2 leading-relaxed transition-colors duration-500 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>{e.summary}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {e.tags.map((t) => (
                          <Pill key={t}>{t}</Pill>
                        ))}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section 
              id="projects"
              className={`transition-all duration-500 ${
                hoveredSection === 'projects' 
                  ? 'opacity-100' 
                  : hoveredSection 
                    ? 'opacity-50' 
                    : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSection('projects')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <SectionHeader id="projects" title="Projects" />
              <div className="space-y-6">
                {projects.map((p, i) => (
                  <Card key={i} className={hoveredSection === 'projects' ? (theme === 'dark' ? 'ring-1 ring-white/50' : 'ring-1 ring-black/50') : ''}>
                    <div className="flex items-baseline gap-2">
                      {p.href ? (
                        <a 
                          href={p.href} 
                          target="_blank" 
                          rel="noreferrer" 
                          className={`relative text-lg font-medium transition-colors duration-200 group ${
                            theme === 'dark' 
                              ? 'text-white hover:text-white' 
                              : 'text-black hover:text-black'
                          }`}
                        >
                          <span>{p.name}</span>
                          <span className="ml-1 align-middle text-base font-normal">↗</span>
                          <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                            theme === 'dark' ? 'bg-white' : 'bg-black'
                          }`}></span>
                        </a>
                      ) : (
                        <h3 className={`text-lg font-medium transition-colors duration-500 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>{p.name}</h3>
                      )}
                    </div>
                    {/* Summary: support string or array (bullet points) */}
                    {Array.isArray(p.summary) ? (
                      <ul className="list-disc pl-6 mt-2 text-sm transition-colors duration-500" style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}>
                        {p.summary.map((point, idx) => (
                          <li key={idx} className="mb-2" style={{ textIndent: 0, paddingLeft: 0, marginLeft: 0, textAlign: 'start', listStylePosition: 'outside' }}>
                            <span style={{ display: 'block', paddingLeft: '0.2em', textIndent: '-0.2em', marginLeft: 0 }}>
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`mt-2 leading-relaxed transition-colors duration-500 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{p.summary}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Awards */}
            <section 
              id="awards"
              className={`transition-all duration-500 ${
                hoveredSection === 'awards' 
                  ? 'opacity-100' 
                  : hoveredSection 
                    ? 'opacity-50' 
                    : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSection('awards')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <SectionHeader id="awards" title="Awards & Honours" />
              <Card className={hoveredSection === 'awards' ? (theme === 'dark' ? 'ring-1 ring-white/50' : 'ring-1 ring-black/50') : ''}>
                <div className="space-y-4">
                  {awards.map((a, i) => (
                    <div key={i}>
                      <h4 className={`text-base font-semibold transition-colors duration-500 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>{a.title}</h4>
                      <ul className="list-disc pl-6 text-sm transition-colors duration-500" style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}>
                        {a.details.map((detail, j) => (
                          <li key={j} className="mb-2" style={{ textIndent: 0, paddingLeft: 0, marginLeft: 0, textAlign: 'start', listStylePosition: 'outside' }}>
                            <span style={{ display: 'block', paddingLeft: '0.2em', textIndent: '-0.2em', marginLeft: 0 }}>
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className={`text-xs mt-1 transition-colors duration-500 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>Issued by {a.issuer} on {a.date}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Skills */}
            <section 
              id="skills"
              className={`transition-all duration-500 ${
                hoveredSection === 'skills' 
                  ? 'opacity-100' 
                  : hoveredSection 
                    ? 'opacity-50' 
                    : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredSection('skills')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <SectionHeader id="skills" title="Skills" />
              <Card className={hoveredSection === 'skills' ? (theme === 'dark' ? 'ring-1 ring-white/50' : 'ring-1 ring-black/50') : ''}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
    </ThemeContext.Provider>
  );
}
