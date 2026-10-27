import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Users,
  MapPin,
  Clock,
  Mail,
  UserCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const ClubsView = ({ initialSelectedClub, onClearSelectedClub }) => {
  const { clubs, membershipRequests, currentUser, submitMembershipRequest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeDetailsClub, setActiveDetailsClub] = useState(null);
  const [activeJoinClub, setActiveJoinClub] = useState(null);

  // Clear initial selection after opening to avoid reopening on tab revisit
  useEffect(() => {
    if (initialSelectedClub) {
      setActiveDetailsClub(initialSelectedClub);
      if (onClearSelectedClub) onClearSelectedClub();
    }
  }, [initialSelectedClub, onClearSelectedClub]);

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

    // Pre-flight client duplicate check
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
          <Search size={15} />
          <input
            type="text"
            className="search-input"
            placeholder="Search clubs by name, description, coordinator, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills" role="radiogroup" aria-label="Club categories">
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

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="empty-state">
          <Users size={28} className="empty-icon" />
          <div className="empty-title">No clubs found</div>
          <div className="empty-desc">
            No student clubs matched your search criteria. Try a different query or select "All".
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
          {filteredClubs.map((club) => {
            const userRequest = getStudentRequestForClub(club.id);

            return (
              <div key={club.id} className="card club-card">
                <div className="card-header">
                  <div className="card-top-row">
                    <span className="tag-pill">{club.category}</span>
                    {userRequest && (
                      <span className={`badge badge-${userRequest.status.toLowerCase()}`}>
                        {userRequest.status}
                      </span>
                    )}
                  </div>
                  <h3 className="card-title">{club.name}</h3>
                </div>

                <div className="card-body">
                  <p className="card-desc">{club.description}</p>

                  <div className="info-list">
                    <div className="info-item">
                      <UserCheck size={13} />
                      <span><strong>Lead:</strong> {club.coordinator}</span>
                    </div>
                    <div className="info-item">
                      <Mail size={13} />
                      <span>{club.email}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={13} />
                      <span>{club.location}</span>
                    </div>
                    <div className="info-item">
                      <Clock size={13} />
                      <span>{club.meetingSchedule}</span>
                    </div>
                  </div>

                  <div className="tag-list">
                    {club.tags.map((tag) => (
                      <span key={tag} className="tag-subtle">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  <span className="text-muted" style={{ fontSize: '12px' }}>
                    {club.memberCount} Members
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveDetailsClub(club)}
                    >
                      Details
                    </button>

                    {userRequest ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveDetailsClub(club)}
                        title={`Status: ${userRequest.status}`}
                      >
                        {userRequest.status === 'Approved'
                          ? 'Member ✓'
                          : userRequest.status === 'Pending'
                          ? 'Pending'
                          : 'Status'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenJoinModal(club)}
                      >
                        <Send size={12} />
                        Join
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
        subtitle={`Category: ${activeDetailsClub?.category || ''}`}
        maxWidth="580px"
      >
        {activeDetailsClub && (
          <div>
            {(() => {
              const req = getStudentRequestForClub(activeDetailsClub.id);
              if (!req) return null;

              return (
                <div className={`alert-box ${req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'error'}`}>
                  <div>
                    <strong>Membership Status: {req.status}</strong>
                    <p style={{ marginTop: '2px', fontSize: '12px' }}>
                      {req.status === 'Approved' && 'You are an approved active member.'}
                      {req.status === 'Pending' && `Submitted on ${req.appliedDate}. Awaiting coordinator review.`}
                      {req.status === 'Rejected' && 'Application not approved for this semester.'}
                    </p>
                    {req.reviewNotes && (
                      <p style={{ marginTop: '4px', fontSize: '11px', fontStyle: 'italic' }}>
                        Note: "{req.reviewNotes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Description
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-main)' }}>
                {activeDetailsClub.description}
              </p>
            </div>

            <div className="details-box">
              <div className="details-row">
                <span className="details-label">Coordinator:</span>
                <span className="details-val">{activeDetailsClub.coordinator}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Contact Email:</span>
                <span className="details-val">{activeDetailsClub.email}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Location:</span>
                <span className="details-val">{activeDetailsClub.location}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Regular Schedule:</span>
                <span className="details-val">{activeDetailsClub.meetingSchedule}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Member Count:</span>
                <span className="details-val">{activeDetailsClub.memberCount} students (Est. {activeDetailsClub.established})</span>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveDetailsClub(null)}
              >
                Close
              </button>
              {!getStudentRequestForClub(activeDetailsClub.id) && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const c = activeDetailsClub;
                    setActiveDetailsClub(null);
                    handleOpenJoinModal(c);
                  }}
                >
                  <Send size={13} /> Apply to Join
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Join Club Membership Request Modal */}
      <Modal
        isOpen={!!activeJoinClub}
        onClose={() => setActiveJoinClub(null)}
        title={`Apply to Join: ${activeJoinClub?.name || ''}`}
        subtitle="Submit student information for coordinator review"
      >
        {activeJoinClub && (
          <form onSubmit={handleJoinSubmit}>
            {formError && (
              <div className="alert-box error" role="alert">
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Error:</strong> {formError}
                </div>
              </div>
            )}

            <div className="alert-box info">
              <HelpCircle size={15} style={{ flexShrink: 0 }} />
              <div>
                Applications are reviewed by the club coordinator. Only one application per student is permitted.
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
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rollNo">
                  Roll Number <span className="required-star">*</span>
                </label>
                <input
                  id="rollNo"
                  type="text"
                  className="form-input"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
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
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department <span className="required-star">*</span>
                </label>
                <input
                  id="department"
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                Reason for Joining <span className="required-star">*</span>
              </label>
              <textarea
                id="reason"
                className="form-textarea"
                rows="3"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain your interest and what you hope to contribute (min 15 characters)..."
                required
              />
              <span className="form-helper">
                {formData.reason.length} / 15 minimum characters
              </span>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveJoinClub(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={13} />
                Submit Application
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
