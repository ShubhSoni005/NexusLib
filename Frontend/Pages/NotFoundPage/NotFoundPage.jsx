import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page page-content">
      <div className="not-found-card card animate-fade-up">
        <div className="not-found-icon">
          <HelpCircle size={48} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary back-home-btn">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
