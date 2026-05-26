import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-glass">
        <div className="spinner"></div>
        <span className="loader-text">Loading NexusLib...</span>
      </div>
    </div>
  );
}
