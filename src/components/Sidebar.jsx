import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookmarkCheck,
  ShieldCheck,
  GraduationCap,
  Award,
  Layers
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { clubs, events, membershipRequests, eventRegistrations, currentUser } = useApp();

  const userRole = currentUser?.role || 'student';

  const pendingRequestsCount = membershipRequests.filter(
    (r) => (userRole === 'coordinator' && currentUser.assignedClubId ? r.clubId === currentUser.assignedClubId : true) && r.status === 'Pending'
  ).length;

  const userRegistrationsCount = eventRegistrations.filter(
    (r) => r.rollNo.toUpperCase() === currentUser?.rollNo?.toUpperCase()
  ).length;

  // Role-tailored navigation items
  let navItems = [];

  if (userRole === 'president') {
    navItems = [
      {
        id: 'president',
        label: 'President Portal',
        icon: Award,
        badge: 'Executive',
        section: 'ADMINISTRATION'
      },
      {
        id: 'coordinator',
        label: 'Coordinator Approvals',
        icon: ShieldCheck,
        badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
        section: 'ADMINISTRATION'
      },
      {
        id: 'clubs',
        label: 'All Clubs',
        icon: Users,
        badge: clubs.length,
        section: 'CAMPUS DIRECTORY'
      },
      {
        id: 'events',
        label: 'All Events',
        icon: Calendar,
        badge: events.length,
        section: 'CAMPUS DIRECTORY'
      }
    ];
  } else if (userRole === 'coordinator') {
    navItems = [
      {
        id: 'coordinator',
        label: 'Coordinator Portal',
        icon: ShieldCheck,
        badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
        section: 'CLUB MANAGEMENT'
      },
      {
        id: 'clubs',
        label: 'Browse Clubs',
        icon: Users,
        badge: clubs.length,
        section: 'DIRECTORY'
      },
      {
        id: 'events',
        label: 'Campus Events',
        icon: Calendar,
        badge: events.length,
        section: 'DIRECTORY'
      }
    ];
  } else {
    // Student navigation
    navItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        section: 'MAIN'
      },
      {
        id: 'clubs',
        label: 'Clubs',
        icon: Users,
        badge: clubs.length,
        section: 'STUDENT PORTAL'
      },
      {
        id: 'events',
        label: 'Events',
        icon: Calendar,
        badge: events.length,
        section: 'STUDENT PORTAL'
      },
      {
        id: 'registrations',
        label: 'My Activities',
        icon: BookmarkCheck,
        badge: userRegistrationsCount > 0 ? userRegistrationsCount : null,
        section: 'STUDENT PORTAL'
      }
    ];
  }

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
            <GraduationCap size={20} />
          </div>
          <div className="sidebar-brand">
            <h1>Apex University</h1>
            <p>
              {userRole === 'president'
                ? 'President Portal'
                : userRole === 'coordinator'
                ? 'Coordinator Portal'
                : 'Student Portal'}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {userRole === 'president' ? 'Executive Menu' : userRole === 'coordinator' ? 'Coordinator Menu' : 'Student Menu'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="user-avatar">{currentUser?.avatarInitials || 'AP'}</div>
            <div className="user-info">
              <div className="user-name">{currentUser?.name}</div>
              <div className="user-role" style={{ textTransform: 'capitalize' }}>
                {currentUser?.role} • {currentUser?.rollNo}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
