import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, FileText, Video, Book, BookOpen, FlaskConical, Award, DownloadCloud, Sparkles } from 'lucide-react';
import { branches, semesters, getSubjectData } from '@db';
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb';
import './SubjectPage.css';

const ICONS = {
  syllabus:  <FileText size={22} />,
  pyq:       <Award size={22} />,
  notes:     <BookOpen size={22} />,
  youtube:   <Video size={22} />,
  solutions: <FlaskConical size={22} />,
  books:     <Book size={22} />,
};

const CAT_COLORS = {
  syllabus: '#6366f1', pyq: '#f59e0b',
  notes: '#10b981',   youtube: '#ef4444',
  solutions: '#06b6d4', books: '#8b5cf6',
};

export default function SubjectPage() {
  const { branch, sem, subject } = useParams();
  const decodedSubject = decodeURIComponent(subject);
  const [modal, setModal] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const dialogRef = useRef(null);

  const branchData = branches.find(b => b.id === branch);
  const semData = semesters[branch]?.find(s => s.num === parseInt(sem));
  const data = getSubjectData(branch, parseInt(sem), decodedSubject);

  // Monitor viewport scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!branchData || !semData) {
    return (
      <div className="page-content container">
        <p className="text-muted">Subject details not found.</p>
      </div>
    );
  }

  const cats = Object.entries(data.resources);

  const handleOpenModal = (catKey, catVal) => {
    setModal({ key: catKey, ...catVal });
    setTimeout(() => {
      dialogRef.current?.showModal();
    }, 10);
  };

  const handleCloseModal = () => {
    dialogRef.current?.close();
    setModal(null);
  };

  return (
    <div className="page-content">
      {/* Scroll progress bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="container">
        <Breadcrumb items={[
          { label: branchData.name, to: `/branch/${branch}` },
          { label: `Semester ${sem}`, to: `/branch/${branch}/semester/${sem}` },
          { label: decodedSubject },
        ]} />

        {/* Dynamic header banner */}
        <header className="subject-header surface-glass animate-fade-up">
          <div className="subject-header__main">
            <h1 className="subject-header__title">{decodedSubject}</h1>
            <p className="subject-header__desc">
              Access curated reference textbooks, PYQs, detailed notes, and syllabus layouts. Use our AI chatbot for immediate study guide questions.
            </p>
          </div>
          
          <div className="subject-header__stat surface-elevated">
            <BookOpen size={24} className="text-accent" />
            <div className="subject-header__stat-text">
              <span className="stat-label">Materials Available</span>
              <span className="stat-value">{cats.length} Reference Areas</span>
            </div>
          </div>
        </header>

        {/* Category Cards */}
        <div className="resource-grid">
          {cats.map(([key, cat], i) => (
            <button
              key={key}
              className="resource-card surface-glass animate-fade-up"
              onClick={() => handleOpenModal(key, cat)}
              style={{ 
                '--cat-color': CAT_COLORS[key],
                animationDelay: `${(i * 0.05) + 0.1}s`
              }}
            >
              <div className="resource-card__pulse-glow" />
              <div className="resource-card__header">
                <div className="resource-card__icon">{ICONS[key]}</div>
                <span className="resource-card__index">0{i + 1}</span>
              </div>
              
              <h3 className="resource-card__title">{cat.label}</h3>
              <p className="resource-card__desc">{cat.desc}</p>
              
              <div className="resource-card__footer">
                <div className="resource-card__tags">
                  {cat.tags.map(t => (
                    <span key={t} className="badge badge-default">{t}</span>
                  ))}
                </div>
                <span className="resource-card__cta">Access &rarr;</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* HTML5 Native Modal Dialog */}
      <dialog 
        ref={dialogRef} 
        className="subject-dialog surface-floating animate-fade-in"
        onClose={handleCloseModal}
        onClick={(e) => e.target === dialogRef.current && handleCloseModal()}
      >
        {modal && (
          <div className="modal-inner">
            <header className="modal__header" style={{ '--cat-color': CAT_COLORS[modal.key] }}>
              <div className="modal__header-main">
                <div className="modal__icon">{ICONS[modal.key]}</div>
                <div>
                  <h2 className="modal__title">{modal.label}</h2>
                  <p className="modal__sub">{modal.desc}</p>
                </div>
              </div>
              <button 
                className="modal__close" 
                onClick={handleCloseModal}
                aria-label="Close dialog window"
              >
                <X size={18} />
              </button>
            </header>
            
            <div className="modal__body">
              {modal.items.map((item, i) => {
                // Generate a consistent mock file size based on title length
                const mockSize = `${((item.title.length * 7) % 15 + 1.2).toFixed(1)} MB`;
                return (
                  <a 
                    key={i} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="resource-item surface-elevated"
                  >
                    <div className="resource-item__main">
                      <div className="resource-item__details">
                        <span className="resource-item__title">{item.title}</span>
                        <div className="resource-item__meta">
                          <span className="resource-item__size">{mockSize}</span>
                          <span className="resource-item__sep">&bull;</span>
                          <span className="resource-item__status">Offline Ready</span>
                        </div>
                      </div>
                      
                      {item.isUserUploaded && (
                        <span className="user-uploaded-badge">
                          Contributed by {item.uploadedBy}
                        </span>
                      )}
                    </div>
                    
                    <div className="resource-item__actions">
                      <DownloadCloud size={14} className="resource-item__download-icon" />
                      <ExternalLink size={14} className="resource-item__link-icon" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
