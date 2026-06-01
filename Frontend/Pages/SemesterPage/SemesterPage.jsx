import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, BookOpen, FileText, HelpCircle, GraduationCap } from 'lucide-react';
import { branches, semesters } from '@db';
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb';
import './SemesterPage.css';

export default function SemesterPage() {
  const { branch, sem } = useParams();
  const [query, setQuery] = useState('');
  const branchData = branches.find(b => b.id === branch);
  const semData = semesters[branch]?.find(s => s.num === parseInt(sem));

  if (!branchData || !semData) {
    return (
      <div className="page-content container">
        <p className="text-muted">Semester info not found.</p>
      </div>
    );
  }

  const filtered = semData.subjects.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  );
  
  const encodedBranch = encodeURIComponent(branch);

  const categories = [
    { name: 'Syllabus', icon: <FileText size={10} /> },
    { name: 'PYQ', icon: <HelpCircle size={10} /> },
    { name: 'Notes', icon: <BookOpen size={10} /> },
    { name: 'YouTube', icon: <GraduationCap size={10} /> }
  ];

  return (
    <div className="page-content">
      <div className="container">
        <Breadcrumb items={[
          { label: branchData.name, to: `/branch/${branch}` },
          { label: `Semester ${sem}` },
        ]} />

        {/* Header Summary Card */}
        <header className="sem-page-header surface-glass animate-fade-up">
          <div className="sem-page-header__left">
            <span className="badge badge-accent">Semester {sem}</span>
            <h1 className="sem-page-header__title">{branchData.name} Overview</h1>
            <p className="sem-page-header__desc">{semData.desc}</p>
          </div>
          
          <div className="sem-page-header__right">
            <div className="meta-chip surface-elevated">
              <BookOpen size={16} />
              <span>{semData.subjects.length} Subjects Offered</span>
            </div>
          </div>
        </header>

        {/* Filter Input */}
        <div className="sem-search animate-fade-up delay-100">
          <div className="search-wrap surface-glass">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search subjects (e.g. Operating Systems...)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Filter courses list"
            />
            {query.trim() && (
              <span className="search-count-badge surface-elevated animate-fade-in">
                {filtered.length} {filtered.length === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>
        </div>

        {/* Course Cards Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="sem-empty-state surface-glass animate-fade-in">
            <BookOpen size={48} className="sem-empty-state__icon mb-4" />
            <h3>No Subjects Found</h3>
            <p className="text-secondary mt-2">
              We couldn't find any courses matching "{query}" in this semester.
            </p>
            <button 
              onClick={() => setQuery('')} 
              className="btn btn-secondary mt-6"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="subject-grid">
            {filtered.map((subject, i) => (
              <Link
                key={subject}
                to={`/branch/${encodedBranch}/semester/${sem}/subject/${encodeURIComponent(subject)}`}
                className="subject-card surface-glass animate-fade-up"
                style={{ 
                  animationDelay: `${(i * 0.05) + 0.1}s` 
                }}
              >
                <div className="subject-card__header">
                  <span className="subject-card__index">0{i + 1}</span>
                  <span className="subject-card__tag">Active</span>
                </div>
                
                <h3 className="subject-card__name">{subject}</h3>
                
                <div className="subject-card__cats">
                  {categories.map(c => (
                    <span key={c.name} className="subject-card__cat surface-elevated">
                      {c.icon}
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>
                
                <div className="subject-card__footer">
                  <span className="subject-card__cta">Access Materials</span>
                  <span className="subject-card__arrow-link">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
