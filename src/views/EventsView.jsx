import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  CheckCircle2,
  AlertTriangle,
  Ticket,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const EventsView = ({ initialSelectedEvent, onNavigateToRegistrations }) => {
  const { events, eventRegistrations, currentUser, registerForEvent } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRegisterEvent, setActiveRegisterEvent] = useState(initialSelectedEvent || null);
  const [activeDetailsEvent, setActiveDetailsEvent] = useState(null);
  const [confirmationTicket, setConfirmationTicket] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    studentName: currentUser.name,
    rollNo: currentUser.rollNo,
    email: currentUser.email,
    department: currentUser.department,
    year: currentUser.year
  });
  const [formError, setFormError] = useState('');

  // Extract categories
  const categories = ['All', ...new Set(events.map((e) => e.category))];

  // Filtering
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check if current user is already registered for this event
  const isUserRegisteredFor = (eventId) => {
    return eventRegistrations.find(
      (r) =>
        r.eventId === eventId &&
        (r.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase() ||
          r.email.toLowerCase() === currentUser.email.toLowerCase())
    );
  };

  const handleOpenRegisterModal = (event) => {
    setFormError('');
    setFormData({
      studentName: currentUser.name,
      rollNo: currentUser.rollNo,
      email: currentUser.email,
      department: currentUser.department,
      year: currentUser.year
    });
    setActiveRegisterEvent(event);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Pre-flight check: Event Full
    if (activeRegisterEvent.availableSeats <= 0) {
      setFormError(`Capacity Error: "${activeRegisterEvent.title}" is already full (0 seats remaining). Registration cannot proceed.`);
      return;
    }

    // Pre-flight check: Duplicate
    const existing = isUserRegisteredFor(activeRegisterEvent.id);
    if (existing) {
      setFormError(`Duplicate Registration: You have already secured a registration for this event (Ticket Pass: ${existing.ticketCode}).`);
      return;
    }

    const res = registerForEvent({
      eventId: activeRegisterEvent.id,
      studentName: formData.studentName,
      rollNo: formData.rollNo,
      email: formData.email,
      department: formData.department,
      year: formData.year
    });

    if (res.success) {
      const savedTicket = res.registration;
      setActiveRegisterEvent(null);
      setConfirmationTicket(savedTicket);
    } else {
      setFormError(res.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="events-view">
      {/* Search and Category Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search events by title, organizing club, location, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills" role="radiogroup" aria-label="Event categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Calendar size={28} />
          </div>
          <div className="empty-title">No events found matching your criteria</div>
          <div className="empty-desc">
            Try resetting your search query or switching the category filter to "All".
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredEvents.map((event) => {
            const userRegistration = isUserRegisteredFor(event.id);
            const isFull = event.availableSeats === 0;
            const percentageBooked = Math.round(
              ((event.totalCapacity - event.availableSeats) / event.totalCapacity) * 100
            );

            let progressColor = 'green';
            if (isFull) progressColor = 'red';
            else if (event.availableSeats <= 5) progressColor = 'amber';

            return (
              <div key={event.id} className="event-card">
                <div className={`event-banner-stripe ${isFull ? 'full' : ''}`} />

                <div className="event-card-header">
                  <div className="event-top-info">
                    <span className="event-club-badge">
                      <Building size={13} style={{ color: '#2563eb' }} />
                      {event.clubName.split(' ')[0]} {event.clubName.split(' ')[1]}
                    </span>
                    {userRegistration ? (
                      <span className="badge badge-approved">Registered ✓</span>
                    ) : isFull ? (
                      <span className="badge badge-full">House Full</span>
                    ) : event.availableSeats <= 3 ? (
                      <span className="badge badge-warning">Only {event.availableSeats} Left</span>
                    ) : (
                      <span className="badge badge-open">{event.availableSeats} Available</span>
                    )}
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                </div>

                <div className="event-card-body">
                  <p className="event-description">{event.description}</p>

                  <div className="event-details-grid">
                    <div className="meta-row">
                      <Calendar size={14} style={{ color: '#2563eb' }} />
                      <span>
                        <strong>Date:</strong> {event.date}
                      </span>
                    </div>
                    <div className="meta-row">
                      <Clock size={14} style={{ color: '#059669' }} />
                      <span>
                        <strong>Time:</strong> {event.time}
                      </span>
                    </div>
                    <div className="meta-row">
                      <MapPin size={14} style={{ color: '#dc2626' }} />
                      <span>
                        <strong>Venue:</strong> {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Seat Availability Meter */}
                  <div className="seat-status-container">
                    <div className="seat-status-header">
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} />
                        Seats: {event.registeredCount} / {event.totalCapacity} ({percentageBooked}%)
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isFull ? '#ef4444' : event.availableSeats <= 3 ? '#d97706' : '#059669'
                        }}
                      >
                        {isFull ? '0 Seats Left' : `${event.availableSeats} Remaining`}
                      </span>
                    </div>
                    <div className="seat-progress-track">
                      <div
                        className={`seat-progress-fill ${progressColor}`}
                        style={{ width: `${percentageBooked}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="event-card-footer">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveDetailsEvent(event)}
                  >
                    Details
                  </button>

                  {userRegistration ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setConfirmationTicket(userRegistration)}
                      title="View your registered ticket pass"
                    >
                      <Ticket size={13} />
                      View Pass
                    </button>
                  ) : (
                    <button
                      className={`btn btn-sm ${isFull ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={isFull}
                      onClick={() => handleOpenRegisterModal(event)}
                      title={isFull ? 'Event is full' : 'Register for this event'}
                    >
                      {isFull ? 'Full (0 Seats)' : 'Register Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      <Modal
        isOpen={!!activeDetailsEvent}
        onClose={() => setActiveDetailsEvent(null)}
        title={activeDetailsEvent?.title || 'Event Details'}
        subtitle={`Organized by ${activeDetailsEvent?.clubName}`}
        maxWidth="600px"
      >
        {activeDetailsEvent && (
          <div>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  {activeDetailsEvent.category}
                </span>
                {activeDetailsEvent.availableSeats === 0 ? (
                  <span className="badge badge-full">Full (0 Seats Available)</span>
                ) : (
                  <span className="badge badge-open">{activeDetailsEvent.availableSeats} Seats Left</span>
                )}
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-main)' }}>
                {activeDetailsEvent.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date & Schedule</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeDetailsEvent.date} ({activeDetailsEvent.time})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campus Venue</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeDetailsEvent.location}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacity Breakdown</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeDetailsEvent.registeredCount} Registered / {activeDetailsEvent.totalCapacity} Total
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Eligibility</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeDetailsEvent.eligibility}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveDetailsEvent(null)}>
                Close
              </button>
              {!isUserRegisteredFor(activeDetailsEvent.id) && (
                <button
                  className="btn btn-primary"
                  disabled={activeDetailsEvent.availableSeats === 0}
                  onClick={() => {
                    const evt = activeDetailsEvent;
                    setActiveDetailsEvent(null);
                    handleOpenRegisterModal(evt);
                  }}
                >
                  {activeDetailsEvent.availableSeats === 0 ? 'Event is Full' : 'Register for Event'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Register For Event Modal */}
      <Modal
        isOpen={!!activeRegisterEvent}
        onClose={() => setActiveRegisterEvent(null)}
        title={`Register: ${activeRegisterEvent?.title || ''}`}
        subtitle={`Seats Remaining: ${activeRegisterEvent?.availableSeats || 0} of ${activeRegisterEvent?.totalCapacity || 0}`}
      >
        {activeRegisterEvent && (
          <form onSubmit={handleRegisterSubmit}>
            {formError && (
              <div className="alert-box error" role="alert">
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Registration Error</strong>
                  <div style={{ marginTop: '2px' }}>{formError}</div>
                </div>
              </div>
            )}

            {activeRegisterEvent.availableSeats <= 0 && (
              <div className="alert-box error">
                <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Event is House Full!</strong>
                  <div>There are 0 available seats remaining. No further registrations can be processed.</div>
                </div>
              </div>
            )}

            <div className="alert-box info">
              <Calendar size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Event Date:</strong> {activeRegisterEvent.date} ({activeRegisterEvent.time}) at {activeRegisterEvent.location}. Registration pass will be generated upon confirmation.
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="regName">
                  Student Name <span className="required-star">*</span>
                </label>
                <input
                  id="regName"
                  type="text"
                  className="form-input"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regRoll">
                  University Roll No <span className="required-star">*</span>
                </label>
                <input
                  id="regRoll"
                  type="text"
                  className="form-input"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="e.g. 2024CS104"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">
                Student Email <span className="required-star">*</span>
              </label>
              <input
                id="regEmail"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. student@apex.edu"
                required
              />
              <span className="form-helper">Ticket confirmation and pass will be sent here</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="regDept">
                  Department / Major <span className="required-star">*</span>
                </label>
                <input
                  id="regDept"
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regYear">
                  Current Year <span className="required-star">*</span>
                </label>
                <select
                  id="regYear"
                  className="form-select"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
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
                onClick={() => setActiveRegisterEvent(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={activeRegisterEvent.availableSeats <= 0}
              >
                <CheckCircle2 size={15} />
                Confirm Registration
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Registration Confirmation Ticket Modal */}
      <Modal
        isOpen={!!confirmationTicket}
        onClose={() => setConfirmationTicket(null)}
        title="Official Event Pass Confirmed"
        subtitle="Save or screenshot your university admission pass"
        maxWidth="520px"
      >
        {confirmationTicket && (
          <div>
            <div className="ticket-card">
              <div className="ticket-header">
                <div>
                  <div className="ticket-brand">Apex University • Event Pass</div>
                  <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '2px' }}>
                    {confirmationTicket.clubName}
                  </div>
                </div>
                <div className="ticket-code">{confirmationTicket.ticketCode}</div>
              </div>

              <h4 className="ticket-title">{confirmationTicket.eventTitle}</h4>

              <div className="ticket-details">
                <div className="ticket-detail-item">
                  <div className="lbl">Attendee Name</div>
                  <div className="val">{confirmationTicket.studentName}</div>
                </div>
                <div className="ticket-detail-item">
                  <div className="lbl">Roll Number</div>
                  <div className="val">{confirmationTicket.rollNo}</div>
                </div>
                <div className="ticket-detail-item">
                  <div className="lbl">Scheduled Date</div>
                  <div className="val">{confirmationTicket.eventDate}</div>
                </div>
                <div className="ticket-detail-item">
                  <div className="lbl">Venue</div>
                  <div className="val">{confirmationTicket.location}</div>
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
                <span>Status: Confirmed & Reserved</span>
                <span>Registered: {confirmationTicket.registeredDate}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setConfirmationTicket(null);
                  if (onNavigateToRegistrations) onNavigateToRegistrations();
                }}
              >
                View in My Activities <ArrowRight size={14} />
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setConfirmationTicket(null)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
