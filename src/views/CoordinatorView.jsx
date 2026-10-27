import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Plus,
  Users,
  Ticket,
  MapPin,
  Building,
  Info
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const CoordinatorView = () => {
  const {
    membershipRequests,
    updateMembershipStatus,
    clubs,
    events,
    eventRegistrations,
    currentUser,
    createEvent
  } = useApp();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'events' | 'overview'

  // Request review state
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  // Event creation modal state
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    clubId: currentUser.assignedClubId || clubs[0]?.id || '',
    category: 'Technology',
    date: '',
    time: '02:00 PM - 05:00 PM',
    location: '',
    totalCapacity: 50,
    description: '',
    eligibility: 'Open to all university students'
  });
  const [createEventError, setCreateEventError] = useState('');

  // Attendee roster modal state
  const [selectedEventForRoster, setSelectedEventForRoster] = useState(null);

  // Managed club
  const managedClub = clubs.find((c) => c.id === currentUser.assignedClubId) || clubs[0];

  // Filter requests
  const filteredRequests = membershipRequests.filter((req) => {
    // If coordinator is assigned to a specific club, default to showing their club or all
    const matchesClub = currentUser.assignedClubId ? req.clubId === currentUser.assignedClubId : true;
    const matchesFilter = statusFilter === 'All' || req.status === statusFilter;
    const matchesSearch =
      req.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClub && matchesFilter && matchesSearch;
  });

  // Events belonging to this club
  const clubEvents = events.filter((e) =>
    currentUser.assignedClubId ? e.clubId === currentUser.assignedClubId : true
  );

  const handleOpenReviewModal = (req, action) => {
    setSelectedRequest(req);
    setReviewAction(action);
    setReviewNote(
      action === 'Approve'
        ? 'Application approved by Club Coordinator.'
        : 'Application rejected due to membership capacity limit.'
    );
  };

  const handleConfirmReview = (e) => {
    e.preventDefault();
    if (!selectedRequest || !reviewAction) return;

    updateMembershipStatus(
      selectedRequest.id,
      reviewAction === 'Approve' ? 'Approved' : 'Rejected',
      reviewNote
    );

    setSelectedRequest(null);
    setReviewAction(null);
    setReviewNote('');
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    setCreateEventError('');

    const res = createEvent({
      ...newEventData,
      clubId: managedClub?.id || newEventData.clubId
    });

    if (res.success) {
      setIsCreateEventModalOpen(false);
      setNewEventData({
        title: '',
        clubId: managedClub?.id || clubs[0]?.id || '',
        category: 'Technology',
        date: '',
        time: '02:00 PM - 05:00 PM',
        location: '',
        totalCapacity: 50,
        description: '',
        eligibility: 'Open to all university students'
      });
    } else {
      setCreateEventError(res.error || 'Failed to create event.');
    }
  };

  const pendingCount = membershipRequests.filter(
    (r) => (currentUser.assignedClubId ? r.clubId === currentUser.assignedClubId : true) && r.status === 'Pending'
  ).length;

  return (
    <div className="coordinator-view">
      {/* Club Context Banner */}
      <div className="filter-bar" style={{ backgroundColor: 'var(--bg-subtle)', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
            Active Coordinator Portal
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {managedClub ? managedClub.name : 'University Society Coordinator'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsCreateEventModalOpen(true)}
          >
            <Plus size={14} /> New Event
          </button>
        </div>
      </div>

      {/* Coordinator Sub-tabs */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <Clock size={15} />
          <span>Membership Applications</span>
          {pendingCount > 0 && <span className="tab-count-badge">{pendingCount}</span>}
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={15} />
          <span>Club Events & Rosters</span>
          <span className="tab-count-badge">{clubEvents.length}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Building size={15} />
          <span>Club Profile</span>
        </button>
      </div>

      {/* TAB 1: MEMBERSHIP APPLICATIONS */}
      {activeTab === 'requests' && (
        <div>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search applicant name, roll number, or statement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-pills" role="radiogroup" aria-label="Status filters">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`category-pill ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <Clock size={28} className="empty-icon" />
              <div className="empty-title">No Applications Found</div>
              <div className="empty-desc">
                No student membership requests match filter <strong>{statusFilter}</strong>.
              </div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="university-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Club</th>
                    <th>Dept & Year</th>
                    <th>Applied Date</th>
                    <th>Statement of Interest</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {req.studentName}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {req.rollNo} • {req.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{req.clubName}</div>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        <div>{req.department}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{req.year}</div>
                      </td>
                      <td className="text-muted" style={{ fontSize: '12px' }}>
                        {req.appliedDate}
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '12px', color: 'var(--text-main)' }}>
                        <div
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                          title={req.reason}
                        >
                          "{req.reason}"
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {req.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{ backgroundColor: '#059669', color: '#ffffff' }}
                              onClick={() => handleOpenReviewModal(req, 'Approve')}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleOpenReviewModal(req, 'Reject')}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '11px' }}>
                            Decided
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLUB EVENTS & ROSTERS */}
      {activeTab === 'events' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                Scheduled Events
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Manage capacities and inspect registered attendee passes
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCreateEventModalOpen(true)}
            >
              <Plus size={14} /> Create Event
            </button>
          </div>

          <div className="table-wrapper">
            <table className="university-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Schedule</th>
                  <th>Venue</th>
                  <th>Seats Booked</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Attendee Roster</th>
                </tr>
              </thead>
              <tbody>
                {clubEvents.map((evt) => {
                  const attendees = eventRegistrations.filter((r) => r.eventId === evt.id);
                  return (
                    <tr key={evt.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{evt.title}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{evt.category}</div>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        <div>{evt.date}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{evt.time}</div>
                      </td>
                      <td style={{ fontSize: '12px' }}>{evt.location}</td>
                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>
                          {evt.registeredCount} / {evt.totalCapacity}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {evt.availableSeats} remaining
                        </div>
                      </td>
                      <td>
                        {evt.availableSeats === 0 ? (
                          <span className="badge badge-full">Full</span>
                        ) : (
                          <span className="badge badge-open">Open</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedEventForRoster(evt)}
                        >
                          <Users size={12} /> View Roster ({attendees.length})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLUB PROFILE */}
      {activeTab === 'overview' && managedClub && (
        <div className="panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
            {managedClub.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {managedClub.description}
          </p>

          <div className="details-box">
            <div className="details-row">
              <span className="details-label">Faculty Coordinator:</span>
              <span className="details-val">{managedClub.coordinator}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Contact Email:</span>
              <span className="details-val">{managedClub.email}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Headquarters / Lab:</span>
              <span className="details-val">{managedClub.location}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Weekly Schedule:</span>
              <span className="details-val">{managedClub.meetingSchedule}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Official Membership:</span>
              <span className="details-val">{managedClub.memberCount} active students</span>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`${reviewAction} Application`}
        subtitle={`${selectedRequest?.studentName} (${selectedRequest?.rollNo}) for ${selectedRequest?.clubName}`}
      >
        {selectedRequest && (
          <form onSubmit={handleConfirmReview}>
            <div className={`alert-box ${reviewAction === 'Approve' ? 'success' : 'error'}`}>
              <div>
                <strong>Confirm Action: {reviewAction}</strong>
                <p style={{ marginTop: '2px', fontSize: '12px' }}>
                  Setting status to <strong>{reviewAction}</strong> will notify the student and update club records in real time.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '14px', padding: '10px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>Applicant Statement:</div>
              <div style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>"{selectedRequest.reason}"</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="coord-note">
                Coordinator Feedback Note
              </label>
              <textarea
                id="coord-note"
                className="form-textarea"
                rows="3"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Optional feedback note visible to the student..."
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${reviewAction === 'Approve' ? 'btn-primary' : 'btn-danger'}`}
                style={reviewAction === 'Approve' ? { backgroundColor: '#059669' } : {}}
              >
                Confirm {reviewAction}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        title="Create Campus Event"
        subtitle={`Publish new event under ${managedClub ? managedClub.name : 'University Society'}`}
      >
        <form onSubmit={handleCreateEventSubmit}>
          {createEventError && (
            <div className="alert-box error" role="alert">
              <div>{createEventError}</div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="evt-title">
              Event Title <span className="required-star">*</span>
            </label>
            <input
              id="evt-title"
              type="text"
              className="form-input"
              placeholder="e.g. Autonomous Robotics Hackathon 2026"
              value={newEventData.title}
              onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="evt-category">
                Category
              </label>
              <select
                id="evt-category"
                className="form-select"
                value={newEventData.category}
                onChange={(e) => setNewEventData({ ...newEventData, category: e.target.value })}
              >
                <option value="Technology">Technology</option>
                <option value="Oratory & Debate">Oratory & Debate</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Media & Design">Media & Design</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="evt-capacity">
                Total Seat Capacity <span className="required-star">*</span>
              </label>
              <input
                id="evt-capacity"
                type="number"
                min="1"
                className="form-input"
                value={newEventData.totalCapacity}
                onChange={(e) => setNewEventData({ ...newEventData, totalCapacity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="evt-date">
                Date <span className="required-star">*</span>
              </label>
              <input
                id="evt-date"
                type="date"
                className="form-input"
                value={newEventData.date}
                onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="evt-time">
                Time <span className="required-star">*</span>
              </label>
              <input
                id="evt-time"
                type="text"
                className="form-input"
                placeholder="e.g. 02:00 PM - 05:00 PM"
                value={newEventData.time}
                onChange={(e) => setNewEventData({ ...newEventData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="evt-location">
              Venue / Location <span className="required-star">*</span>
            </label>
            <input
              id="evt-location"
              type="text"
              className="form-input"
              placeholder="e.g. Tech Innovation Hub, Lab 3"
              value={newEventData.location}
              onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="evt-desc">
              Description
            </label>
            <textarea
              id="evt-desc"
              className="form-textarea"
              rows="3"
              placeholder="Describe event schedule, requirements, and topic..."
              value={newEventData.description}
              onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCreateEventModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Attendee Roster Modal */}
      <Modal
        isOpen={!!selectedEventForRoster}
        onClose={() => setSelectedEventForRoster(null)}
        title={`Registered Attendees: ${selectedEventForRoster?.title || ''}`}
        subtitle={`Capacity: ${selectedEventForRoster?.registeredCount || 0} / ${selectedEventForRoster?.totalCapacity || 0} registered`}
        maxWidth="640px"
      >
        {selectedEventForRoster && (
          <div>
            {(() => {
              const attendees = eventRegistrations.filter((r) => r.eventId === selectedEventForRoster.id);
              if (attendees.length === 0) {
                return (
                  <div className="empty-state" style={{ padding: '24px' }}>
                    <Users size={24} className="empty-icon" />
                    <div className="empty-title">No Students Registered Yet</div>
                    <div className="empty-desc">
                      No tickets have been booked for this event so far.
                    </div>
                  </div>
                );
              }
              return (
                <div className="table-wrapper">
                  <table className="university-table">
                    <thead>
                      <tr>
                        <th>Ticket Code</th>
                        <th>Student</th>
                        <th>Department</th>
                        <th>Booked At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((att) => (
                        <tr key={att.id}>
                          <td>
                            <span className="code-pill">{att.ticketCode}</span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{att.studentName}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{att.rollNo}</div>
                          </td>
                          <td style={{ fontSize: '12px' }}>{att.department}</td>
                          <td className="text-muted" style={{ fontSize: '11px' }}>{att.registeredDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            <div className="modal-footer" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedEventForRoster(null)}
              >
                Close Roster
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
