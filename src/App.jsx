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
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/william-xu-willy/" },
    { label: "CellScope.ca", href: "https://cellscope.ca" },
  ],
  sections: ["about", "experience", "projects", "awards", "skills"],
};

const experiences = [
  {
    company: "McMaster University",
    title: "Researcher, Quantum Photonics",
    period: "2024 — Present",
    href: null,
    summary:
      "Built simulation toolchain for SPDC sources on PICs (phasematching, JSA/JSI, Schmidt number, heralding/pair rates). Added parameter sweeps, temperature & dispersion models, publication‑ready plots, and tests.",
    tags: ["Python", "NumPy/SciPy", "Optics", "SPDC", "Simulation"],
  },
  {
    company: "CellScope Limited",
    title: "Founder & President",
    period: "2024 — Present",
    href: "https://cellscope.ca",
    summary:
      "Designed a ~$100 smartphone Fourier Ptychography microscope (LED array, drivers, phase retrieval). Ran demos/workshops, launched e‑commerce, and positioned for education & healthcare.",
    tags: ["Fourier Ptychography", "Raspberry Pi", "Python", "Hardware", "Product"],
  },
  {
    company: "McMaster Biophotonics Lab",
    title: "Research Assistant (Visiting)",
    period: "2023",
    href: null,
    summary:
      "Contributed to shadow imaging/FLIM experiments; built Python utilities for capture/analysis and automation.",
    tags: ["Biophotonics", "Experimentation", "Python"],
  },
];

const projects = [
  {
    name: "SPDC Explorer",
    href: null,
    summary:
      "Interactive notebooks & modules to explore pump bandwidth, waveguide geometry, and temperature on JSA/JSI and heralding.",
    tags: ["Python", "Optics", "Jupyter"],
  },
  {
    name: "CellScope Microscope",
    href: "https://cellscope.ca",
    summary:
      "Smartphone‑based Fourier Ptychography microscope achieving gigapixel reconstructions with <$100 BOM.",
    tags: ["Hardware", "Imaging", "Reconstruction"],
  },
];

const awards = [
  "Regeneron ISEF Finalist — Team Canada (2024)",
  "IEEE Hamilton Section Award (BASEF)",
  "RCM National Gold Medal (Flute)",
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
      
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        {/* 2‑column layout */}
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] lg:grid-cols-[1fr_1.8fr] py-14">
          {/* Left sticky sidebar */}
          <aside className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-10rem)] flex flex-col justify-start">
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>{data.name}</h1>
              <p className={`mt-3 text-lg transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{data.role}</p>
              <p className={`mt-3 max-w-sm transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>{data.blurb}</p>
              <nav className="mt-10 space-y-3 text-sm">
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
            <div className="mt-10 flex items-center gap-3 text-sm">
              <a 
                href={`mailto:${data.email}`} 
                className={`relative transition-colors duration-200 group ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {data.email}
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                  theme === 'dark' ? 'bg-white' : 'bg-black'
                }`}></span>
              </a>
              <span className={`transition-colors duration-500 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>•</span>
              {data.links.map((l) => (
                <a 
                  key={l.href} 
                  href={l.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`relative transition-colors duration-200 group ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                    theme === 'dark' ? 'bg-white' : 'bg-black'
                  }`}></span>
                </a>
              ))}
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
                      <p className={`mt-2 leading-relaxed transition-colors duration-500 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{e.summary}</p>
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
                          {p.name} ↗
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
                    <p className={`mt-2 leading-relaxed transition-colors duration-500 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{p.summary}</p>
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
                <ul className="grid sm:grid-cols-2 gap-2">
                  {awards.map((a, i) => (
                    <li key={i} className={`transition-colors duration-500 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>• {a}</li>
                  ))}
                </ul>
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
