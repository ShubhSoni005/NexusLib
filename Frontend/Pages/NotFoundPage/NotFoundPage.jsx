import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Bot, Search, Upload } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page page-content">
      {/* Background Floating Blobs */}
      <div className="floating-blob blob-1" />
      <div className="floating-blob blob-2" />

      <div className="not-found-card surface-glass animate-fade-up">
        {/* Animated Glitch 404 Text */}
        <div className="glitch-container">
          <h1 className="glitch-text" data-text="404">404</h1>
        </div>
        
        <h2 className="not-found-subtitle">Lost in Space</h2>
        <p className="not-found-text">
          The GTU engineering resource you are trying to access doesn't exist, has been moved, or is temporarily offline.
        </p>

        {/* Helpful links card block */}
        <div className="not-found-links surface-elevated">
          <span className="not-found-links-title">Useful Pages</span>
          <div className="links-grid">
            <Link to="/" className="not-found-link-item">
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <Link to="/study-guide" className="not-found-link-item">
              <Bot size={14} />
              <span>AI Study Coach</span>
            </Link>
            <Link to="/upload" className="not-found-link-item">
              <Upload size={14} />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
