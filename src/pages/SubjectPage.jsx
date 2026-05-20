import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ExternalLink, X, FileText, Video, Book, BookOpen, FlaskConical, Award } from 'lucide-react';
import { branches, semesters, getSubjectData } from '../data/database';
import Breadcrumb from '../components/Breadcrumb';
import './SubjectPage.css';

const ICONS = {
  syllabus: <FileText size={22} />,
  pyq: <Award size={22} />,
  notes: <BookOpen size={22} />,
  youtube: <Video size={22} />,
  solutions: <FlaskConical size={22} />,
  books: <Book size={22} />,
};

const CAT_COLORS = {
  syllabus: '#6366f1', pyq: '#f59e0b',
  notes: '#22c55e', youtube: '#ef4444',
  solutions: '#06b6d4', books: '#8b5cf6',
};

export default function SubjectPage() {
  const { branch, sem, subject } = useParams();
  const decodedSubject = decodeURIComponent(subject);
  const [modal, setModal] = useState(null);

  const branchData = branches.find(b => b.id === branch);
  const semData = semesters[branch]?.find(s => s.num === parseInt(sem));
  const data = getSubjectData(branch, parseInt(sem), decodedSubject);

  if (!branchData || !semData) return <div className="page-content container"><p className="text-muted">Not found.</p></div>;

  const cats = Object.entries(data.resources);

  return (
    <div className="page-content">
      <div className="container">
        <Breadcrumb items={[
          { label: branchData.name, to: `/branch/${branch}` },
          { label: `Semester ${sem}`, to: `/branch/${branch}/semester/${sem}` },
          { label: decodedSubject },
        ]} />

        <div className="subject-header animate-fade-up">
          <div className="subject-header__main">
            <h1>{decodedSubject}</h1>
            <p>Master the core building blocks. Explore comprehensive resources curated for academic excellence and technical growth.</p>
          </div>
          <div className="subject-header__stat">
            <BookOpen size={28} />
            <div>
              <div className="stat-label">STUDY MATERIAL</div>
              <div className="stat-value">{cats.length} Categories Available</div>
            </div>
          </div>
        </div>

        <div className="resource-grid">
          {cats.map(([key, cat], i) => (
            <button
              key={key}
              className={`resource-card card animate-fade-up delay-${Math.min((i + 1) * 100, 500)}`}
              onClick={() => setModal({ key, ...cat })}
              style={{ '--cat-color': CAT_COLORS[key] }}
            >
              <div className="resource-card__icon">{ICONS[key]}</div>
              <h3 className="resource-card__title">{cat.label}</h3>
              <p className="resource-card__desc">{cat.desc}</p>
              <div className="resource-card__tags">
                {cat.tags.map(t => <span key={t} className="badge badge-default">{t}</span>)}
              </div>
              <span className="resource-card__cta">View Materials →</span>
            </button>
          ))}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setModal(null)}>
          <div className="modal animate-slide-down" onClick={e => e.stopPropagation()}>
            <div className="modal__header" style={{ '--cat-color': CAT_COLORS[modal.key] }}>
              <div className="modal__icon">{ICONS[modal.key]}</div>
              <div>
                <h2 className="modal__title">{modal.label}</h2>
                <p className="modal__sub">{modal.desc}</p>
              </div>
              <button className="modal__close" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className="modal__body">
              {modal.items.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-item"
                >
                  <span className="resource-item__title">{item.title}</span>
                  <ExternalLink size={14} className="resource-item__icon" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
