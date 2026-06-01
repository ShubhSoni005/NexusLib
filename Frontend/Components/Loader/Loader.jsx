import { BookOpen } from 'lucide-react';
import './Loader.css';

// Default Branded Splash Loader
export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-brand-box">
        <div className="loader-logo-ring">
          <div className="loader-logo-wrapper shadow-premium-3">
            <BookOpen size={32} className="loader-logo-icon" />
          </div>
        </div>
        <span className="loader-text">Loading NexusLib</span>
        <div className="loader-progress-track">
          <div className="loader-progress-bar" />
        </div>
      </div>
    </div>
  );
}

// Reusable Skeleton Component for inline skeleton loading
export function Skeleton({ type = 'text', count = 1 }) {
  const items = Array.from({ length: count });
  
  return (
    <div className={`skeleton-container skeleton-container--${type}`}>
      {items.map((_, i) => (
        <div 
          key={i} 
          className={`skeleton-base skeleton-${type}-item shimmer-effect`} 
        />
      ))}
    </div>
  );
}
