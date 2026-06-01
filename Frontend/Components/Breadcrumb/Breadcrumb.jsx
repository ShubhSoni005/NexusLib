import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse = items.length > 2 && !expanded;

  const renderItems = () => {
    if (!shouldCollapse) {
      return items.map((item, i) => (
        <span 
          key={i} 
          className="breadcrumb__segment" 
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <ChevronRight size={13} className="breadcrumb__sep" />
          {item.to ? (
            <Link to={item.to} className="breadcrumb__item">{item.label}</Link>
          ) : (
            <span className="breadcrumb__item breadcrumb__item--current" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ));
    }

    const parentIdx = items.length - 2;
    const currentIdx = items.length - 1;
    
    return (
      <>
        <span className="breadcrumb__segment">
          <ChevronRight size={13} className="breadcrumb__sep" />
          <button 
            className="breadcrumb__ellipse" 
            onClick={() => setExpanded(true)}
            aria-label="Expand breadcrumbs path"
            title="Expand path"
          >
            <MoreHorizontal size={13} />
          </button>
        </span>
        
        <span className="breadcrumb__segment">
          <ChevronRight size={13} className="breadcrumb__sep" />
          <Link to={items[parentIdx].to} className="breadcrumb__item">{items[parentIdx].label}</Link>
        </span>

        <span className="breadcrumb__segment">
          <ChevronRight size={13} className="breadcrumb__sep" />
          <span className="breadcrumb__item breadcrumb__item--current" aria-current="page">
            {items[currentIdx].label}
          </span>
        </span>
      </>
    );
  };

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb Route Navigation">
      <div className="breadcrumb__container">
        <Link to="/" className="breadcrumb__item breadcrumb__home">
          <Home size={13} />
          <span className="breadcrumb__home-text">Home</span>
        </Link>
        {renderItems()}
      </div>
    </nav>
  );
}
