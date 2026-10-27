import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users2,
  CalendarDays,
  BookmarkCheck,
  Clock,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const DashboardView = ({ setActiveTab, onSelectEvent, onSelectClub }) => {
  const { clubs, events, membershipRequests, eventRegistrations, currentUser } = useApp();

  const userMemberships = membershipRequests.filter(
    (req) => req.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase()
  );
  const approvedMemberships = userMemberships.filter((r) => r.status === 'Approved').length;
  const pendingMemberships = userMemberships.filter((r) => r.status === 'Pending').length;

  const userEventRegistrations = eventRegistrations.filter(
    (reg) => reg.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase()
  );

  return (
    <div className="dashboard-view">
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2744 0%, #1e3a8a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '14px'
            }}
          >
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            <span>Welcome back, {currentUser.name}!</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.25, marginBottom: '8px' }}>
            Apex University Student Engagement Hub
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
            Discover campus student societies, apply for official club memberships, and secure seats for technical hackathons and cultural symposiums.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ backgroundColor: '#2563eb', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={() => setActiveTab('events')}
            >
              <CalendarDays size={16} />
              Explore Events
            </button>
            <button
              className="btn btn-outline"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
              onClick={() => setActiveTab('clubs')}
            >
              <Users2 size={16} />
              Browse Clubs
            </button>
          </div>
        </div>
      </div>

      {/* High-level Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{clubs.length}</div>
            <div className="stat-label">Recognized University Clubs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CalendarDays size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">Active Campus Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">
            <BookmarkCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{userEventRegistrations.length}</div>
            <div className="stat-label">My Event Registrations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pendingMemberships} / {userMemberships.length}</div>
            <div className="stat-label">Pending / Total Club Requests</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Featured Upcoming Events */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Featured Events</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Urgent registration deadlines and limited seats</p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('events')}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '10px' }}>
                      {event.category}
                    </span>
                    {event.availableSeats === 0 ? (
                      <span className="badge badge-full" style={{ fontSize: '10px' }}>Full</span>
                    ) : event.availableSeats <= 3 ? (
                      <span className="badge badge-warning" style={{ fontSize: '10px' }}>{event.availableSeats} seats left</span>
                    ) : null}
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {event.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {event.location.split(',')[0]}
                    </span>
                  </div>
                </div>

                <button
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

        {/* Popular Clubs Showcase */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>University Clubs</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Official student bodies recruiting this semester</p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('clubs')}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {clubs.slice(0, 3).map((club) => {
              const req = userMemberships.find((m) => m.clubId === club.id);
              return (
                <div
                  key={club.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '10px' }}>
                        {club.category}
                      </span>
                      {req && (
                        <span className={`badge badge-${req.status.toLowerCase()}`} style={{ fontSize: '10px' }}>
                          {req.status}
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {club.name}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Coordinator: {club.coordinator.split('&')[0]}
                    </p>
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setActiveTab('clubs');
                      if (onSelectClub) onSelectClub(club);
                    }}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* University Student Guidelines Notice */}
      <div
        style={{
          marginTop: '28px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}
      >
        <ShieldAlert size={22} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>
            Academic PBL Submission & Testing Guide
          </h4>
          <p style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.6 }}>
            This system enforces real-time client-side business logic: duplicate registration prevention (by student roll number and email), event seat decrementing with strict 0-seat lockout, and 3-tier membership lifecycle states (<strong>Pending</strong>, <strong>Approved</strong>, and <strong>Rejected</strong>). All data persists across browser reloads via <code>localStorage</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
