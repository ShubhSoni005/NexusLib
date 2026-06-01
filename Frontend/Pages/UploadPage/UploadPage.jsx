import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload as UploadIcon, CheckCircle2, X, ArrowRight, ArrowLeft, FileText, Sparkles, BookOpen, Layers, Check } from 'lucide-react';
import { branches, semesters } from '@db';
import { useAuth } from '../../Context/AuthContext';
import './UploadPage.css';

const CATEGORIES = ['Syllabus', 'Previous Year Papers', 'Notes', 'YouTube Playlist', 'Solutions', 'Reference Books'];

const CATEGORY_MAP = {
  'Syllabus': 'syllabus',
  'Previous Year Papers': 'pyq',
  'Notes': 'notes',
  'YouTube Playlist': 'youtube',
  'Solutions': 'solutions',
  'Reference Books': 'books'
};

export default function UploadPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', desc: '', branch: '', semester: '', subject: '', category: '' });
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const semList = form.branch ? semesters[form.branch] || [] : [];
  const subjectList = form.semester ? semList.find(s => s.num === parseInt(form.semester))?.subjects || [] : [];

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nl_upload_draft');
      if (saved) {
        setForm(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, []);

  // Persist draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nl_upload_draft', JSON.stringify(form));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, [form]);

  const set = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'branch') { next.semester = ''; next.subject = ''; }
      if (key === 'semester') { next.subject = ''; }
      return next;
    });
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.branch) e.branch = 'Select a branch';
    if (!form.semester) e.semester = 'Select a semester';
    if (!form.subject) e.subject = 'Select a subject';
    if (!form.category) e.category = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!file) e.file = 'Please attach a file reference';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    try {
      const stored = localStorage.getItem('nl_custom_resources');
      const customList = stored ? JSON.parse(stored) : [];
      
      const newResource = {
        title: form.title,
        desc: form.desc,
        branch: form.branch,
        semester: parseInt(form.semester),
        subject: form.subject,
        category: CATEGORY_MAP[form.category],
        url: file ? URL.createObjectURL(file) : '#',
        uploadedBy: user?.name || 'Anonymous',
        createdAt: new Date().toISOString()
      };
      
      customList.push(newResource);
      localStorage.setItem('nl_custom_resources', JSON.stringify(customList));
      localStorage.removeItem('nl_upload_draft'); // clear draft
    } catch (err) {
      console.error('Error saving upload data:', err);
    }
    
    setDone(true);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        setErrors({ file: 'File exceeds 10MB limit' });
      } else {
        setFile(f);
        setErrors({});
      }
    }
  };

  if (!user) {
    return (
      <div className="page-content upload-auth-wall">
        <div className="container">
          <div className="upload-auth-card surface-glass animate-fade-up">
            <UploadIcon size={48} className="auth-wall-icon" />
            <h2>Share with Community</h2>
            <p>You must be signed in to upload engineering materials and help your peers.</p>
            <div className="auth-wall-actions">
              <Link to="/login" className="btn btn-primary">Sign In</Link>
              <Link to="/signup" className="btn btn-secondary">Join Free</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page-content upload-success">
        <div className="upload-success-card surface-glass animate-fade-up">
          <CheckCircle2 size={48} className="success-icon" />
          <h2>Contribution Submitted!</h2>
          <p>Your material has been submitted for peer review. It will become visible on the pages once approved.</p>
          <button 
            className="btn btn-primary mt-6" 
            onClick={() => { 
              setDone(false); 
              setStep(1);
              setForm({ title:'', desc:'', branch:'', semester:'', subject:'', category:'' }); 
              setFile(null); 
            }}
          >
            Upload Another Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="upload-layout">
          <div className="upload-form-col surface-glass animate-fade-up">
            
            {/* Step Wizard Header */}
            <div className="upload-wizard-header">
              <div className="upload-page-header">
                <h1>Share Materials</h1>
                <p>Contribute notes, formulas, or past question sheets.</p>
              </div>

              {/* Step indicator bar */}
              <div className="step-indicator">
                {[1, 2, 3].map(num => (
                  <div key={num} className={`step-node ${step >= num ? 'step-node--active' : ''} ${step > num ? 'step-node--completed' : ''}`}>
                    <div className="step-circle">
                      {step > num ? <Check size={12} /> : num}
                    </div>
                    <span className="step-label">
                      {num === 1 && 'Details'}
                      {num === 2 && 'Tags'}
                      {num === 3 && 'File'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form className="upload-form" onSubmit={submit} noValidate>
              
              {/* STEP 1: Details */}
              {step === 1 && (
                <div className="step-content animate-fade-in">
                  <div className="form-group">
                    <label className="label">Material Title *</label>
                    <input 
                      className={`input ${errors.title ? 'input--error' : ''}`} 
                      placeholder="e.g. Artificial Intelligence Unit 1 Notes" 
                      value={form.title} 
                      onChange={e => set('title', e.target.value)} 
                    />
                    {errors.title && <span className="field-error">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label className="label">Description (optional)</label>
                    <textarea 
                      className="input textarea" 
                      placeholder="Briefly describe topics or years covered..." 
                      value={form.desc} 
                      onChange={e => set('desc', e.target.value)} 
                      rows={4} 
                    />
                  </div>
                  
                  <div className="wizard-actions">
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      <span>Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Classification */}
              {step === 2 && (
                <div className="step-content animate-fade-in">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Branch *</label>
                      <select 
                        className={`input select ${errors.branch ? 'input--error' : ''}`} 
                        value={form.branch} 
                        onChange={e => set('branch', e.target.value)}
                      >
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      {errors.branch && <span className="field-error">{errors.branch}</span>}
                    </div>
                    <div className="form-group">
                      <label className="label">Semester *</label>
                      <select 
                        className={`input select ${errors.semester ? 'input--error' : ''}`} 
                        value={form.semester} 
                        onChange={e => set('semester', e.target.value)} 
                        disabled={!form.branch}
                      >
                        <option value="">Select Semester</option>
                        {semList.map(s => <option key={s.num} value={s.num}>Semester {s.num}</option>)}
                      </select>
                      {errors.semester && <span className="field-error">{errors.semester}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Subject *</label>
                      <select 
                        className={`input select ${errors.subject ? 'input--error' : ''}`} 
                        value={form.subject} 
                        onChange={e => set('subject', e.target.value)} 
                        disabled={!form.semester}
                      >
                        <option value="">Select Subject</option>
                        {subjectList.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && <span className="field-error">{errors.subject}</span>}
                    </div>
                    <div className="form-group">
                      <label className="label">Category *</label>
                      <select 
                        className={`input select ${errors.category ? 'input--error' : ''}`} 
                        value={form.category} 
                        onChange={e => set('category', e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.category && <span className="field-error">{errors.category}</span>}
                    </div>
                  </div>

                  <div className="wizard-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      <span>Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Upload File */}
              {step === 3 && (
                <div className="step-content animate-fade-in">
                  <div 
                    className={`drop-zone ${drag ? 'drop-zone--active' : ''} ${errors.file ? 'drop-zone--error' : ''}`} 
                    onDragOver={e => { e.preventDefault(); setDrag(true); }} 
                    onDragLeave={() => setDrag(false)} 
                    onDrop={onDrop}
                  >
                    <UploadIcon size={32} className="drop-icon" />
                    <p className="drop-title">Drag & drop files here</p>
                    <p className="drop-sub">PDFs, images, or documents (10MB limit)</p>
                    <label className="btn btn-secondary btn-sm drop-browse mt-4">
                      Browse Files
                      <input 
                        type="file" 
                        style={{ display: 'none' }} 
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg" 
                        onChange={e => { 
                          const f = e.target.files[0];
                          if (f) {
                            if (f.size > 10 * 1024 * 1024) {
                              setErrors({ file: 'File exceeds 10MB limit' });
                            } else {
                              setFile(f);
                              setErrors({});
                            }
                          }
                        }} 
                      />
                    </label>
                  </div>

                  {file && (
                    <div className="file-preview surface-elevated animate-fade-in">
                      <div className="file-preview__info">
                        <FileText size={18} className="text-accent" />
                        <div className="file-preview__text">
                          <span className="file-preview__name">{file.name}</span>
                          <span className="file-preview__size">{(file.size / 1024).toFixed(0)} KB</span>
                        </div>
                      </div>
                      <button type="button" className="file-preview__remove" onClick={() => setFile(null)}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {errors.file && <span className="field-error">{errors.file}</span>}

                  <div className="wizard-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <UploadIcon size={14} />
                      <span>Submit for Review</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right sidebar curation guidelines panel */}
          <div className="upload-tips-panel surface-glass animate-fade-up delay-100">
            <div className="upload-tips-header">
              <Sparkles size={16} className="text-accent" />
              <h3>Curation Rules</h3>
            </div>
            
            <ul className="tips-list">
              <li>
                <strong>Verifiable Title</strong>
                <p>Include name and unit indices clearly.</p>
              </li>
              <li>
                <strong>Clear Visibility</strong>
                <p>Make sure text in images or PDFs is easily legible.</p>
              </li>
              <li>
                <strong>Target Classification</strong>
                <p>Ensure details align accurately with the selected course syllabus.</p>
              </li>
              <li>
                <strong>Non-duplicate</strong>
                <p>Verify that exact slide links do not already exist on that page.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
