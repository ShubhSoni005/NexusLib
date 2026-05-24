import { useState } from 'react';
import { Upload as UploadIcon, CheckCircle2, X } from 'lucide-react';
import { branches, semesters } from '@db';
import './UploadPage.css';

const CATEGORIES = ['Syllabus', 'Previous Year Papers', 'Notes', 'YouTube Playlist', 'Solutions', 'Reference Books'];

export default function UploadPage() {
  const [form, setForm]     = useState({ title: '', desc: '', branch: '', semester: '', subject: '', category: '' });
  const [file, setFile]     = useState(null);
  const [drag, setDrag]     = useState(false);
  const [done, setDone]     = useState(false);
  const [errors, setErrors] = useState({});

  const semList     = form.branch   ? semesters[form.branch] || [] : [];
  const subjectList = form.semester ? semList.find(s => s.num === parseInt(form.semester))?.subjects || [] : [];

  const set = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'branch')   { next.semester = ''; next.subject = ''; }
      if (key === 'semester') { next.subject = ''; }
      return next;
    });
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title    = 'Title is required';
    if (!form.branch)       e.branch   = 'Select a branch';
    if (!form.semester)     e.semester = 'Select a semester';
    if (!form.subject)      e.subject  = 'Select a subject';
    if (!form.category)     e.category = 'Select a category';
    if (!file)              e.file     = 'Please attach a file';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => { e.preventDefault(); if (!validate()) return; setDone(true); };
  const onDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  if (done) return (
    <div className="page-content upload-success">
      <CheckCircle2 size={48} className="success-icon" />
      <h2>Upload Submitted!</h2>
      <p>Your material has been submitted for review. It will be available after approval.</p>
      <button className="btn btn-primary" onClick={() => { setDone(false); setForm({ title:'',desc:'',branch:'',semester:'',subject:'',category:'' }); setFile(null); }}>
        Upload Another
      </button>
    </div>
  );

  return (
    <div className="page-content">
      <div className="container">
        <div className="upload-layout">
          <div className="upload-form-col animate-fade-up">
            <div className="upload-page-header">
              <h1>Upload Study Material</h1>
              <p>Help your peers by sharing quality resources. All uploads are reviewed before publishing.</p>
            </div>

            <form className="upload-form" onSubmit={submit} noValidate>
              <div className="form-group">
                <label className="label">Material Title *</label>
                <input className={`input${errors.title ? ' input--error' : ''}`} placeholder="e.g. AI Unit 1 Notes" value={form.title} onChange={e => set('title', e.target.value)} />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="label">Description (optional)</label>
                <textarea className="input textarea" placeholder="Briefly describe what this material covers…" value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Branch *</label>
                  <select className={`input select${errors.branch ? ' input--error' : ''}`} value={form.branch} onChange={e => set('branch', e.target.value)}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  {errors.branch && <span className="field-error">{errors.branch}</span>}
                </div>
                <div className="form-group">
                  <label className="label">Semester *</label>
                  <select className={`input select${errors.semester ? ' input--error' : ''}`} value={form.semester} onChange={e => set('semester', e.target.value)} disabled={!form.branch}>
                    <option value="">Select Semester</option>
                    {semList.map(s => <option key={s.num} value={s.num}>Semester {s.num}</option>)}
                  </select>
                  {errors.semester && <span className="field-error">{errors.semester}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Subject *</label>
                  <select className={`input select${errors.subject ? ' input--error' : ''}`} value={form.subject} onChange={e => set('subject', e.target.value)} disabled={!form.semester}>
                    <option value="">Select Subject</option>
                    {subjectList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <label className="label">Category *</label>
                  <select className={`input select${errors.category ? ' input--error' : ''}`} value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="field-error">{errors.category}</span>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary upload-submit">
                <UploadIcon size={16} /> Submit for Review
              </button>
            </form>
          </div>

          <div className="upload-drop-col animate-fade-up delay-100">
            <div className={`drop-zone${drag ? ' drop-zone--active' : ''}${errors.file ? ' drop-zone--error' : ''}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
              <UploadIcon size={32} className="drop-icon" />
              <p className="drop-title">Drag files here</p>
              <p className="drop-sub">Upload PDFs, docs or images (max 10MB each)</p>
              <label className="btn btn-secondary btn-sm drop-browse">
                Browse Files
                <input type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.png,.jpg" onChange={e => { setFile(e.target.files[0]); setErrors(er => ({ ...er, file: '' })); }} />
              </label>
            </div>

            {file && (
              <div className="file-preview">
                <div className="file-preview__info">
                  <span className="file-preview__name">{file.name}</span>
                  <span className="file-preview__size">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
                <button className="file-preview__remove" onClick={() => setFile(null)}><X size={14} /></button>
              </div>
            )}
            {errors.file && <span className="field-error">{errors.file}</span>}

            <div className="upload-tips">
              <p className="upload-tips__title">Curator's Tips</p>
              <ul>
                <li>Use clear, descriptive titles</li>
                <li>Make sure PDFs are readable (not scanned images)</li>
                <li>Verify content matches the selected subject</li>
                <li>Add a description for better discoverability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
