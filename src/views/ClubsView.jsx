import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Users2,
  MapPin,
  Clock,
  Mail,
  UserCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const ClubsView = ({ initialSelectedClub }) => {
  const { clubs, membershipRequests, currentUser, submitMembershipRequest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeDetailsClub, setActiveDetailsClub] = useState(initialSelectedClub || null);
  const [activeJoinClub, setActiveJoinClub] = useState(null);

  // Form State for Join Request
  const [formData, setFormData] = useState({
    studentName: currentUser.name,
    rollNo: currentUser.rollNo,
    email: currentUser.email,
    department: currentUser.department,
    year: currentUser.year,
    reason: ''
  });
  const [formError, setFormError] = useState('');

  // Extract unique categories
  const categories = ['All', ...new Set(clubs.map((c) => c.category))];

  // Filter clubs by category and search term
  const filteredClubs = clubs.filter((club) => {
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.coordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Helper to find student's request status for a club
  const getStudentRequestForClub = (clubId) => {
    return membershipRequests.find(
      (req) =>
        req.clubId === clubId &&
        (req.rollNo.toUpperCase() === currentUser.rollNo.toUpperCase() ||
          req.email.toLowerCase() === currentUser.email.toLowerCase())
    );
  };

  const handleOpenJoinModal = (club) => {
    setFormError('');
    setFormData({
      studentName: currentUser.name,
      rollNo: currentUser.rollNo,
      email: currentUser.email,
      department: currentUser.department,
      year: currentUser.year,
      reason: ''
    });
    setActiveJoinClub(club);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Pre-flight client duplicate check for instant UI response
    const existing = getStudentRequestForClub(activeJoinClub.id);
    if (existing) {
      if (existing.status === 'Approved') {
        setFormError(`Duplicate Request: You are already an approved member of ${activeJoinClub.name}.`);
        return;
      }
      if (existing.status === 'Pending') {
        setFormError(`Duplicate Request: You already have a pending application for ${activeJoinClub.name} submitted on ${existing.appliedDate}.`);
        return;
      }
      if (existing.status === 'Rejected') {
        setFormError(`Duplicate Request: Your previous membership application was rejected by the coordinator.`);
        return;
      }
    }

    const res = submitMembershipRequest({
      clubId: activeJoinClub.id,
      studentName: formData.studentName,
      rollNo: formData.rollNo,
      email: formData.email,
      department: formData.department,
      year: formData.year,
      reason: formData.reason
    });

    if (res.success) {
      setActiveJoinClub(null);
    } else {
      setFormError(res.error || 'Failed to submit membership request.');
    }
  };

  return (
    <div className="clubs-view">
      {/* Search and Category Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search clubs by name, description, coordinator, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills" role="radiogroup" aria-label="Club categories">
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

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Users2 size={28} />
          </div>
          <div className="empty-title">No clubs match your search</div>
          <div className="empty-desc">
            Try adjusting your search query or select "All" to view all university student clubs.
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
          {filteredClubs.map((club) => {
            const userRequest = getStudentRequestForClub(club.id);

            return (
              <div key={club.id} className="club-card">
                <div className="club-card-header">
                  <div className="club-header-top">
                    <span className="club-category-badge">{club.category}</span>
                    {userRequest && (
                      <span className={`badge badge-${userRequest.status.toLowerCase()}`}>
                        {userRequest.status === 'Approved' && <CheckCircle2 size={12} />}
                        {userRequest.status === 'Pending' && <Clock size={12} />}
                        {userRequest.status === 'Rejected' && <XCircle size={12} />}
                        {userRequest.status}
                      </span>
                    )}
                  </div>
                  <h3 className="club-title">{club.name}</h3>
                </div>

                <div className="club-card-body">
                  <p className="club-description">{club.description}</p>

                  <div className="club-metadata">
                    <div className="meta-row">
                      <UserCheck size={14} />
                      <span>
                        <strong>Coordinator:</strong> {club.coordinator}
                      </span>
                    </div>
                    <div className="meta-row">
                      <Mail size={14} />
                      <span>
                        <strong>Email:</strong> {club.email}
                      </span>
                    </div>
                    <div className="meta-row">
                      <MapPin size={14} />
                      <span>{club.location}</span>
                    </div>
                    <div className="meta-row">
                      <Clock size={14} />
                      <span>{club.meetingSchedule}</span>
                    </div>
                  </div>

                  <div className="club-tags">
                    {club.tags.map((tag) => (
                      <span key={tag} className="club-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="club-card-footer">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    <strong>{club.memberCount}</strong> Active Members
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveDetailsClub(club)}
                    >
                      Details
                    </button>

                    {userRequest ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveDetailsClub(club)}
                        title={`Status: ${userRequest.status}`}
                      >
                        {userRequest.status === 'Approved'
                          ? 'Member ✓'
                          : userRequest.status === 'Pending'
                          ? 'Pending ⏳'
                          : 'Status'}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenJoinModal(club)}
                      >
                        <Send size={13} />
                        Join Club
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Club Details Modal */}
      <Modal
        isOpen={!!activeDetailsClub}
        onClose={() => setActiveDetailsClub(null)}
        title={activeDetailsClub?.name || 'Club Details'}
        subtitle={`Organized under ${activeDetailsClub?.category} Council`}
        maxWidth="600px"
      >
        {activeDetailsClub && (
          <div>
            {/* If user has an existing request, show official status alert banner */}
            {(() => {
              const req = getStudentRequestForClub(activeDetailsClub.id);
              if (!req) return null;

              if (req.status === 'Approved') {
                return (
                  <div className="alert-box success">
                    <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Official Membership Status: Approved</strong>
                      <p style={{ marginTop: '2px', fontSize: '12px' }}>
                        You are an active student member of {activeDetailsClub.name}. Regular attendance in weekly meetings is expected.
                      </p>
                      {req.reviewNotes && (
                        <p style={{ marginTop: '4px', fontSize: '11px', fontStyle: 'italic', opacity: 0.9 }}>
                          Coordinator Note: "{req.reviewNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
              if (req.status === 'Pending') {
                return (
                  <div className="alert-box warning">
                    <Clock size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Application Status: Pending Review</strong>
                      <p style={{ marginTop: '2px', fontSize: '12px' }}>
                        Your application submitted on {req.appliedDate} is currently in the queue for coordinator review.
                      </p>
                      {req.reviewNotes && (
                        <p style={{ marginTop: '4px', fontSize: '11px', fontStyle: 'italic', opacity: 0.9 }}>
                          Note: "{req.reviewNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
              if (req.status === 'Rejected') {
                return (
                  <div className="alert-box error">
                    <XCircle size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Application Status: Rejected</strong>
                      <p style={{ marginTop: '2px', fontSize: '12px' }}>
                        Your membership application was not approved for this semester term.
                      </p>
                      {req.reviewNotes && (
                        <p style={{ marginTop: '4px', fontSize: '11px', fontStyle: 'italic' }}>
                          Reason: "{req.reviewNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            })()}

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                About the Society
              </h4>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-main)' }}>
                {activeDetailsClub.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty & Student Leads</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{activeDetailsClub.coordinator}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Official Contact</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{activeDetailsClub.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Meeting Location</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{activeDetailsClub.location}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Regular Timing</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{activeDetailsClub.meetingSchedule}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Established {activeDetailsClub.established} • {activeDetailsClub.memberCount} members
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setActiveDetailsClub(null)}>
                  Close
                </button>
                {!getStudentRequestForClub(activeDetailsClub.id) && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const c = activeDetailsClub;
                      setActiveDetailsClub(null);
                      handleOpenJoinModal(c);
                    }}
                  >
                    <Send size={14} /> Apply for Membership
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Join Club Membership Request Modal */}
      <Modal
        isOpen={!!activeJoinClub}
        onClose={() => setActiveJoinClub(null)}
        title={`Membership Application: ${activeJoinClub?.name || ''}`}
        subtitle="Submit student credentials and statement of interest for coordinator review"
      >
        {activeJoinClub && (
          <form onSubmit={handleJoinSubmit}>
            {formError && (
              <div className="alert-box error" role="alert">
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Submission Blocked</strong>
                  <div style={{ marginTop: '2px' }}>{formError}</div>
                </div>
              </div>
            )}

            <div className="alert-box info">
              <HelpCircle size={16} style={{ flexShrink: 0 }} />
              <div>
                Applications are reviewed by <strong>{activeJoinClub.coordinator.split('&')[0]}</strong>. Duplicate applications under the same roll number or email are rejected automatically.
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="studentName">
                  Student Name <span className="required-star">*</span>
                </label>
                <input
                  id="studentName"
                  type="text"
                  className="form-input"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rollNo">
                  University Roll No <span className="required-star">*</span>
                </label>
                <input
                  id="rollNo"
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
              <label className="form-label" htmlFor="email">
                Institutional Email <span className="required-star">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. student@apex.edu"
                required
              />
              <span className="form-helper">Must be a valid email format</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department / Branch <span className="required-star">*</span>
                </label>
                <input
                  id="department"
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="year">
                  Academic Year <span className="required-star">*</span>
                </label>
                <select
                  id="year"
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

            <div className="form-group">
              <label className="form-label" htmlFor="reason">
                Statement of Interest / Reason to Join <span className="required-star">*</span>
              </label>
              <textarea
                id="reason"
                className="form-textarea"
                rows="3"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Describe your background, skills, and what you hope to contribute to this society (minimum 15 characters)..."
                required
              />
              <span className="form-helper">
                {formData.reason.length} / 15 minimum characters required
              </span>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveJoinClub(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={15} />
                Submit Application
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
