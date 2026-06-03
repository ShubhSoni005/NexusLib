import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Check, X, Sparkles, Shield, Bookmark } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import './AuthPages.css';

// Left Side Brand Showcase Panel for split layout
function BrandShowcase() {
  return (
    <div className="auth-brand-showcase">
      <div className="auth-brand-overlay" />
      <div className="auth-brand-content">
        <Link to="/" className="auth-brand-logo">
          <BookOpen size={28} />
          <span>NexusLib</span>
        </Link>
        
        <div className="auth-brand-hero">
          <h2>Engineering Study Portal Reimagined.</h2>
          <p>Access notes, PYQs, syllabus resources, and an AI-powered study coach to make exam preparation faster and more effective.</p>
        </div>

        <div className="auth-brand-features">
          <div className="auth-feature-item">
            <Shield size={16} />
            <span>Syllabus-aligned GTU study plans</span>
          </div>
          <div className="auth-feature-item">
            <Bookmark size={16} />
            <span>Quick-save resources</span>
          </div>
          <div className="auth-feature-item">
            <Sparkles size={16} />
            <span>AI assistance</span>
          </div>
        </div>

        <footer className="auth-brand-footer">
          <div className="social-proof-counter">
            <span className="bullet-pulse" />
            <span>Join many of your peers now</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Password Complexity Evaluator
const checkPasswordStrength = (pass) => {
  if (!pass) return { score: 0, text: 'Empty', color: 'transparent' };
  let score = 0;
  if (pass.length >= 6) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  const textMap = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const colorMap = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#10b981'];
  
  return {
    score,
    text: textMap[score],
    color: colorMap[score]
  };
};

export function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) {
      login(form.email, form.password);
      navigate('/');
    }
  };

  return (
    <div className="auth-page-split">
      <BrandShowcase />
      
      <div className="auth-form-container page-content">
        <div className="auth-form-box surface-glass animate-fade-up">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to sync your search history and study materials.</p>

          <form className="auth-form" onSubmit={submit} noValidate>
            {/* Email Floating Label Input */}
            <div className="floating-group">
              <input 
                id="login-email"
                type="email" 
                placeholder=" "
                className={`floating-input ${errors.email ? 'input--error' : ''}`}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <label htmlFor="login-email" className="floating-label">Email Address</label>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password Input with Toggle */}
            <div className="floating-group">
              <div className="password-wrap">
                <input 
                  id="login-password"
                  type={show ? 'text' : 'password'} 
                  placeholder=" "
                  className={`floating-input ${errors.password ? 'input--error' : ''}`}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <label htmlFor="login-password" className="floating-label">Password</label>
                <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary auth-btn mt-4">Sign In</button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/signup">Join Free</Link></p>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) {
      signup(form.name, form.email, form.password);
      navigate('/');
    }
  };

  const strength = checkPasswordStrength(form.password);

  return (
    <div className="auth-page-split">
      <BrandShowcase />
      
      <div className="auth-form-container page-content">
        <div className="auth-form-box surface-glass animate-fade-up">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Access the full catalog of GTU notes & AI chatbots.</p>

          <form className="auth-form" onSubmit={submit} noValidate>
            {/* Full Name */}
            <div className="floating-group">
              <input 
                id="signup-name"
                type="text" 
                placeholder=" "
                className={`floating-input ${errors.name ? 'input--error' : ''}`}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <label htmlFor="signup-name" className="floating-label">Full Name</label>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="floating-group">
              <input 
                id="signup-email"
                type="email" 
                placeholder=" "
                className={`floating-input ${errors.email ? 'input--error' : ''}`}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <label htmlFor="signup-email" className="floating-label">Email Address</label>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="floating-group mb-2">
              <div className="password-wrap">
                <input 
                  id="signup-password"
                  type={show ? 'text' : 'password'} 
                  placeholder=" "
                  className={`floating-input ${errors.password ? 'input--error' : ''}`}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <label htmlFor="signup-password" className="floating-label">Password</label>
                <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Password Strength Meter */}
            {form.password && (
              <div className="password-strength-container animate-fade-in">
                <div className="password-strength-bar-bg">
                  <div 
                    className="password-strength-bar-fill" 
                    style={{ 
                      width: `${(strength.score / 4) * 100}%`,
                      backgroundColor: strength.color 
                    }}
                  />
                </div>
                <span className="password-strength-text" style={{ color: strength.color }}>
                  Password Strength: {strength.text}
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-btn mt-6">Create Account</button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
