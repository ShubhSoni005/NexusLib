import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, BookOpen, Menu, X, Upload, Bot } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/study-guide', label: 'AI Guide', icon: <Bot size={14} /> },
    { to: '/upload', label: 'Upload', icon: <Upload size={14} /> },
  ];

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <BookOpen size={20} />
          <span>EduShare</span>
        </Link>

        <div className={`navbar__links${open ? ' navbar__links--open' : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar__link${location.pathname === l.to ? ' navbar__link--active' : ''}`}
            >
              {l.icon && l.icon}
              {l.label}
            </Link>
          ))}
          <div className="navbar__divider" />
          <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Join Free</Link>
        </div>

        <div className="navbar__actions">
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="navbar__burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
