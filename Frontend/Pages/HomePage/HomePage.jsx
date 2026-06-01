import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, GraduationCap, Sparkles, BookOpen, Layers, Users, Shield } from 'lucide-react';
import { branches, semesters } from '@db';
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
  const title1 = "Your Academic";
  const title2 = "Edge Starts Here";

  const renderRevealText = (text, startDelay = 0) => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="reveal-char" 
        style={{ animationDelay: `${startDelay + index * 0.025}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="page-content">
      {/* Cinematic Hero Section */}
      <section className="hero hero-gradient-mesh">
        <div className="container hero__container">
          <div className="hero__badge animate-fade-up">
            <GraduationCap size={14} className="hero__badge-icon" />
            <span>GTU Engineering Resources</span>
          </div>

          <h1 className="hero__title">
            <div className="hero__title-row">{renderRevealText(title1, 0.2)}</div>
            <div className="hero__title-row hero__accent">{renderRevealText(title2, 0.6)}</div>
          </h1>

          <p className="hero__sub animate-fade-up delay-300">
            Access curated study materials, syllabus sheets, PYQs, and interactive AI-guided study plans
            tailored for IT, CE, and CSE semesters at GTU.
          </p>

          <div className="hero__actions animate-fade-up delay-400">
            <Link to="/branch/IT/semester/6/subject/Artificial%20Intelligence" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Explore AI Subject</span>
            </Link>
            <Link to="/study-guide" className="btn btn-secondary">
              <span>Try AI Study Guide</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Branch Grid */}
      <section className="section branch-section scroll-reveal">
        <div className="container">
          <div className="section__header">
            <span className="section__sub-tag">Academic Disciplines</span>
            <h2>Select Your Department</h2>
            <p className="text-secondary">Explore reference textbooks, question papers, and AI guides for your stream.</p>
          </div>

          <div className="branch-grid">
            {branches.map((b, i) => (
              <Link
                key={b.id}
                to={`/branch/${b.id}`}
                className="branch-card surface-glass"
                style={{ 
                  '--branch-color': b.color,
                  animationDelay: `${i * 0.15}s`
                }}
              >
                <div className="branch-card__accent" />
                <span className="badge badge-accent branch-card__tag">{b.tag}</span>
                <h3 className="branch-card__name">{b.name}</h3>
                <p className="branch-card__desc">{b.desc}</p>
                <div className="branch-card__footer">
                  <span className="branch-card__count">{semesters[b.id].length} Semesters</span>
                  <ArrowUpRight size={18} className="branch-card__arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="section stats-section scroll-reveal">
        <div className="container">
          <div className="stats-grid">
            {[
              { val: '3',    label: 'Streams Modeled', icon: <Layers size={20} /> },
              { val: '24',   label: 'Semesters Covered', icon: <BookOpen size={20} /> },
              { val: '100+', label: 'Available Subjects', icon: <Users size={20} /> },
              { val: '6',    label: 'Resource Categories', icon: <Shield size={20} /> },
            ].map((s, i) => (
              <div 
                key={i} 
                className="stat-card surface-glass"
              >
                <div className="stat-card__icon">{s.icon}</div>
                <div className="stat-card__val">
                  <Counter value={s.val} />
                </div>
                <div className="stat-card__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Page Footer */}
      <footer className="footer mt-auto">
        <div className="container footer__container">
          <div className="footer__branding">
            <Link to="/" className="footer__logo">
              <BookOpen size={20} />
              <span>NexusLib</span>
            </Link>
            <p className="footer__desc mt-2">
              GTU Engineering study portal. Free open source repository of question sheets, reference slides, and AI study schedules.
            </p>
          </div>
          
          <div className="footer__links-group">
            <span className="footer__links-title">Quick Links</span>
            <div className="footer__links">
              <Link to="/">Home</Link>
              <Link to="/study-guide">AI Study Guide</Link>
              <Link to="/upload">Upload Document</Link>
            </div>
          </div>

          <div className="footer__social-proof">
            <span className="footer__links-title">Engagement</span>
            <p className="text-secondary text-sm">Trusted by 10,000+ GTU engineering students weekly.</p>
          </div>
        </div>
        
        <div className="footer__bottom">
          <div className="container footer__bottom-inner">
            <span>&copy; {new Date().getFullYear()} NexusLib. Designed for Engineering Excellence.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
