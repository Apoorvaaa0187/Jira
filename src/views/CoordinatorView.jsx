import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock
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
        ? 'Application approved by Faculty Coordinator.'
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

  return (
    <div className="coordinator-view">
      {/* Search and Status Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            type="text"
            className="search-input"
            placeholder="Search applications by student name, roll number, or club..."
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

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <Clock size={28} className="empty-icon" />
          <div className="empty-title">No Applications Found</div>
          <div className="empty-desc">
            No membership requests match filter: <strong>{statusFilter}</strong>.
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
                <th>Date Applied</th>
                <th>Statement</th>
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
                  <td style={{ maxWidth: '240px', fontSize: '12px', color: '#334155' }}>
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
                <strong>Confirming: {reviewAction}</strong>
                <p style={{ marginTop: '2px', fontSize: '12px' }}>
                  Update status to <strong>{reviewAction}</strong>. This updates the student's status and club membership count.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '14px', padding: '10px 12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>Applicant Statement:</div>
              <div style={{ fontStyle: 'italic', color: '#334155' }}>"{selectedRequest.reason}"</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="coordinatorNotes">
                Coordinator Feedback Note
              </label>
              <textarea
                id="coordinatorNotes"
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
    </div>
  );
};
