import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, GraduationCap, Sparkles, BookOpen, Layers, 
  Users, Shield, Terminal, Cpu, Atom, Send, ArrowUpRight 
} from 'lucide-react';
import { branches } from '@db';
import './HomePage.css';

// Animated numeric counter that triggers when scrolled into view
function Counter({ value }) {
  const [count, setCount] = useState(0);
  const [hasVisited, setHasVisited] = useState(false);
  const elementRef = useRef(null);
  const numericValue = parseInt(value);
  const isPlus = value.endsWith('+');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasVisited(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasVisited) return;
    if (isNaN(numericValue)) {
      setCount(value);
      return;
    }
    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const stepValue = end / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasVisited, value, numericValue]);

  return <span ref={elementRef}>{count}{isPlus && '+'}</span>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'user', content: 'Explain the Bernoulli principle in fluid dynamics.' },
    { role: 'ai', content: 'Analysis complete. Visualizing fluid flow equation:\n\nP + ½ρv² + ρgh = constant\n\nCalculating dynamic pressure variables...' }
  ]);

  // Handle minor interactive teaser submit
  const handleChatTeaserSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          content: `Redirecting query to full Neural Net Interface...\nInitializing study guide parameters for: "${userMsg}"` 
        }
      ]);
      setTimeout(() => {
        navigate('/study-guide');
      }, 1500);
    }, 800);
  };

  // Maps branch ids to icons and indexes
  const getBranchMeta = (id) => {
    switch (id) {
      case 'IT':
        return { icon: <Terminal size={32} className="text-laser-violet" />, code: '0X01', modules: '24 MODULES' };
      case 'CE':
        return { icon: <Cpu size={32} className="text-laser-violet" />, code: '0X02', modules: '18 MODULES' };
      case 'CSE':
        return { icon: <Atom size={32} className="text-laser-violet" />, code: '0X03', modules: '12 MODULES' };
      default:
        return { icon: <BookOpen size={32} className="text-laser-violet" />, code: '0X00', modules: '8 MODULES' };
    }
  };

  return (
    <div className="page-content">
      {/* 1. Cinematic Hero Section */}
      <section className="hero-section blueprint-grid">
        <div className="hero-grid-overlay"></div>
        <div className="container hero-container animate-fade-up">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span className="text-data-mono">Engineering Research Portal v2.4</span>
          </div>

          <h1 className="hero-title">
            Your Academic <br/>
            <span className="hero-italic-violet">Command Center</span>
          </h1>

          <p className="hero-subtitle">
            Access curated GTU engineering resources, interactive AI study plans, and technical guides designed for the precision required in modern engineering.
          </p>

          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large laser-glow"
              onClick={() => {
                const el = document.getElementById('departments-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Departments</span>
            </button>
            <Link to="/study-guide" className="btn btn-secondary btn-large">
              <span>Try AI Guide</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span className="text-data-mono text-[10px] text-muted">Scroll to Scan</span>
          <div className="scroll-bar">
            <div className="scroll-bar-fill"></div>
          </div>
        </div>
      </section>

      {/* 2. Live Stats Row */}
      <section className="stats-row border-y border-slate-800 bg-slate-900/20">
        <div className="stats-grid">
          <div className="stat-column">
            <span className="text-data-mono text-blueprint-cyan">01 // STREAM_SYNC</span>
            <h3 className="stat-heading"><Counter value="3" /> Streams Modeled</h3>
          </div>
          <div className="stat-column">
            <span className="text-data-mono text-laser-violet">02 // SEM_COVERAGE</span>
            <h3 className="stat-heading"><Counter value="24" /> Semesters Covered</h3>
          </div>
          <div className="stat-column">
            <span className="text-data-mono text-blueprint-cyan">03 // SUBJECT_DATA</span>
            <h3 className="stat-heading"><Counter value="100+" /> Subjects</h3>
          </div>
        </div>
      </section>

      {/* 3. Departments Grid */}
      <section id="departments-section" className="departments-section container scroll-reveal">
        <div className="departments-header border-l-2 border-laser-violet">
          <div>
            <span className="text-data-mono text-laser-violet">Directory</span>
            <h2 className="departments-title">Academic Departments</h2>
          </div>
          <div className="text-data-mono text-muted text-xs">CATALOGUE_V2.0.42</div>
        </div>

        <div className="departments-grid">
          {branches.map((b) => {
            const meta = getBranchMeta(b.id);
            return (
              <Link
                key={b.id}
                to={`/branch/${b.id}`}
                className="department-card group"
              >
                <div className="department-code text-data-mono text-slate-800 group-hover:text-laser-violet">
                  {meta.code}
                </div>
                <div className="department-content">
                  <div className="department-icon-box">
                    {meta.icon}
                  </div>
                  <h3 className="department-name">{b.name}</h3>
                  <p className="department-desc">{b.desc}</p>
                </div>

                <div className="department-footer">
                  <span className="department-modules-tag text-data-mono text-[10px]">
                    {meta.modules}
                  </span>
                  <div className="department-access-btn text-data-mono text-xs">
                    <span>ACCESS</span>
                    <ArrowRight size={14} className="department-arrow" />
                  </div>
                </div>
                <div className="department-bg-deco"></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. AI Assistant Teaser */}
      <section className="ai-teaser-section border-t border-slate-800 bg-slate-900/10">
        <div className="container ai-teaser-grid">
          <div className="ai-teaser-info">
            <span className="text-data-mono text-laser-violet px-3 py-1 border border-laser-violet/20 bg-laser-violet/5">
              NEURAL_NET_INTERFACE v1.0
            </span>
            <h2 className="ai-teaser-title">
              Interactive AI <br/>
              <span className="text-blueprint-cyan">Study Architect</span>
            </h2>
            <p className="ai-teaser-description">
              Input your syllabus or upload your technical notes. Our AI Guide generates high-precision study paths, identifies knowledge gaps, and provides instant schematic-level explanations.
            </p>

            <ul className="ai-teaser-features">
              <li>
                <Sparkles size={16} className="text-laser-violet" />
                <span>Automated Syllabus Parsing</span>
              </li>
              <li>
                <Sparkles size={16} className="text-laser-violet" />
                <span>Knowledge Gap Identification</span>
              </li>
              <li>
                <Sparkles size={16} className="text-laser-violet" />
                <span>24/7 Technical Tutoring</span>
              </li>
            </ul>

            <Link to="/study-guide" className="btn btn-primary mt-6">
              Launch AI Guide Interface
            </Link>
          </div>

          <div className="ai-simulation-wrapper">
            <div className="ai-simulation-container glass-panel">
              <div className="ai-simulation-header">
                <div className="ai-status">
                  <span className="ai-status-dot"></span>
                  <span className="text-data-mono text-xs">nexus_ai_v1_active</span>
                </div>
                <div className="ai-header-controls">
                  <span className="control-box"></span>
                  <span className="control-box"></span>
                </div>
              </div>

              <div className="ai-simulation-messages">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`sim-bubble ${msg.role === 'user' ? 'sim-user' : 'sim-ai'}`}
                  >
                    <div className="sim-bubble-header text-data-mono text-[10px] text-muted">
                      {msg.role === 'user' ? '[User]' : '[AI]'}
                    </div>
                    <p className="sim-bubble-text">{msg.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatTeaserSubmit} className="ai-simulation-input-row">
                <input 
                  type="text" 
                  className="sim-input" 
                  placeholder="Enter query..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="sim-send-btn">
                  <Send size={14} className="text-stark-white" />
                </button>
              </form>
            </div>

            {/* Corner Deco Borders */}
            <div className="deco-corner deco-top-right"></div>
            <div className="deco-corner deco-bottom-left"></div>
          </div>
        </div>
      </section>

      {/* 5. Modern Page Footer */}
      <footer className="home-footer border-t border-slate-800 bg-slate-900">
        <div className="container footer-grid">
          <div className="footer-brand-box">
            <span className="text-data-mono font-bold text-stark-white tracking-tighter text-lg block mb-4">
              NexusLib
            </span>
            <p className="text-data-mono text-[11px] text-muted leading-relaxed max-w-xs">
              The precision platform for GTU engineering students. Access, analyze, and achieve with AI-driven academic tools.
            </p>
          </div>

          <div className="footer-links-columns">
            <div className="footer-column">
              <span className="text-data-mono text-[11px] text-stark-white block mb-4">Resources</span>
              <ul className="footer-links-list text-data-mono text-[11px] text-muted">
                <li><a href="#" className="hover:text-laser-violet transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-laser-violet transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-laser-violet transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <span className="text-data-mono text-[11px] text-stark-white block mb-4">Project</span>
              <ul className="footer-links-list text-data-mono text-[11px] text-muted">
                <li><a href="#" className="hover:text-laser-violet transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-laser-violet transition-colors">Open Source</a></li>
                <li><a href="#" className="hover:text-laser-violet transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom border-t border-slate-800/60 mt-12 pt-6">
          <div className="container footer-bottom-inner">
            <span className="text-data-mono text-[10px] text-muted">
              © {new Date().getFullYear()} NexusLib Engineering. Designed for Excellence.
            </span>
            <div className="footer-bottom-links text-data-mono text-[10px] text-muted">
              <a href="#" className="hover:text-blueprint-cyan">Privacy</a>
              <a href="#" className="hover:text-blueprint-cyan">Security</a>
              <a href="#" className="hover:text-blueprint-cyan">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
