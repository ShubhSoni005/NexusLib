import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import './AuthPages.css';

export function LoginPage() {
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email    = 'Enter a valid email';
    if (form.password.length < 6)  e.password = 'Minimum 6 characters';
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
    <div className="auth-page page-content">
      <div className="auth-card card animate-fade-up">
        <div className="auth-logo"><BookOpen size={22} /><span>NexusLib</span></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to access your saved materials and study plans.</p>

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="label">Email</label>
            <input className={`input${errors.email ? ' input--error' : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <div className="password-wrap">
              <input className={`input${errors.password ? ' input--error' : ''}`} type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-btn">Sign In</button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/signup">Join Free</Link></p>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name     = 'Name is required';
    if (!form.email.includes('@')) e.email    = 'Enter a valid email';
    if (form.password.length < 6)  e.password = 'Minimum 6 characters';
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

  return (
    <div className="auth-page page-content">
      <div className="auth-card card animate-fade-up">
        <div className="auth-logo"><BookOpen size={22} /><span>NexusLib</span></div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of GTU students sharing knowledge.</p>

        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className={`input${errors.name ? ' input--error' : ''}`} placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className={`input${errors.email ? ' input--error' : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <div className="password-wrap">
              <input className={`input${errors.password ? ' input--error' : ''}`} type={show ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" className="pwd-toggle" onClick={() => setShow(s => !s)}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary auth-btn">Create Account</button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}

