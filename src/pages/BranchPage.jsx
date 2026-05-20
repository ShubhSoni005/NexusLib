import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { branches, semesters } from '../data/database';
import Breadcrumb from '../components/Breadcrumb';
import './BranchPage.css';

export default function BranchPage() {
  const { branch } = useParams();
  const branchData = branches.find(b => b.id === branch);
  const semList = semesters[branch] || [];

  if (!branchData) return <div className="page-content container"><p className="text-muted">Branch not found.</p></div>;

  const foundation = semList.filter(s => s.phase === 'Foundation');
  const specialization = semList.filter(s => s.phase === 'Specialization');

  return (
    <div className="page-content">
      <div className="container">
        <Breadcrumb items={[{ label: branchData.name }]} />

        <div className="branch-header animate-fade-up" style={{ '--branch-color': branchData.color }}>
          <span className="badge badge-accent">{branchData.tag}</span>
          <h1>{branchData.name}</h1>
          <p>{branchData.desc}</p>
        </div>

        <PhaseSection title="Foundation Phase" tag="COMMON" sems={foundation} branch={branch} delay={0} />
        <PhaseSection title="Specialization Phase" tag="BRANCH SPECIFIC" sems={specialization} branch={branch} delay={2} />
      </div>
    </div>
  );
}

function PhaseSection({ title, tag, sems, branch, delay }) {
  return (
    <div className="phase-section animate-fade-up">
      <div className="phase-header">
        <h2>{title}</h2>
        <span className="badge badge-default">{tag}</span>
      </div>
      <div className="sem-grid">
        {sems.map((s, i) => (
          <Link
            key={s.num}
            to={`/branch/${branch}/semester/${s.num}`}
            className={`sem-card card animate-fade-up delay-${Math.min((delay + i + 1) * 100, 500)}`}
          >
            <span className="sem-card__num">0{s.num}</span>
            <h3 className="sem-card__title">Semester {s.num}</h3>
            <p className="sem-card__desc">{s.desc}</p>
            <div className="sem-card__footer">
              <span className="sem-card__count">{s.subjects.length} Courses</span>
              <div className="sem-card__arrow"><ArrowRight size={16} /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
