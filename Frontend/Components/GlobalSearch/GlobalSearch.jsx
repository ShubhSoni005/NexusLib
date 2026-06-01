import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft, Sparkles, Terminal, FileText, Trash2 } from 'lucide-react';
import { semesters } from '@db';
import { useTheme } from '../../Context/ThemeContext';
import './GlobalSearch.css';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // all | subjects | pages | actions
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // 1. Build Index of items
  // Subjects
  const subjectIndex = [];
  Object.entries(semesters).forEach(([branchId, semList]) => {
    semList.forEach(sem => {
      sem.subjects.forEach(subj => {
        const exists = subjectIndex.some(
          item => item.name === subj && item.branch === branchId && item.sem === sem.num
        );
        if (!exists) {
          subjectIndex.push({
            type: 'subject',
            name: subj,
            branch: branchId,
            sem: sem.num,
            label: `${subj} (${branchId.toUpperCase()} Sem ${sem.num})`
          });
        }
      });
    });
  });

  // Pages
  const pageIndex = [
    { type: 'page', name: 'Home', path: '/', label: 'Go to Home Page' },
    { type: 'page', name: 'AI Study Guide', path: '/study-guide', label: 'Go to AI Study Guide Chat' },
    { type: 'page', name: 'Upload Materials', path: '/upload', label: 'Upload GTU Papers & Notes' },
    { type: 'page', name: 'Sign In / Log In', path: '/login', label: 'Sign into your account' },
    { type: 'page', name: 'Create Account', path: '/signup', label: 'Join NexusLib free' },
  ];

  // Actions
  const actionIndex = [
    { type: 'action', name: 'Toggle Theme', actionId: 'toggle-theme', label: 'Change visual theme (Dark / Dim / AMOLED / Light)' },
    { type: 'action', name: 'Clear Recents', actionId: 'clear-recents', label: 'Reset your recent searches' },
    { type: 'action', name: 'Go to Home', actionId: 'nav-home', label: 'Return to home portal' },
    { type: 'action', name: 'Start AI Session', actionId: 'nav-ai', label: 'Open a study guide chatbot chat' }
  ];

  const searchIndex = [...subjectIndex, ...pageIndex, ...actionIndex];

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nl_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, [isOpen]);

  // Focus input and lock scroll on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      setActiveIndex(0);
      setQuery('');
      setResults([]);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fuzzy scoring algorithm
  const getScore = (name, q) => {
    const target = name.toLowerCase();
    const search = q.trim().toLowerCase();
    if (!search) return 0;
    
    if (target === search) return 100;
    if (target.startsWith(search)) return 80;
    if (target.includes(search)) return 60;
    
    // Character sequence matching
    let matches = 0;
    let sIdx = 0;
    for (let i = 0; i < target.length; i++) {
      if (target[i] === search[sIdx]) {
        matches++;
        sIdx++;
        if (sIdx === search.length) break;
      }
    }
    return sIdx === search.length ? 20 + matches : 0;
  };

  // Perform search
  useEffect(() => {
    if (!isOpen) return;

    if (!query.trim()) {
      // If empty query, show recent searches filtered by category tab
      let filteredRecents = recentSearches;
      if (selectedTab !== 'all') {
        filteredRecents = recentSearches.filter(item => {
          if (selectedTab === 'subjects') return item.type === 'subject';
          if (selectedTab === 'pages') return item.type === 'page';
          if (selectedTab === 'actions') return item.type === 'action';
          return false;
        });
      }
      setResults(filteredRecents);
      setActiveIndex(0);
      return;
    }

    // Filter index
    let filtered = searchIndex
      .map(item => ({ ...item, score: getScore(item.name + ' ' + (item.branch || ''), query) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Apply category tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(item => {
        if (selectedTab === 'subjects') return item.type === 'subject';
        if (selectedTab === 'pages') return item.type === 'page';
        if (selectedTab === 'actions') return item.type === 'action';
        return false;
      });
    }

    setResults(filtered.slice(0, 10)); // Limit to top 10 matches
    setActiveIndex(0);
  }, [query, selectedTab, recentSearches, isOpen]);

  // Keyboard navigation controller
  useEffect(() => {
    const handleKeys = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, results, activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('.command-item--active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const saveRecent = (item) => {
    // Exclude action elements that clear recents
    if (item.actionId === 'clear-recents') return;

    let updated = [item, ...recentSearches.filter(r => r.name !== item.name || r.type !== item.type)];
    updated = updated.slice(0, 5); // limit to 5 recents
    setRecentSearches(updated);
    localStorage.setItem('nl_recent_searches', JSON.stringify(updated));
  };

  const handleSelect = (item) => {
    saveRecent(item);
    onClose();

    if (item.type === 'subject') {
      navigate(`/branch/${item.branch}/semester/${item.sem}/subject/${encodeURIComponent(item.name)}`);
    } else if (item.type === 'page') {
      navigate(item.path);
    } else if (item.type === 'action') {
      executeAction(item.actionId);
    }
  };

  const executeAction = (actionId) => {
    if (actionId === 'toggle-theme') {
      toggle();
    } else if (actionId === 'clear-recents') {
      setRecentSearches([]);
      localStorage.removeItem('nl_recent_searches');
    } else if (actionId === 'nav-home') {
      navigate('/');
    } else if (actionId === 'nav-ai') {
      navigate('/study-guide');
    }
  };

  const removeRecentItem = (e, item) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => !(r.name === item.name && r.type === item.type));
    setRecentSearches(updated);
    localStorage.setItem('nl_recent_searches', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="command-overlay" 
      ref={overlayRef} 
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Palette"
    >
      <div className="command-modal surface-glass animate-slide-down">
        {/* Header Search Field */}
        <header className="command-header">
          <Search className="command-search-icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder="Type search terms or command action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="command-close" onClick={onClose} aria-label="Close Command Palette">
            <X size={18} />
          </button>
        </header>

        {/* Category Tabs */}
        <div className="command-tabs">
          {['all', 'subjects', 'pages', 'actions'].map(tab => (
            <button
              key={tab}
              className={`command-tab ${selectedTab === tab ? 'command-tab--active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Results / Content Body */}
        <div className="command-body" ref={resultsContainerRef}>
          {results.length === 0 ? (
            <div className="command-empty">
              {query.trim() === '' ? (
                <>
                  <BookOpen size={28} className="text-muted mb-2" />
                  <p className="font-semibold text-sm">No recent searches found</p>
                  <p className="text-xs text-muted mt-1">Start typing above to search GTU subjects & study guides</p>
                </>
              ) : (
                <>
                  <Terminal size={28} className="text-muted mb-2" />
                  <p className="font-semibold text-sm">No results match your query</p>
                  <p className="text-xs text-muted mt-1">Try refining the terms or checking another category tab</p>
                </>
              )}
            </div>
          ) : (
            <div className="command-results-list" role="listbox">
              <div className="command-group-title">
                {query.trim() === '' ? 'Recent Searches' : 'Matches'}
              </div>
              
              {results.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    className={`command-item ${isActive ? 'command-item--active' : ''}`}
                    onClick={() => handleSelect(item)}
                    role="option"
                    aria-selected={isActive}
                  >
                    <div className="command-item-icon-wrapper">
                      {item.type === 'subject' && <BookOpen size={16} />}
                      {item.type === 'page' && <FileText size={16} />}
                      {item.type === 'action' && <Terminal size={16} />}
                    </div>

                    <div className="command-item-content">
                      <span className="command-item-title">{item.name}</span>
                      <span className="command-item-desc">{item.label}</span>
                    </div>

                    <div className="command-item-actions">
                      {query.trim() === '' && (
                        <button 
                          className="command-remove-recent" 
                          onClick={(e) => removeRecentItem(e, item)}
                          aria-label="Remove from history"
                          title="Remove from history"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      {isActive && (
                        <span className="command-enter-badge">
                          <span>Select</span>
                          <CornerDownLeft size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <footer className="command-footer">
          <div className="command-shortcuts">
            <span className="command-shortcut-item">
              <kbd>↑↓</kbd> Navigate
            </span>
            <span className="command-shortcut-item">
              <kbd>Enter</kbd> Select
            </span>
            <span className="command-shortcut-item">
              <kbd>Esc</kbd> Close
            </span>
          </div>
          <div className="command-credit">
            <Sparkles size={12} />
            <span>Nexus Command v2</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
