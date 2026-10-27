import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  BookmarkCheck,
  Clock,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const DashboardView = ({ setActiveTab, onSelectEvent, onSelectClub }) => {
  const { clubs, events, membershipRequests, eventRegistrations, currentUser } = useApp();

  const userMemberships = membershipRequests.filter(
    (req) => req.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase()
  );
  const pendingMemberships = userMemberships.filter((r) => r.status === 'Pending').length;

  const userEventRegistrations = eventRegistrations.filter(
    (reg) => reg.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase()
  );

  return (
    <div className="dashboard-view">
      {/* Page Summary Header */}
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Welcome, {currentUser.name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            College of Engineering • Roll No: {currentUser.rollNo} • {currentUser.department}
          </p>
        </div>
      </div>

      {/* Useful Summary Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Recognized Clubs</div>
            <div className="stat-value">{clubs.length}</div>
          </div>
          <Users size={20} className="stat-icon-subtle" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Campus Events</div>
            <div className="stat-value">{events.length}</div>
          </div>
          <Calendar size={20} className="stat-icon-subtle" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">My Event Passes</div>
            <div className="stat-value">{userEventRegistrations.length}</div>
          </div>
          <BookmarkCheck size={20} className="stat-icon-subtle" />
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Club Requests</div>
            <div className="stat-value">{pendingMemberships}</div>
          </div>
          <Clock size={20} className="stat-icon-subtle" />
        </div>
      </div>

      {/* Two-Column Compact Overview */}
      <div className="dashboard-grid">
        {/* Compact Upcoming Events List */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Upcoming Events</h3>
              <p className="panel-subtitle">Latest scheduled campus activities</p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('events')}
            >
              All Events <ArrowRight size={13} />
            </button>
          </div>

          <div className="compact-list">
            {events.slice(0, 4).map((event) => (
              <div key={event.id} className="compact-item">
                <div className="compact-item-main">
                  <div className="compact-meta">
                    <span className="text-muted">{event.date}</span>
                    <span>•</span>
                    <span className="text-muted">{event.clubName.split(' ')[0]}</span>
                    <span>•</span>
                    {event.availableSeats === 0 ? (
                      <span className="badge badge-full">Full</span>
                    ) : event.availableSeats <= 3 ? (
                      <span className="badge badge-warning">{event.availableSeats} left</span>
                    ) : (
                      <span className="badge badge-open">{event.availableSeats} seats</span>
                    )}
                  </div>
                  <div className="compact-title">{event.title}</div>
                  <div className="compact-sub">
                    <MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />
                    {event.location}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setActiveTab('events');
                    if (onSelectEvent) onSelectEvent(event);
                  }}
                  disabled={event.availableSeats === 0}
                >
                  {event.availableSeats === 0 ? 'Full' : 'Register'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Clubs Activity */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">University Clubs</h3>
              <p className="panel-subtitle">Recognized societies recruiting members</p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('clubs')}
            >
              All Clubs <ArrowRight size={13} />
            </button>
          </div>

          <div className="compact-list">
            {clubs.slice(0, 4).map((club) => {
              const req = userMemberships.find((m) => m.clubId === club.id);
              return (
                <div key={club.id} className="compact-item">
                  <div className="compact-item-main">
                    <div className="compact-meta">
                      <span className="tag-pill">{club.category}</span>
                      {req && (
                        <span className={`badge badge-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                    <div className="compact-title">{club.name}</div>
                    <div className="compact-sub">
                      Lead: {club.coordinator.split('&')[0]} • {club.memberCount} members
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setActiveTab('clubs');
                      if (onSelectClub) onSelectClub(club);
                    }}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
