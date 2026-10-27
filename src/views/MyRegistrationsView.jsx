import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Users2,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const MyRegistrationsView = ({ onNavigateToEvents, onNavigateToClubs }) => {
  const {
    eventRegistrations,
    membershipRequests,
    currentUser,
    cancelEventRegistration
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('events'); // 'events' | 'clubs'
  const [activeTicket, setActiveTicket] = useState(null);

  // Filter items belonging to current student
  const studentRegistrations = eventRegistrations.filter(
    (r) =>
      r.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase() ||
      r.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const studentRequests = membershipRequests.filter(
    (m) =>
      m.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase() ||
      m.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleCancelRegistration = (reg) => {
    if (
      window.confirm(
        `Are you sure you want to cancel your registration for "${reg.eventTitle}"? Your ticket pass will be revoked and 1 seat will be released.`
      )
    ) {
      cancelEventRegistration(reg.id);
    }
  };

  return (
    <div className="my-registrations-view">
      {/* Sub Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeSubTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('events')}
        >
          <CalendarDays size={16} />
          <span>My Event Passes</span>
          <span className="tab-count-badge">{studentRegistrations.length}</span>
        </button>

        <button
          className={`tab-btn ${activeSubTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('clubs')}
        >
          <Users2 size={16} />
          <span>Club Memberships & Applications</span>
          <span className="tab-count-badge">{studentRequests.length}</span>
        </button>
      </div>

      {/* Tab 1: Event Registrations */}
      {activeSubTab === 'events' && (
        <div>
          {studentRegistrations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Ticket size={28} />
              </div>
              <div className="empty-title">No Event Registrations Found</div>
              <div className="empty-desc">
                You haven't registered for any campus events under Roll No: <strong>{currentUser.rollNo}</strong>. Browse events to secure your seat.
              </div>
              <button className="btn btn-primary btn-sm" onClick={onNavigateToEvents}>
                Explore Upcoming Events <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="university-table">
                <thead>
                  <tr>
                    <th>Ticket Code</th>
                    <th>Event Details</th>
                    <th>Schedule & Venue</th>
                    <th>Registered At</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          {reg.ticketCode}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                          {reg.eventTitle}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Organized by {reg.clubName}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <Calendar size={13} style={{ color: '#2563eb' }} />
                          <span>{reg.eventDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <MapPin size={12} style={{ color: '#dc2626' }} />
                          <span>{reg.location}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {reg.registeredDate}
                      </td>
                      <td>
                        <span className="badge badge-approved">
                          <CheckCircle2 size={12} />
                          {reg.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setActiveTicket(reg)}
                            title="View official digital pass"
                          >
                            <Ticket size={13} />
                            View Pass
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#dc2626', borderColor: '#fecaca' }}
                            onClick={() => handleCancelRegistration(reg)}
                            title="Cancel event reservation and release seat"
                          >
                            <Trash2 size={13} />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Club Memberships & Applications */}
      {activeSubTab === 'clubs' && (
        <div>
          {studentRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users2 size={28} />
              </div>
              <div className="empty-title">No Club Applications on Record</div>
              <div className="empty-desc">
                You haven't submitted any membership requests under Roll No: <strong>{currentUser.rollNo}</strong> yet. Join a society to get involved!
              </div>
              <button className="btn btn-primary btn-sm" onClick={onNavigateToClubs}>
                Browse Recognized Clubs <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="university-table">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Application Date</th>
                    <th>Submitted Statement</th>
                    <th>Review Status</th>
                    <th>Coordinator Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                          {req.clubName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Student: {req.studentName} ({req.rollNo})
                        </div>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {req.appliedDate}
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic', lineHeight: 1.4 }}>
                          "{req.reason}"
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${req.status.toLowerCase()}`}>
                          {req.status === 'Approved' && <CheckCircle2 size={12} />}
                          {req.status === 'Pending' && <Clock size={12} />}
                          {req.status === 'Rejected' && <XCircle size={12} />}
                          {req.status}
                        </span>
                      </td>
                      <td style={{ maxWidth: '260px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {req.reviewNotes || 'Under coordinator evaluation.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Ticket Pass Modal */}
      <Modal
        isOpen={!!activeTicket}
        onClose={() => setActiveTicket(null)}
        title="Official Event Pass"
        subtitle="Present this QR/Ticket Code at campus venue registration desk"
        maxWidth="500px"
      >
        {activeTicket && (
          <div>
            <div className="ticket-card">
              <div className="ticket-header">
                <div>
                  <div className="ticket-brand">Apex University • Official Pass</div>
                  <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '2px' }}>
                    {activeTicket.clubName}
                  </div>
                </div>
                <div className="ticket-code">{activeTicket.ticketCode}</div>
              </div>

              <h4 className="ticket-title">{activeTicket.eventTitle}</h4>

              <div className="ticket-details">
                <div className="ticket-detail-item">
                  <div className="lbl">Attendee Name</div>
                  <div className="val">{activeTicket.studentName}</div>
                </div>
                <div className="ticket-detail-item">
                  <div className="lbl">Roll Number</div>
                  <div className="val">{activeTicket.rollNo}</div>
                </div>
                <div className="ticket-detail-item">
                  <div className="lbl">Scheduled Date</div>
                  <div className="val">{activeTicket.eventDate}</div>
                </div>
                <div className="ticket-detail-item">
                  <div className="lbl">Venue</div>
                  <div className="val">{activeTicket.location}</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '12px',
                  borderTop: '1px dashed rgba(255,255,255,0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#94a3b8'
                }}
              >
                <span>Seat Reservation: Confirmed</span>
                <span>Booked: {activeTicket.registeredDate}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTicket(null)}
              >
                Close Pass
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
