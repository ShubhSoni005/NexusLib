import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FileText, Video, Book, BookOpen, FlaskConical, Award, 
  DownloadCloud, Search, ExternalLink, Filter, HelpCircle 
} from 'lucide-react';
import { branches, semesters, getSubjectData } from '@db';
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb';
import './SubjectPage.css';

const CAT_ICONS = {
  all:       <Layers size={14} />,
  syllabus:  <FileText size={14} />,
  pyq:       <Award size={14} />,
  notes:     <BookOpen size={14} />,
  youtube:   <Video size={14} />,
  solutions: <FlaskConical size={14} />,
  books:     <Book size={14} />,
};

// Help map tags for category styling
const CAT_TAGS = {
  syllabus: { label: 'SYLLABUS_DETAILED', class: 'tag-syllabus' },
  pyq: { label: 'PYQ_ANNUAL', class: 'tag-pyq' },
  notes: { label: 'LECTURE_NOTES', class: 'tag-notes' },
  youtube: { label: 'VIDEO_PLAYLIST', class: 'tag-youtube' },
  solutions: { label: 'SOLVED_PAPER', class: 'tag-solutions' },
  books: { label: 'TEXTBOOK', class: 'tag-books' },
};

export default function SubjectPage() {
  const { branch, sem, subject } = useParams();
  const decodedSubject = decodeURIComponent(subject);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [scrollProgress, setScrollProgress] = useState(0);

  const branchData = branches.find(b => b.id === branch);
  const semData = semesters[branch]?.find(s => s.num === parseInt(sem));
  const data = getSubjectData(branch, parseInt(sem), decodedSubject);

  // Monitor viewport scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!branchData || !semData) {
    return (
      <div className="page-content container">
        <p className="text-muted">Subject details not found.</p>
      </div>
    );
  }

  // Aggregate all items from all categories
  const allItems = [];
  Object.entries(data.resources).forEach(([catKey, catVal]) => {
    catVal.items.forEach(item => {
      allItems.push({
        ...item,
        categoryKey: catKey,
        categoryLabel: catVal.label,
      });
    });
  });

  // Filter items by category and query
  const filteredItems = allItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.categoryKey === activeCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categoriesList = [
    { key: 'all', label: 'All Assets' },
    { key: 'books', label: 'Textbooks' },
    { key: 'pyq', label: 'PYQs' },
    { key: 'syllabus', label: 'Syllabus' },
    { key: 'notes', label: 'Notes' },
    { key: 'solutions', label: 'Solutions' },
    { key: 'youtube', label: 'YouTube Lectures' }
  ];

  return (
    <div className="page-content">
      {/* Scroll progress bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="container">
        <Breadcrumb items={[
          { label: branchData.name, to: `/branch/${branch}` },
          { label: `Semester ${sem}`, to: `/branch/${branch}/semester/${sem}` },
          { label: decodedSubject },
        ]} />

        {/* Dynamic header banner */}
        <header className="subject-header surface-glass animate-fade-up">
          <div className="subject-header__main">
            <span className="badge badge-accent">Semester {sem} Portal</span>
            <h1 className="subject-header__title">{decodedSubject}</h1>
            <p className="subject-header__desc">
              Access reference textbooks, solved papers, lecture guides, and digital syllabus layouts optimized for engineering precision.
            </p>
          </div>
          
          <div className="subject-header__stat border border-slate-800 bg-slate-900/60 p-4">
            <BookOpen size={24} className="text-blueprint-cyan" />
            <div className="subject-header__stat-text">
              <span className="stat-label">Total Assets Loaded</span>
              <span className="stat-value">{allItems.length} Resource Nodes</span>
            </div>
          </div>
        </header>

        {/* Search & Filters Bar */}
        <section className="bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-sm mt-8 animate-fade-up">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-data-mono text-[10px] text-muted mb-2 block tracking-widest">
                Search resources
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input 
                  className="w-full h-12 bg-[#0B0C10] border border-slate-800 focus:border-laser-violet focus:ring-0 text-stark-white font-mono px-12 text-xs transition-all"
                  placeholder="Filter database by keywords or tag names..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categoriesList.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 border font-data-mono text-[10px] flex items-center gap-2 transition-all ${
                  activeCategory === cat.key 
                    ? 'border-blueprint-cyan bg-blueprint-cyan/10 text-blueprint-cyan' 
                    : 'border-slate-800 bg-slate-800/40 text-muted hover:border-blueprint-cyan'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* HIGH DENSITY RESOURCES INDEX TABLE */}
        <div className="border border-slate-800 bg-slate-900 mt-8 animate-fade-up">
          <div className="bg-[#1E293B] px-6 py-3 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-data-mono text-[11px] text-stark-white uppercase tracking-wider">
              DATABASE_INDEX_STREAM_{branch}
            </h3>
            <div className="flex gap-4">
              <span className="text-[10px] font-data-mono text-muted">VERIFIED: SSL-SECURE</span>
              <span className="text-[10px] font-data-mono text-muted">STREAMS: ON_DEMAND</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800/30 text-left border-b border-slate-800">
                  <th className="p-4 font-data-mono text-[10px] text-muted uppercase tracking-wider border-r border-slate-800">Resource Title</th>
                  <th className="p-4 font-data-mono text-[10px] text-muted uppercase tracking-wider border-r border-slate-800">Category Tag</th>
                  <th className="p-4 font-data-mono text-[10px] text-muted uppercase tracking-wider border-r border-slate-800">File Type</th>
                  <th className="p-4 font-data-mono text-[10px] text-muted uppercase tracking-wider border-r border-slate-800">Source status</th>
                  <th className="p-4 font-data-mono text-[10px] text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[12px]">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted text-xs">
                      No files matching the current filters were found in local storage index.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const tagMeta = CAT_TAGS[item.categoryKey] || { label: 'RESOURCES', class: 'tag-default' };
                    // Generate consistent mock sizes
                    const mockSize = item.categoryKey === 'youtube' 
                      ? 'VIDEO LINK' 
                      : `${((item.title.length * 7) % 15 + 1.2).toFixed(1)} MB`;
                    const fileFormat = item.categoryKey === 'youtube' ? 'LINK' : 'PDF';

                    return (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 border-r border-slate-800 text-stark-white max-w-md truncate">
                          <div>
                            <span className="font-semibold block">{item.title}</span>
                            {item.isUserUploaded && (
                              <span className="text-[10px] text-blueprint-cyan mt-1 block">
                                Contributed by: {item.uploadedBy || 'Anonymous'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 border-r border-slate-800">
                          <span className={`px-2 py-0.5 border text-[10px] ${tagMeta.class}`}>
                            {tagMeta.label}
                          </span>
                        </td>
                        <td className="p-4 border-r border-slate-800 text-muted">{mockSize}</td>
                        <td className="p-4 border-r border-slate-800">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            <span className="text-secondary text-[11px]">OFFLINE_READY</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-4">
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blueprint-cyan hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <ExternalLink size={12} />
                              <span>VIEW</span>
                            </a>
                            {item.categoryKey !== 'youtube' && (
                              <a 
                                href={item.url} 
                                download 
                                className="text-laser-violet hover:underline flex items-center gap-1 text-[11px]"
                              >
                                <DownloadCloud size={12} />
                                <span>DL_PDF</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination stats footer */}
          <div className="px-6 py-4 flex justify-between items-center border-t border-slate-800 bg-slate-900">
            <p className="text-[10px] font-data-mono text-muted">
              SHOWING {filteredItems.length} OF {allItems.length} NODES INDEXED
            </p>
            <div className="text-[10px] font-data-mono text-muted">
              DATABASE SYSTEM STATUS: ACTIVE
            </div>
          </div>
        </div>

        {/* Secondary prompt blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 pb-16 animate-fade-up">
          <div className="border border-slate-800 p-8 relative overflow-hidden group">
            <h4 className="font-display text-lg text-stark-white mb-2 uppercase tracking-wide">Request Resource</h4>
            <p className="text-muted mb-6 text-xs leading-relaxed">
              Can't find a specific reference textbook, assignment, or GTU paper? File an on-demand database request.
            </p>
            <Link to="/upload" className="btn btn-secondary text-xs">Open Request [F5]</Link>
          </div>
          <div className="border border-slate-800 p-8 relative overflow-hidden group bg-laser-violet/5">
            <h4 className="font-display text-lg text-laser-violet mb-2 uppercase tracking-wide">AI Study guide</h4>
            <p className="text-muted mb-6 text-xs leading-relaxed">
              Feed these resource links directly into our chatbot engine to design custom notes and timelines.
            </p>
            <Link to="/study-guide" className="btn btn-primary text-xs">Launch Assistant [X]</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Layers placeholder for category items icon
function Layers({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-10 5 10 5 10-5-10-5Z"/>
      <path d="m2 17 10 5 10-5"/>
      <path d="m2 12 10 5 10-5"/>
    </svg>
  );
}
