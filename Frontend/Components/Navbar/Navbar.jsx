import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { 
  Sun, Moon, BookOpen, Search, LogOut, Terminal, 
  Settings, HelpCircle, LayoutDashboard, BrainCircuit, 
  FolderHeart, UploadCloud, UserCircle, RefreshCw
} from 'lucide-react';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Parse path parameters for context-aware semester quick filters
  const pathSegments = location.pathname.split('/').filter(Boolean);
  let activeBranch = 'IT'; // default fallback
  if (pathSegments[0] === 'branch' && pathSegments[1]) {
    activeBranch = pathSegments[1].toUpperCase();
  }

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

  const handleSemesterClick = (semNum) => {
    navigate(`/branch/${activeBranch}/semester/${semNum}`);
  };

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Link lists for navigation
  const sidebarLinks = [
    { to: '/',            label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/branch/IT',   label: 'Disciplines', icon: <BookOpen size={18} /> },
    { to: '/study-guide', label: 'AI Assistant', icon: <BrainCircuit size={18} /> },
    { to: '/upload',      label: 'My Uploads', icon: <UploadCloud size={18} /> }
  ];

  return (
    <>
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="navbar-top-header surface-glass">
        <div className="navbar-top-left">
          <Link to="/" className="navbar-top-logo">
            <span className="navbar-top-logo-text">NexusLib</span>
          </Link>
          <div className="navbar-top-links-desktop">
            <Link 
              to="/branch/IT" 
              className={`navbar-top-link ${location.pathname.startsWith('/branch') ? 'navbar-top-link--active' : ''}`}
            >
              Disciplines
            </Link>
            <Link 
              to="/study-guide" 
              className={`navbar-top-link ${location.pathname === '/study-guide' ? 'navbar-top-link--active' : ''}`}
            >
              AI Guide
            </Link>
            <Link 
              to="/upload" 
              className={`navbar-top-link ${location.pathname === '/upload' ? 'navbar-top-link--active' : ''}`}
            >
              Upload
            </Link>
          </div>
        </div>

        <div className="navbar-top-right">
          {/* Quick Search Button */}
          <button 
            className="navbar-search-btn text-data-mono" 
            onClick={handleSearchToggle}
            aria-label="Open Search Palette"
          >
            <Search size={14} className="text-muted" />
            <span>Search</span>
            <kbd className="navbar-kbd">⌘K</kbd>
          </button>

          {/* Theme Toggler */}
          <button 
            className="navbar-icon-action" 
            onClick={toggle} 
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Profile Dropdown or Sign In */}
          {user ? (
            <div className="navbar-profile-wrapper" ref={dropdownRef}>
              <button 
                className="navbar-avatar-btn" 
                onClick={() => setDropdownOpen(d => !d)}
                aria-expanded={dropdownOpen}
                aria-label="User actions menu"
              >
                <div className="navbar-avatar-initials">
                  {getInitials(user.name)}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="navbar-profile-dropdown surface-floating animate-slide-down">
                  <div className="navbar-dropdown-profile-info">
                    <p className="navbar-dropdown-name">{user.name}</p>
                    <p className="navbar-dropdown-email">{user.email}</p>
                  </div>
                  <div className="divider" style={{ margin: 'var(--space-2) 0', background: 'var(--border)' }} />
                  <button 
                    onClick={logout} 
                    className="navbar-dropdown-logout-btn"
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{ padding: '4px 12px' }}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* 2. FIXED DESKTOP LEFT SIDEBAR */}
      {!isAuthPage && (
        <aside className="navbar-left-sidebar bg-slate-900 border-r border-slate-800">
          {/* Sidebar Portal Heading */}
          <div className="sidebar-header-box border-b border-slate-800">
            <div className="sidebar-header-title">
              <div className="sidebar-status-light bg-blueprint-cyan"></div>
              <h2 className="text-data-mono text-stark-white">Engineering Portal</h2>
            </div>
            <p className="sidebar-status-tag text-data-mono text-[10px] text-muted">
              SYSTEM_STATUS: OPERATIONAL
            </p>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="sidebar-nav-menu flex-1">
            <p className="sidebar-group-title text-data-mono text-[10px] text-muted">Navigation</p>
            <ul className="sidebar-nav-list">
              {sidebarLinks.map(link => {
                const isActive = link.to === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(link.to);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`sidebar-nav-link ${isActive ? 'sidebar-nav-link--active' : ''}`}
                    >
                      {link.icon}
                      <span className="font-mono text-sm tracking-wide">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Semester Quick Filters */}
            <div className="sidebar-semester-box">
              <p className="sidebar-group-title text-data-mono text-[10px] text-muted">Semester Filter</p>
              <div className="sidebar-semester-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    className="sidebar-sem-btn font-data-mono hover:border-laser-violet"
                    onClick={() => handleSemesterClick(num)}
                  >
                    S{num}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="sidebar-footer border-t border-slate-800">
            <button 
              className="btn btn-secondary btn-sm w-full py-2 font-mono flex items-center justify-center gap-1"
              onClick={() => navigate('/upload')}
            >
              <span>+ New Research</span>
            </button>
            <div className="sidebar-footer-links mt-4">
              <a href="#" className="sidebar-footer-item text-data-mono">
                <Settings size={14} className="text-muted" />
                <span>Settings</span>
              </a>
              <a href="#" className="sidebar-footer-item text-data-mono">
                <HelpCircle size={14} className="text-muted" />
                <span>Support</span>
              </a>
            </div>
          </div>
        </aside>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION BAR */}
      {!isAuthPage && (
        <div className="navbar-bottom-mobile bg-slate-900 border-t border-slate-800">
          <Link 
            to="/" 
            className={`mobile-nav-item ${location.pathname === '/' ? 'mobile-nav-item--active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-mono tracking-wider">Home</span>
          </Link>
          <Link 
            to="/branch/IT" 
            className={`mobile-nav-item ${location.pathname.startsWith('/branch') ? 'mobile-nav-item--active' : ''}`}
          >
            <BookOpen size={20} />
            <span className="text-[10px] font-mono tracking-wider">Syllabus</span>
          </Link>
          <Link 
            to="/study-guide" 
            className={`mobile-nav-item ${location.pathname === '/study-guide' ? 'mobile-nav-item--active' : ''}`}
          >
            <BrainCircuit size={20} />
            <span className="text-[10px] font-mono tracking-wider">AI Guide</span>
          </Link>
          <Link 
            to={user ? '/upload' : '/login'} 
            className={`mobile-nav-item ${location.pathname === '/upload' || location.pathname === '/login' ? 'mobile-nav-item--active' : ''}`}
          >
            <UserCircle size={20} />
            <span className="text-[10px] font-mono tracking-wider">Account</span>
          </Link>
        </div>
      )}

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
