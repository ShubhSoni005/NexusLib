import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { branches, semesters } from '@db';
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb';
import './BranchPage.css';

export default function BranchPage() {
  const { branch } = useParams();
  const branchData = branches.find(b => b.id === branch);
  const semList = semesters[branch] || [];

  if (!branchData) {
    return (
      <div className="page-content container">
        <p className="text-muted">Branch not found.</p>
      </div>
    );
  }

  const foundation = semList.filter(s => s.phase === 'Foundation');
  const specialization = semList.filter(s => s.phase === 'Specialization');

  // Generate color values based on branch data
  const branchColor = branchData.color || 'var(--accent)';
  const glowBg = `${branchColor}18`; // 10% opacity
  const subtleBorder = `${branchColor}35`; // 20% opacity

  return (
    <div className="page-content">
      <div className="container">
        <Breadcrumb items={[{ label: branchData.name }]} />

        {/* Dynamic Branch Hero Banner */}
        <header 
          className="branch-header surface-glass animate-fade-up"
          style={{ 
            '--branch-color': branchColor,
            '--branch-glow': glowBg,
            '--branch-border': subtleBorder
          }}
        >
          <div className="branch-header__banner-overlay" />
          <div className="branch-header__content">
            <span className="badge badge-accent branch-header__tag">{branchData.tag}</span>
            <h1 className="branch-header__title">{branchData.name}</h1>
            <p className="branch-header__desc">{branchData.desc}</p>
          </div>
        </header>

        {/* Foundation Phase */}
        <PhaseSection 
          title="Foundation Phase" 
          tag="Core Principles" 
          sems={foundation} 
          branch={branch} 
          delay={0.1} 
        />
        
        {/* Specialization Phase */}
        <PhaseSection 
          title="Specialization Phase" 
          tag="Branch Specifics" 
          sems={specialization} 
          branch={branch} 
          delay={0.4} 
        />
      </div>
    </div>
  );
}

function PhaseSection({ title, tag, sems, branch, delay }) {
  return (
    <section className="phase-section scroll-reveal">
      <header className="phase-header">
        <h2>{title}</h2>
        <span className="badge badge-default">{tag}</span>
      </header>
      
      <div className="sem-grid">
        {sems.map((s, i) => (
          <Link
            key={s.num}
            to={`/branch/${branch}/semester/${s.num}`}
            className="sem-card surface-glass"
            style={{ 
              animationDelay: `${delay + i * 0.1}s` 
            }}
          >
            <div className="sem-card__top">
              <span className="sem-card__num">0{s.num}</span>
              <span className="sem-card__count">{s.subjects.length} Courses</span>
            </div>
            
            <div className="sem-card__body">
              <h3 className="sem-card__title">Semester {s.num}</h3>
              <p className="sem-card__desc">{s.desc}</p>
            </div>
            
            <div className="sem-card__footer">
              <span className="sem-card__learn-more">Explore Syllabus</span>
              <div className="sem-card__arrow">
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
