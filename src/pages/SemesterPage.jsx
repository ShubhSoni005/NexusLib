import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { branches, semesters } from '../data/database';
import Breadcrumb from '../components/Breadcrumb';
import './SemesterPage.css';

export default function SemesterPage() {
  const { branch, sem } = useParams();
  const [query, setQuery] = useState('');
  const branchData = branches.find(b => b.id === branch);
  const semData = semesters[branch]?.find(s => s.num === parseInt(sem));

  if (!branchData || !semData) return <div className="page-content container"><p className="text-muted">Not found.</p></div>;

  const filtered = semData.subjects.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  const encodedBranch = encodeURIComponent(branch);

  return (
    <div className="page-content">
      <div className="container">
        <Breadcrumb items={[
          { label: branchData.name, to: `/branch/${branch}` },
          { label: `Semester ${sem}` },
        ]} />

        <div className="sem-page-header animate-fade-up">
          <div>
            <span className="badge badge-accent">Semester {sem}</span>
            <h1>{branchData.name}</h1>
            <p>{semData.desc}</p>
          </div>
          <div className="sem-page-meta">
            <div className="meta-chip">
              <BookOpen size={16} />
              <span>{semData.subjects.length} Subjects</span>
            </div>
          </div>
        </div>

        <div className="sem-search animate-fade-up delay-100">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              className="input search-input"
              placeholder="Search subjects…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted mt-8">No subjects match your search.</p>
        ) : (
          <div className="subject-grid">
            {filtered.map((subject, i) => (
              <Link
                key={subject}
                to={`/branch/${encodedBranch}/semester/${sem}/subject/${encodeURIComponent(subject)}`}
                className={`subject-card card animate-fade-up delay-${Math.min((i + 1) * 100, 500)}`}
              >
                <div className="subject-card__index">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="subject-card__name">{subject}</h3>
                <div className="subject-card__cats">
                  {['Syllabus','PYQ','Notes','YouTube','Solutions','Books'].map(c => (
                    <span key={c} className="subject-card__cat">{c}</span>
                  ))}
                </div>
                <span className="subject-card__cta">View Resources →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
