import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  RotateCcw,
  User,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import { Modal } from './Modal';

export const Header = ({ activeTab, onToggleSidebar }) => {
  const { currentUser, setCurrentUser, resetDemoData } = useApp();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    rollNo: currentUser.rollNo,
    email: currentUser.email,
    department: currentUser.department,
    year: currentUser.year
  });

  const titles = {
    dashboard: {
      title: 'University Dashboard',
      subtitle: 'Overview of recognized student clubs, campus events, and personal activity'
    },
    clubs: {
      title: 'University Clubs & Societies',
      subtitle: 'Explore student organizations, meet coordinators, and submit membership requests'
    },
    events: {
      title: 'Campus Events & Workshops',
      subtitle: 'Browse upcoming collegiate symposiums, hackathons, and secure your registration'
    },
    registrations: {
      title: 'My Activities & Registrations',
      subtitle: 'Track your confirmed event passes and membership review status'
    },
    coordinator: {
      title: 'Coordinator Approvals & Review Panel',
      subtitle: 'Simulate club coordinator role: approve or reject pending student membership requests'
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
    if (window.confirm('Restore application to initial sample PBL dataset? Any new test registrations will be reset.')) {
      resetDemoData();
    }
  };

  return (
    <>
      <header className="top-header">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>
          <div className="page-title-group">
            <h2>{currentInfo.title}</h2>
            <p>{currentInfo.subtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="academic-badge">
            <CalendarCheck size={14} style={{ color: '#2563eb' }} />
            <span>Autumn Term 2026</span>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsProfileModalOpen(true)}
            title="Switch or edit active student tester profile"
          >
            <User size={14} />
            <span>Student: {currentUser.rollNo}</span>
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={handleReset}
            title="Reset demo data to initial sample values"
          >
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Student Profile Switcher Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Active Student Profile"
        subtitle="Modify active student identity to test duplicate prevention across different roll numbers"
      >
        <form onSubmit={handleProfileSave}>
          <div className="alert-box info">
            <User size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Quick Testing Tip:</strong> Change the Roll Number or Email here to test registering the same event as a new student, or keep it to verify duplicate prevention!
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name <span className="required-star">*</span></label>
              <input
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number <span className="required-star">*</span></label>
              <input
                type="text"
                className="form-input"
                value={profileForm.rollNo}
                onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">University Email <span className="required-star">*</span></label>
            <input
              type="email"
              className="form-input"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department <span className="required-star">*</span></label>
              <input
                type="text"
                className="form-input"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Academic Year <span className="required-star">*</span></label>
              <select
                className="form-select"
                value={profileForm.year}
                onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              Save Active Profile
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
