import { Link } from 'react-router-dom';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { branches, semesters } from '../data/database';
import './Home.css';

export default function Home() {
  return (
    <div className="page-content">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__badge animate-fade-up">
            <GraduationCap size={14} />
            GTU Engineering Resources
          </div>
          <h1 className="hero__title animate-fade-up delay-100">
            Your Academic<br />
            <span className="hero__accent">Edge Starts Here</span>
          </h1>
          <p className="hero__sub animate-fade-up delay-200">
            Curated study materials, PYQs, notes and AI-guided study plans
            for IT, CE and CSE branches at GTU.
          </p>
          <div className="hero__actions animate-fade-up delay-300">
            <Link to="/branch/IT/semester/6/subject/Artificial%20Intelligence" className="btn btn-primary">
              Explore AI Subject
            </Link>
            <Link to="/study-guide" className="btn btn-secondary">
              Try AI Study Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Branch Grid */}
      <section className="section">
        <div className="container">
          <div className="section__header animate-fade-up">
            <h2>Find Your Branch</h2>
            <p className="text-secondary">Tailored content for the most popular engineering disciplines at GTU.</p>
          </div>
          <div className="branch-grid">
            {branches.map((b, i) => (
              <Link
                key={b.id}
                to={`/branch/${b.id}`}
                className={`branch-card card animate-fade-up delay-${(i + 1) * 100}`}
                style={{ '--branch-color': b.color }}
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

      {/* Quick Stats */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { val: '3', label: 'Engineering Branches' },
              { val: '24', label: 'Semesters Covered' },
              { val: '100+', label: 'Subjects Available' },
              { val: '6', label: 'Resource Categories' },
            ].map((s, i) => (
              <div key={i} className={`stat-card animate-fade-up delay-${(i + 1) * 100}`}>
                <div className="stat-card__val">{s.val}</div>
                <div className="stat-card__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
