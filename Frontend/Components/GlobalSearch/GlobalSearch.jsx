import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { semesters } from '@db';
import './GlobalSearch.css';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Flatten database subjects for global index search
  const searchIndex = [];
  Object.entries(semesters).forEach(([branchId, semList]) => {
    semList.forEach(sem => {
      sem.subjects.forEach(subj => {
        // Prevent duplicate entries of the exact same subject in the same branch/semester
        const exists = searchIndex.some(
          item => item.name === subj && item.branch === branchId && item.sem === sem.num
        );
        if (!exists) {
          searchIndex.push({
            name: subj,
            branch: branchId,
            sem: sem.num
          });
        }
      });
    });
  });

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Perform search filter
  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const term = val.toLowerCase();
    const filtered = searchIndex.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.branch.toLowerCase().includes(term) ||
      `semester ${item.sem}`.toLowerCase().includes(term)
    );
    setResults(filtered.slice(0, 8)); // limit to top 8 results
  };

  const handleSelect = (item) => {
    onClose();
    navigate(`/branch/${item.branch}/semester/${item.sem}/subject/${encodeURIComponent(item.name)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && onClose()}>
      <div className="search-modal animate-slide-down">
        <header className="search-modal__header">
          <Search className="search-modal__icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-modal__input"
            placeholder="Search subjects (e.g. Operating System, Artificial Intelligence...)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="search-modal__close" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </header>

        <div className="search-modal__body">
          {query.trim() === '' ? (
            <div className="search-modal__placeholder">
              <BookOpen size={24} className="mb-2" />
              <p>Type a subject name to search...</p>
              <span className="text-xs text-muted mt-1">Press ESC to exit</span>
            </div>
          ) : results.length === 0 ? (
            <div className="search-modal__no-results">
              <p>No subjects found for "{query}"</p>
            </div>
          ) : (
            <ul className="search-modal__results">
              {results.map((item, idx) => (
                <li
                  key={idx}
                  className="search-modal__result-item"
                  onClick={() => handleSelect(item)}
                >
                  <div className="search-modal__result-info">
                    <span className="search-modal__result-name">{item.name}</span>
                    <span className="search-modal__result-meta">
                      {item.branch} &bull; Semester {item.sem}
                    </span>
                  </div>
                  <ArrowRight size={14} className="search-modal__result-arrow" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
