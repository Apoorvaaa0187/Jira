import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  User,
  Building,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const CoordinatorView = () => {
  const { membershipRequests, updateMembershipStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'Approve' | 'Reject'
  const [reviewNote, setReviewNote] = useState('');

  const filteredRequests = membershipRequests.filter((req) => {
    const matchesFilter = statusFilter === 'All' || req.status === statusFilter;
    const matchesSearch =
      req.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenReviewModal = (req, action) => {
    setSelectedRequest(req);
    setReviewAction(action);
    setReviewNote(
      action === 'Approve'
        ? 'Application approved by Faculty Coordinator. Welcome to the society!'
        : 'Application rejected due to membership capacity limit for this term.'
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

  return (
    <div className="coordinator-view">
      {/* Informative Header Banner */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <ShieldCheck size={26} style={{ color: '#2563eb', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e3a8a', marginBottom: '2px' }}>
            Faculty & Club Coordinator Review Terminal
          </h4>
          <p style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.5 }}>
            Demonstrating Module 1 membership lifecycle: evaluate submitted student applications and toggle status between <strong>Pending</strong>, <strong>Approved</strong>, and <strong>Rejected</strong>. Updates persist to <code>localStorage</code> and sync with student views.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search student applications by name, roll number, or club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`category-pill ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Clock size={28} />
          </div>
          <div className="empty-title">No Applications Found</div>
          <div className="empty-desc">
            There are no membership requests matching the selected filter ({statusFilter}).
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="university-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Target Club</th>
                <th>Dept & Year</th>
                <th>Date Applied</th>
                <th>Statement of Interest</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                      {req.studentName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Roll: {req.rollNo} • {req.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13px' }}>
                      {req.clubName}
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {req.department}
                    <div style={{ fontSize: '11px' }}>{req.year}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {req.appliedDate}
                  </td>
                  <td style={{ maxWidth: '240px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#334155',
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
                      {req.status === 'Approved' && <CheckCircle2 size={12} />}
                      {req.status === 'Pending' && <Clock size={12} />}
                      {req.status === 'Rejected' && <XCircle size={12} />}
                      {req.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                          onClick={() => handleOpenReviewModal(req, 'Approve')}
                          title="Approve membership request"
                        >
                          <CheckCircle2 size={13} />
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleOpenReviewModal(req, 'Reject')}
                          title="Reject membership request"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-light)', fontStyle: 'italic' }}>
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

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`${reviewAction} Membership Request`}
        subtitle={`${selectedRequest?.studentName} (${selectedRequest?.rollNo}) for ${selectedRequest?.clubName}`}
      >
        {selectedRequest && (
          <form onSubmit={handleConfirmReview}>
            <div className={`alert-box ${reviewAction === 'Approve' ? 'success' : 'error'}`}>
              {reviewAction === 'Approve' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <div>
                <strong>Confirming Action: {reviewAction}</strong>
                <p style={{ marginTop: '2px', fontSize: '12px' }}>
                  This action will permanently set the student's status to <strong>{reviewAction === 'Approve' ? 'Approved' : 'Rejected'}</strong> and notify their dashboard.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Applicant Statement:</div>
              <div style={{ color: '#475569', fontStyle: 'italic' }}>"{selectedRequest.reason}"</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="coordinatorNotes">
                Coordinator Feedback / Review Notes
              </label>
              <textarea
                id="coordinatorNotes"
                className="form-textarea"
                rows="3"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Optional feedback visible to the student..."
              />
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px', padding: '16px 24px' }}>
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
    </div>
  );
};
