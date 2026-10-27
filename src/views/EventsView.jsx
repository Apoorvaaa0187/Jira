import React, { useState, useEffect } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const EventsView = ({ initialSelectedEvent, onClearSelectedEvent, onNavigateToRegistrations }) => {
  const { events, eventRegistrations, currentUser, registerForEvent } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRegisterEvent, setActiveRegisterEvent] = useState(null);
  const [activeDetailsEvent, setActiveDetailsEvent] = useState(null);
  const [confirmationTicket, setConfirmationTicket] = useState(null);

  // Clear initial selection after opening to avoid reopening on tab revisit
  useEffect(() => {
    if (initialSelectedEvent) {
      handleOpenRegisterModal(initialSelectedEvent);
      if (onClearSelectedEvent) onClearSelectedEvent();
    }
  }, [initialSelectedEvent, onClearSelectedEvent]);

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
      setFormError(`Capacity Error: "${activeRegisterEvent.title}" is already full (0 seats remaining).`);
      return;
    }

    // Pre-flight check: Duplicate
    const existing = isUserRegisteredFor(activeRegisterEvent.id);
    if (existing) {
      setFormError(`Duplicate Registration: You already registered for this event (Ticket: ${existing.ticketCode}).`);
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
          <Search size={15} />
          <input
            type="text"
            className="search-input"
            placeholder="Search events by title, club, location, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills" role="radiogroup" aria-label="Event categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
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
          <Calendar size={28} className="empty-icon" />
          <div className="empty-title">No events found</div>
          <div className="empty-desc">
            No campus events matched your search. Try adjusting the query or select "All".
          </div>
          <button
            type="button"
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

            return (
              <div key={event.id} className="card event-card">
                <div className="card-header">
                  <div className="card-top-row">
                    <span className="tag-pill">
                      <Building size={11} style={{ marginRight: '4px', display: 'inline' }} />
                      {event.clubName.split(' ')[0]} {event.clubName.split(' ')[1]}
                    </span>
                    {userRegistration ? (
                      <span className="badge badge-approved">Registered ✓</span>
                    ) : isFull ? (
                      <span className="badge badge-full">Full</span>
                    ) : event.availableSeats <= 3 ? (
                      <span className="badge badge-warning">{event.availableSeats} left</span>
                    ) : (
                      <span className="badge badge-open">{event.availableSeats} open</span>
                    )}
                  </div>
                  <h3 className="card-title">{event.title}</h3>
                </div>

                <div className="card-body">
                  <p className="card-desc">{event.description}</p>

                  <div className="info-list">
                    <div className="info-item">
                      <Calendar size={13} />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={13} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Clean Seat Meter */}
                  <div className="seat-meter">
                    <div className="seat-meter-header">
                      <span>Seats: {event.registeredCount} / {event.totalCapacity} ({percentageBooked}%)</span>
                      <span className={isFull ? 'text-danger' : event.availableSeats <= 3 ? 'text-warning' : 'text-success'}>
                        {isFull ? '0 Remaining' : `${event.availableSeats} Available`}
                      </span>
                    </div>
                    <div className="seat-meter-bar">
                      <div
                        className={`seat-meter-fill ${isFull ? 'fill-danger' : event.availableSeats <= 3 ? 'fill-warning' : 'fill-primary'}`}
                        style={{ width: `${percentageBooked}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveDetailsEvent(event)}
                  >
                    Details
                  </button>

                  {userRegistration ? (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setConfirmationTicket(userRegistration)}
                      title="View registration pass"
                    >
                      <Ticket size={13} />
                      View Pass
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`btn btn-sm ${isFull ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={isFull}
                      onClick={() => handleOpenRegisterModal(event)}
                    >
                      {isFull ? 'Full' : 'Register'}
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
        subtitle={`Organized by ${activeDetailsEvent?.clubName || ''}`}
        maxWidth="580px"
      >
        {activeDetailsEvent && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <span className="tag-pill">{activeDetailsEvent.category}</span>
                {activeDetailsEvent.availableSeats === 0 ? (
                  <span className="badge badge-full">Full (0 Seats Available)</span>
                ) : (
                  <span className="badge badge-open">{activeDetailsEvent.availableSeats} Seats Available</span>
                )}
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-main)' }}>
                {activeDetailsEvent.description}
              </p>
            </div>

            <div className="details-box">
              <div className="details-row">
                <span className="details-label">Date & Time:</span>
                <span className="details-val">{activeDetailsEvent.date} ({activeDetailsEvent.time})</span>
              </div>
              <div className="details-row">
                <span className="details-label">Location:</span>
                <span className="details-val">{activeDetailsEvent.location}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Capacity:</span>
                <span className="details-val">{activeDetailsEvent.registeredCount} booked of {activeDetailsEvent.totalCapacity} total</span>
              </div>
              <div className="details-row">
                <span className="details-label">Eligibility:</span>
                <span className="details-val">{activeDetailsEvent.eligibility}</span>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveDetailsEvent(null)}
              >
                Close
              </button>
              {!isUserRegisteredFor(activeDetailsEvent.id) && (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={activeDetailsEvent.availableSeats === 0}
                  onClick={() => {
                    const evt = activeDetailsEvent;
                    setActiveDetailsEvent(null);
                    handleOpenRegisterModal(evt);
                  }}
                >
                  {activeDetailsEvent.availableSeats === 0 ? 'Event is Full' : 'Register Now'}
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
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Error:</strong> {formError}
                </div>
              </div>
            )}

            {activeRegisterEvent.availableSeats <= 0 && (
              <div className="alert-box error">
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Event is Full.</strong> No seats remaining for registration.
                </div>
              </div>
            )}

            <div className="alert-box info">
              <Calendar size={15} style={{ flexShrink: 0 }} />
              <div>
                <strong>Event:</strong> {activeRegisterEvent.date} ({activeRegisterEvent.time}) at {activeRegisterEvent.location}.
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
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regRoll">
                  Roll Number <span className="required-star">*</span>
                </label>
                <input
                  id="regRoll"
                  type="text"
                  className="form-input"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="regEmail"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="regDept">
                  Department <span className="required-star">*</span>
                </label>
                <input
                  id="regDept"
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="regYear">
                  Year of Study <span className="required-star">*</span>
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

            <div className="modal-footer">
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
                <CheckCircle2 size={14} />
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
        title="Event Registration Pass"
        subtitle="Registration confirmed and recorded in local system"
        maxWidth="500px"
      >
        {confirmationTicket && (
          <div>
            <div className="ticket-card-simple">
              <div className="ticket-top">
                <span className="ticket-org">{confirmationTicket.clubName}</span>
                <span className="ticket-code-badge">{confirmationTicket.ticketCode}</span>
              </div>

              <h4 className="ticket-event-title">{confirmationTicket.eventTitle}</h4>

              <div className="ticket-grid">
                <div>
                  <span className="ticket-field-label">Student:</span>
                  <div className="ticket-field-val">{confirmationTicket.studentName} ({confirmationTicket.rollNo})</div>
                </div>
                <div>
                  <span className="ticket-field-label">Date:</span>
                  <div className="ticket-field-val">{confirmationTicket.eventDate}</div>
                </div>
                <div>
                  <span className="ticket-field-label">Venue:</span>
                  <div className="ticket-field-val">{confirmationTicket.location}</div>
                </div>
                <div>
                  <span className="ticket-field-label">Registered:</span>
                  <div className="ticket-field-val">{confirmationTicket.registeredDate}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setConfirmationTicket(null);
                  if (onNavigateToRegistrations) onNavigateToRegistrations();
                }}
              >
                View My Activities <ArrowRight size={13} />
              </button>
              <button
                type="button"
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
