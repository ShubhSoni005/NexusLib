import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb__item breadcrumb__home">
        <Home size={13} /> Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="breadcrumb__segment">
          <ChevronRight size={13} className="breadcrumb__sep" />
          {item.to ? (
            <Link to={item.to} className="breadcrumb__item">{item.label}</Link>
          ) : (
            <span className="breadcrumb__item breadcrumb__item--current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
