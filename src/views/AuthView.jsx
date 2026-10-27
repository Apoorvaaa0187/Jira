import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  LogIn,
  UserPlus,
  AlertTriangle,
  Users,
  ShieldCheck,
  Award
} from 'lucide-react';

export const AuthView = () => {
  const { login, register, clubs } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // 'student' | 'coordinator' | 'president'
    rollNo: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    assignedClubId: clubs[0]?.id || ''
  });
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Failed to sign in.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    const res = register(regData);
    if (!res.success) {
      setRegError(res.error || 'Registration failed.');
    }
  };

  const fillDemoCredentials = (email, password) => {
    setAuthMode('login');
    setLoginEmail(email);
    setLoginPassword(password);
    setLoginError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="university-crest" style={{ margin: '0 auto 12px', width: '42px', height: '42px' }}>
            <GraduationCap size={24} />
          </div>
          <h2>Apex University</h2>
          <p>Club & Event Management Portal</p>
        </div>

        {/* Quick Demo Login Shortcut Box */}
        <div className="demo-credentials-box">
          <div className="demo-box-label">Quick Testing Profiles:</div>
          <div className="demo-pills">
            <button
              type="button"
              className="demo-pill"
              onClick={() => fillDemoCredentials('student@apex.edu', 'password123')}
            >
              <Users size={12} /> Student
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => fillDemoCredentials('coordinator@apex.edu', 'password123')}
            >
              <ShieldCheck size={12} /> Coordinator
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => fillDemoCredentials('president@apex.edu', 'password123')}
            >
              <Award size={12} /> President
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="tabs-header" style={{ marginBottom: '20px', justifyContent: 'center' }}>
          <button
            type="button"
            className={`tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setLoginError(''); }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('register'); setRegError(''); }}
          >
            <UserPlus size={14} />
            <span>Create Account</span>
          </button>
        </div>

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            {loginError && (
              <div className="alert-box error" role="alert">
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <div>{loginError}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Institutional Email
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="e.g. student@apex.edu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '8px' }}>
              <LogIn size={15} />
              Sign In to Portal
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            {regError && (
              <div className="alert-box error" role="alert">
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <div>{regError}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Select Account Role <span className="required-star">*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <button
                  type="button"
                  className={`category-pill ${regData.role === 'student' ? 'active' : ''}`}
                  onClick={() => setRegData({ ...regData, role: 'student' })}
                  style={{ textAlign: 'center', padding: '7px 4px' }}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`category-pill ${regData.role === 'coordinator' ? 'active' : ''}`}
                  onClick={() => setRegData({ ...regData, role: 'coordinator' })}
                  style={{ textAlign: 'center', padding: '7px 4px' }}
                >
                  Coordinator
                </button>
                <button
                  type="button"
                  className={`category-pill ${regData.role === 'president' ? 'active' : ''}`}
                  onClick={() => setRegData({ ...regData, role: 'president' })}
                  style={{ textAlign: 'center', padding: '7px 4px' }}
                >
                  President
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-roll">
                  {regData.role === 'student' ? 'Roll Number' : regData.role === 'coordinator' ? 'Faculty ID' : 'Council ID'} <span className="required-star">*</span>
                </label>
                <input
                  id="reg-roll"
                  type="text"
                  className="form-input"
                  placeholder={regData.role === 'student' ? '2025CS101' : 'FAC-001'}
                  value={regData.rollNo}
                  onChange={(e) => setRegData({ ...regData, rollNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  University Email <span className="required-star">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="user@apex.edu"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-pass">
                  Password <span className="required-star">*</span>
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-dept">
                Academic Department <span className="required-star">*</span>
              </label>
              <input
                id="reg-dept"
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science & Engineering"
                value={regData.department}
                onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                required
              />
            </div>

            {regData.role === 'student' && (
              <div className="form-group">
                <label className="form-label" htmlFor="reg-year">
                  Academic Year
                </label>
                <select
                  id="reg-year"
                  className="form-select"
                  value={regData.year}
                  onChange={(e) => setRegData({ ...regData, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            )}

            {regData.role === 'coordinator' && (
              <div className="form-group">
                <label className="form-label" htmlFor="reg-club">
                  Assigned Club to Coordinate
                </label>
                <select
                  id="reg-club"
                  className="form-select"
                  value={regData.assignedClubId}
                  onChange={(e) => setRegData({ ...regData, assignedClubId: e.target.value })}
                >
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name} ({club.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
              <UserPlus size={15} />
              Register & Enter Portal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
