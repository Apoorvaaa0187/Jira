import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  RotateCcw,
  User,
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

  // Sync profileForm whenever currentUser or modal opens (fixes reset demo bug)
  useEffect(() => {
    setProfileForm({
      name: currentUser.name,
      rollNo: currentUser.rollNo,
      email: currentUser.email,
      department: currentUser.department,
      year: currentUser.year
    });
  }, [currentUser, isProfileModalOpen]);

  const titles = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of recognized student clubs, campus events, and personal activity'
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
      title: 'Coordinator Approvals',
      subtitle: 'Review student membership applications: approve or reject with notes'
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
    if (window.confirm('Reset application to default sample PBL dataset? Any new test registrations will be cleared.')) {
      resetDemoData();
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
            <h2>{currentInfo.title}</h2>
            <p>{currentInfo.subtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="term-indicator">
            Autumn Term 2026
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setIsProfileModalOpen(true)}
            title="Switch or edit active student profile"
          >
            <User size={14} />
            <span>Profile: {currentUser.rollNo}</span>
          </button>

          <button
            type="button"
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
        title="Student Profile"
        subtitle="Edit active student credentials to test duplicate prevention across different roll numbers"
      >
        <form onSubmit={handleProfileSave}>
          <div className="alert-box info">
            <div>
              <strong>Testing Tip:</strong> Changing the Roll Number or Email allows testing as a different student without clearing storage.
            </div>
          </div>

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
                Roll Number <span className="required-star">*</span>
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
                Academic Year <span className="required-star">*</span>
              </label>
              <select
                id="profile-year"
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

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={15} />
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
