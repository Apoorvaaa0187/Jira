import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Users,
  Ticket,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ArrowRight
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
        `Cancel registration for "${reg.eventTitle}"? 1 seat will be released back to the event.`
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
          type="button"
          className={`tab-btn ${activeSubTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('events')}
        >
          <Calendar size={15} />
          <span>Event Registrations</span>
          <span className="tab-count-badge">{studentRegistrations.length}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeSubTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('clubs')}
        >
          <Users size={15} />
          <span>Club Membership Requests</span>
          <span className="tab-count-badge">{studentRequests.length}</span>
        </button>
      </div>

      {/* Tab 1: Event Registrations */}
      {activeSubTab === 'events' && (
        <div>
          {studentRegistrations.length === 0 ? (
            <div className="empty-state">
              <Ticket size={28} className="empty-icon" />
              <div className="empty-title">No Event Registrations</div>
              <div className="empty-desc">
                No active event passes for Roll No: <strong>{currentUser.rollNo}</strong>.
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onNavigateToEvents}
              >
                Browse Events <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="university-table">
                <thead>
                  <tr>
                    <th>Pass Code</th>
                    <th>Event</th>
                    <th>Date & Venue</th>
                    <th>Registered</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <span className="code-pill">{reg.ticketCode}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {reg.eventTitle}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {reg.clubName}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px' }}>{reg.eventDate}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{reg.location}</div>
                      </td>
                      <td className="text-muted" style={{ fontSize: '12px' }}>
                        {reg.registeredDate}
                      </td>
                      <td>
                        <span className="badge badge-approved">
                          {reg.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setActiveTicket(reg)}
                          >
                            Pass
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                            onClick={() => handleCancelRegistration(reg)}
                            title="Cancel registration and release seat"
                          >
                            <Trash2 size={12} />
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
              <Users size={28} className="empty-icon" />
              <div className="empty-title">No Club Applications</div>
              <div className="empty-desc">
                No club membership applications submitted for Roll No: <strong>{currentUser.rollNo}</strong>.
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onNavigateToClubs}
              >
                Browse Clubs <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="university-table">
                <thead>
                  <tr>
                    <th>Club</th>
                    <th>Date Applied</th>
                    <th>Reason / Statement</th>
                    <th>Status</th>
                    <th>Coordinator Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {req.clubName}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {req.studentName} ({req.rollNo})
                        </div>
                      </td>
                      <td className="text-muted" style={{ fontSize: '12px' }}>
                        {req.appliedDate}
                      </td>
                      <td style={{ maxWidth: '280px', fontSize: '12px', color: 'var(--text-main)' }}>
                        "{req.reason}"
                      </td>
                      <td>
                        <span className={`badge badge-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {req.reviewNotes || 'Under evaluation.'}
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
        title="Event Registration Pass"
        subtitle="Verification pass for campus event entrance"
        maxWidth="480px"
      >
        {activeTicket && (
          <div>
            <div className="ticket-card-simple">
              <div className="ticket-top">
                <span className="ticket-org">{activeTicket.clubName}</span>
                <span className="ticket-code-badge">{activeTicket.ticketCode}</span>
              </div>

              <h4 className="ticket-event-title">{activeTicket.eventTitle}</h4>

              <div className="ticket-grid">
                <div>
                  <span className="ticket-field-label">Student:</span>
                  <div className="ticket-field-val">{activeTicket.studentName} ({activeTicket.rollNo})</div>
                </div>
                <div>
                  <span className="ticket-field-label">Date:</span>
                  <div className="ticket-field-val">{activeTicket.eventDate}</div>
                </div>
                <div>
                  <span className="ticket-field-label">Location:</span>
                  <div className="ticket-field-val">{activeTicket.location}</div>
                </div>
                <div>
                  <span className="ticket-field-label">Booked:</span>
                  <div className="ticket-field-val">{activeTicket.registeredDate}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTicket(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
