import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { Sun, Moon, BookOpen, Menu, X, Upload, Bot, Search, LogOut } from 'lucide-react';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Monitor scroll behavior: morph style and direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > 80) {
        if (currentScrollY > prevScrollY) {
          setVisible(false); // scrolling down, hide navbar
        } else {
          setVisible(true); // scrolling up, show navbar
        }
      } else {
        setVisible(true);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Keydown listener for Command Palette shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const links = [
    { to: '/',            label: 'Home' },
    { to: '/study-guide', label: 'AI Guide', icon: <Bot size={14} /> },
    { to: '/upload',      label: 'Upload',   icon: <Upload size={14} /> },
  ];

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleSearchToggle = () => {
    setSearchOpen(true);
  };

  return (
    <>
      <nav 
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!visible ? 'navbar--hidden' : ''} ${open ? 'navbar--drawer-open' : ''}`}
        aria-label="Main Navigation"
      >
        <div className="container navbar__inner">
          <Link to="/" className="navbar__logo" aria-label="NexusLib Home">
            <BookOpen size={22} className="navbar__logo-icon" />
            <span className="navbar__logo-text">NexusLib</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar__links-desktop">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`navbar__link ${location.pathname === l.to ? 'navbar__link--active' : ''}`}
              >
                {l.icon && <span className="navbar__link-icon">{l.icon}</span>}
                <span className="navbar__link-label">{l.label}</span>
              </Link>
            ))}
          </div>

          <div className="navbar__actions">
            {/* Search Button with Keyboard Hint */}
            <button 
              className="search-toggle" 
              onClick={handleSearchToggle} 
              aria-label="Open Search Palette"
            >
              <Search size={16} />
              <span className="kbd-shortcut">⌘K</span>
            </button>

            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle visual theme">
              {theme === 'dark' && <Sun size={16} />}
              {theme === 'light' && <Moon size={16} />}
              {theme === 'dim' && <Sun size={16} style={{ opacity: 0.7 }} />}
              {theme === 'amoled' && <Sun size={16} style={{ color: 'var(--primary-base)' }} />}
            </button>

            {/* Authentication Avatar / Dropdown */}
            {user ? (
              <div className="navbar__profile-container" ref={dropdownRef}>
                <button 
                  className="navbar__avatar-btn" 
                  onClick={() => setDropdownOpen(d => !d)}
                  aria-expanded={dropdownOpen}
                  aria-label="Open user menu"
                >
                  <div className="navbar__avatar">
                    {getInitials(user.name)}
                  </div>
                </button>
                
                {dropdownOpen && (
                  <div className="navbar__dropdown surface-floating animate-slide-down">
                    <div className="navbar__dropdown-header">
                      <p className="navbar__dropdown-name">{user.name}</p>
                      <p className="navbar__dropdown-email">{user.email}</p>
                    </div>
                    <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
                    <button 
                      onClick={logout} 
                      className="navbar__dropdown-action"
                      role="menuitem"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-desktop">
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Join Free</Link>
              </div>
            )}

            {/* Hamburger Trigger for Mobile */}
            <button 
              className="navbar__burger" 
              onClick={() => setOpen(o => !o)} 
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-In Navigation Drawer */}
        <div className={`navbar__drawer surface-glass ${open ? 'navbar__drawer--open' : ''}`}>
          <div className="navbar__drawer-content">
            <div className="navbar__drawer-links">
              {links.map((l, index) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`navbar__drawer-link ${location.pathname === l.to ? 'navbar__drawer-link--active' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {l.icon}
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="divider" />
            
            <div className="navbar__drawer-footer">
              {user ? (
                <div className="navbar__drawer-user">
                  <div className="navbar__avatar">{getInitials(user.name)}</div>
                  <div className="navbar__drawer-user-info">
                    <p className="navbar__drawer-user-name">{user.name}</p>
                    <button onClick={logout} className="btn btn-secondary btn-sm mt-2">
                      <LogOut size={12} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="navbar__drawer-auth">
                  <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>Sign In</Link>
                  <Link to="/signup" className="btn btn-primary mt-2" style={{ width: '100%' }}>Join Free</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
