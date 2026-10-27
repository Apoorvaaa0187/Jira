import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  BookmarkCheck,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { clubs, events, membershipRequests, eventRegistrations, currentUser } = useApp();

  const pendingRequestsCount = membershipRequests.filter((r) => r.status === 'Pending').length;
  const userRegistrationsCount = eventRegistrations.length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      section: 'OVERVIEW'
    },
    {
      id: 'clubs',
      label: 'University Clubs',
      icon: Users2,
      badge: clubs.length,
      section: 'STUDENT PORTAL'
    },
    {
      id: 'events',
      label: 'Campus Events',
      icon: CalendarDays,
      badge: events.length,
      section: 'STUDENT PORTAL'
    },
    {
      id: 'registrations',
      label: 'My Activities',
      icon: BookmarkCheck,
      badge: userRegistrationsCount > 0 ? userRegistrationsCount : null,
      section: 'STUDENT PORTAL'
    },
    {
      id: 'coordinator',
      label: 'Coordinator Approvals',
      icon: ShieldCheck,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : null,
      section: 'ADMIN & REVIEW'
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth <= 900) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="university-crest">
            <GraduationCap size={24} />
          </div>
          <div className="sidebar-brand">
            <h1>Apex University</h1>
            <p>Club & Event Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Overview</div>
          {navItems
            .filter((item) => item.section === 'OVERVIEW')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              );
            })}

          <div className="nav-section-title">Student Services</div>
          {navItems
            .filter((item) => item.section === 'STUDENT PORTAL')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              );
            })}

          <div className="nav-section-title">Evaluation & Review</div>
          {navItems
            .filter((item) => item.section === 'ADMIN & REVIEW')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="nav-badge"
                      style={
                        pendingRequestsCount > 0
                          ? { backgroundColor: '#f59e0b', color: '#78350f' }
                          : {}
                      }
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="user-avatar">{currentUser.avatarInitials || 'AS'}</div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{currentUser.rollNo} • {currentUser.year}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
