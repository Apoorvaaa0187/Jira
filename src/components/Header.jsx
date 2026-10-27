import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  RotateCcw,
  User,
  LogOut,
  ShieldCheck,
  Award,
  Users
} from 'lucide-react';
import { Modal } from './Modal';

export const Header = ({ activeTab, onToggleSidebar }) => {
  const { currentUser, setCurrentUser, logout, switchRole, resetDemoData } = useApp();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    rollNo: currentUser?.rollNo || '',
    email: currentUser?.email || '',
    department: currentUser?.department || '',
    year: currentUser?.year || ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        rollNo: currentUser.rollNo,
        email: currentUser.email,
        department: currentUser.department,
        year: currentUser.year
      });
    }
  }, [currentUser, isProfileModalOpen]);

  const titles = {
    dashboard: {
      title: currentUser?.role === 'coordinator'
        ? 'Coordinator Dashboard'
        : currentUser?.role === 'president'
        ? 'Executive Portal'
        : 'Student Dashboard',
      subtitle: currentUser?.role === 'coordinator'
        ? 'Society management, applications review, and event scheduling'
        : currentUser?.role === 'president'
        ? 'University student organization governance and system metrics'
        : 'Overview of recognized student clubs, campus events, and personal activity'
    },
    clubs: {
      title: 'University Clubs',
      subtitle: 'Browse student organizations, view coordinators, and submit membership requests'
    },
    events: {
      title: 'Campus Events',
      subtitle: 'Browse upcoming campus events, check seats, and register'
    },
    registrations: {
      title: 'My Activities',
      subtitle: 'Track your confirmed event registrations and club membership requests'
    },
    coordinator: {
      title: 'Coordinator Operations',
      subtitle: 'Review student membership applications, manage events, and view attendee rosters'
    },
    president: {
      title: 'President Governance Portal',
      subtitle: 'Executive oversight: charter new clubs, view rosters, and audit university activities'
    }
  };

  const currentInfo = titles[activeTab] || titles.dashboard;

  const handleProfileSave = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      ...profileForm,
      avatarInitials: profileForm.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    });
    setIsProfileModalOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset application to default sample PBL dataset? Any new test registrations and accounts will be cleared.')) {
      resetDemoData();
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'president':
        return <span className="badge badge-warning"><Award size={11} /> President</span>;
      case 'coordinator':
        return <span className="badge badge-approved"><ShieldCheck size={11} /> Coordinator</span>;
      default:
        return <span className="badge badge-open"><Users size={11} /> Student</span>;
    }
  };

  return (
    <>
      <header className="top-header">
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
          <div className="page-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>{currentInfo.title}</h2>
              {currentUser && getRoleBadge(currentUser.role)}
            </div>
            <p>{currentInfo.subtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Quick Role Switcher for Evaluators */}
          <div className="role-switcher-group" title="Quick switch active role for PBL demonstration">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Portal:</span>
            <select
              className="form-select"
              style={{ padding: '3px 8px', fontSize: '12px', width: 'auto' }}
              value={currentUser?.role || 'student'}
              onChange={(e) => switchRole(e.target.value)}
            >
              <option value="student">Student Portal</option>
              <option value="coordinator">Coordinator Portal</option>
              <option value="president">President Portal</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setIsProfileModalOpen(true)}
            title="View or edit active profile"
          >
            <User size={13} />
            <span>{currentUser?.name?.split(' ')[0]}</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleReset}
            title="Reset demo data to initial sample values"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={logout}
            title="Sign out of your account"
            style={{ color: '#dc2626' }}
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Student Profile Switcher Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Active User Profile"
        subtitle={`Role: ${currentUser?.role?.toUpperCase()} • Account ID: ${currentUser?.id}`}
      >
        <form onSubmit={handleProfileSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-roll">
                Identification / Roll No <span className="required-star">*</span>
              </label>
              <input
                id="profile-roll"
                type="text"
                className="form-input"
                value={profileForm.rollNo}
                onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">
              University Email <span className="required-star">*</span>
            </label>
            <input
              id="profile-email"
              type="email"
              className="form-input"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-dept">
                Department <span className="required-star">*</span>
              </label>
              <input
                id="profile-dept"
                type="text"
                className="form-input"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-year">
                Designation / Year
              </label>
              <input
                id="profile-year"
                type="text"
                className="form-input"
                value={profileForm.year}
                onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
