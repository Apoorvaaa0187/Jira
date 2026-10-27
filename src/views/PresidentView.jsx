import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building,
  Calendar,
  Users,
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const PresidentView = () => {
  const {
    clubs,
    events,
    membershipRequests,
    eventRegistrations,
    createClub,
    currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'clubs' | 'events' | 'audit'

  // Charter club modal state
  const [isCharterModalOpen, setIsCharterModalOpen] = useState(false);
  const [newClubData, setNewClubData] = useState({
    name: '',
    shortName: '',
    category: 'Technology',
    coordinator: '',
    email: '',
    location: '',
    meetingSchedule: '',
    description: '',
    tags: ''
  });
  const [charterError, setCharterError] = useState('');

  // Audit filter state
  const [auditQuery, setAuditQuery] = useState('');
  const [auditFilter, setAuditFilter] = useState('All');

  // Total statistics calculations
  const totalClubMembers = clubs.reduce((acc, c) => acc + (c.memberCount || 0), 0);
  const totalCapacity = events.reduce((acc, e) => acc + (e.totalCapacity || 0), 0);
  const totalBookedSeats = events.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
  const totalApprovedRequests = membershipRequests.filter((r) => r.status === 'Approved').length;
  const totalPendingRequests = membershipRequests.filter((r) => r.status === 'Pending').length;

  const handleCharterSubmit = (e) => {
    e.preventDefault();
    setCharterError('');

    const tagsArray = newClubData.tags
      ? newClubData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [newClubData.category];

    const res = createClub({
      ...newClubData,
      tags: tagsArray
    });

    if (res.success) {
      setIsCharterModalOpen(false);
      setNewClubData({
        name: '',
        shortName: '',
        category: 'Technology',
        coordinator: '',
        email: '',
        location: '',
        meetingSchedule: '',
        description: '',
        tags: ''
      });
    } else {
      setCharterError(res.error || 'Failed to charter club.');
    }
  };

  const filteredAuditRequests = membershipRequests.filter((req) => {
    const matchesFilter = auditFilter === 'All' || req.status === auditFilter;
    const matchesSearch =
      req.clubName.toLowerCase().includes(auditQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(auditQuery.toLowerCase()) ||
      req.rollNo.toLowerCase().includes(auditQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="president-view">
      {/* Executive Header Banner */}
      <div className="filter-bar" style={{ backgroundColor: '#ffffff', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
            Executive Council & Student Affairs
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            President's Governance Portal • {currentUser.name}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setIsCharterModalOpen(true)}
        >
          <Plus size={14} /> Charter New Club
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          <Award size={15} />
          <span>Executive Overview</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeSubTab === 'clubs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('clubs')}
        >
          <Building size={15} />
          <span>Recognized Clubs ({clubs.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeSubTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('events')}
        >
          <Calendar size={15} />
          <span>Campus Events ({events.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeSubTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('audit')}
        >
          <ShieldCheck size={15} />
          <span>Central Audit Log</span>
          {totalPendingRequests > 0 && <span className="tab-count-badge">{totalPendingRequests}</span>}
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">Recognized Societies</div>
                <div className="stat-value">{clubs.length}</div>
              </div>
              <Building size={20} className="stat-icon-subtle" />
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">Total Student Members</div>
                <div className="stat-value">{totalClubMembers}</div>
              </div>
              <Users size={20} className="stat-icon-subtle" />
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">Event Registrations</div>
                <div className="stat-value">{eventRegistrations.length}</div>
              </div>
              <Ticket size={20} className="stat-icon-subtle" />
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <div className="stat-label">Pending Applications</div>
                <div className="stat-value">{totalPendingRequests}</div>
              </div>
              <Clock size={20} className="stat-icon-subtle" />
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Club Health Table */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Society Roster Health</h3>
                  <p className="panel-subtitle">Official active membership enrollment</p>
                </div>
              </div>
              <div className="compact-list">
                {clubs.map((c) => (
                  <div key={c.id} className="compact-item">
                    <div className="compact-item-main">
                      <div className="compact-meta">
                        <span className="tag-pill">{c.category}</span>
                        <span className="text-muted">Est. {c.established}</span>
                      </div>
                      <div className="compact-title">{c.name}</div>
                      <div className="compact-sub">Coordinator: {c.coordinator}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>
                      {c.memberCount} <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)' }}>members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Utilization */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Campus Event Capacities</h3>
                  <p className="panel-subtitle">Overall attendance and booking utilization</p>
                </div>
              </div>
              <div className="compact-list">
                {events.map((evt) => {
                  const percent = Math.round(((evt.totalCapacity - evt.availableSeats) / evt.totalCapacity) * 100);
                  return (
                    <div key={evt.id} className="compact-item">
                      <div className="compact-item-main">
                        <div className="compact-meta">
                          <span className="text-muted">{evt.date}</span>
                          <span>•</span>
                          <span className="text-muted">{evt.clubName.split(' ')[0]}</span>
                        </div>
                        <div className="compact-title">{evt.title}</div>
                        <div className="compact-sub">{evt.location}</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{percent}% Full</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {evt.registeredCount} / {evt.totalCapacity}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECOGNIZED CLUBS GOVERNANCE */}
      {activeSubTab === 'clubs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Officially Chartered Clubs</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recognized student organizations governed by the university</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCharterModalOpen(true)}
            >
              <Plus size={13} /> Charter New Club
            </button>
          </div>

          <div className="table-wrapper">
            <table className="university-table">
              <thead>
                <tr>
                  <th>Club Name</th>
                  <th>Category</th>
                  <th>Faculty / Lead Coordinator</th>
                  <th>Official Email</th>
                  <th>Meeting Headquarters</th>
                  <th>Enrolled Members</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{club.name}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>Est. {club.established}</div>
                    </td>
                    <td>
                      <span className="tag-pill">{club.category}</span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{club.coordinator}</td>
                    <td style={{ fontSize: '12px' }}>{club.email}</td>
                    <td style={{ fontSize: '12px' }}>{club.location}</td>
                    <td style={{ fontWeight: 600, fontSize: '13px' }}>{club.memberCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPUS EVENTS DIRECTORY */}
      {activeSubTab === 'events' && (
        <div>
          <div className="table-wrapper">
            <table className="university-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Organizing Society</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Capacity Status</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{evt.title}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>{evt.category}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{evt.clubName}</td>
                    <td style={{ fontSize: '12px' }}>{evt.date} ({evt.time})</td>
                    <td style={{ fontSize: '12px' }}>{evt.location}</td>
                    <td>
                      {evt.availableSeats === 0 ? (
                        <span className="badge badge-full">Full</span>
                      ) : (
                        <span className="badge badge-open">{evt.availableSeats} open</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: 600 }}>
                      {evt.registeredCount} / {evt.totalCapacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CENTRAL AUDIT LOG */}
      {activeSubTab === 'audit' && (
        <div>
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search all applications by student name, roll number, or club..."
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
              />
            </div>

            <div className="category-pills" role="radiogroup" aria-label="Status filters">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`category-pill ${auditFilter === status ? 'active' : ''}`}
                  onClick={() => setAuditFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="university-table">
              <thead>
                <tr>
                  <th>Student Applicant</th>
                  <th>Target Club</th>
                  <th>Department</th>
                  <th>Application Date</th>
                  <th>Statement</th>
                  <th>Status</th>
                  <th>Coordinator Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.studentName}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>{req.rollNo}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{req.clubName}</td>
                    <td style={{ fontSize: '12px' }}>{req.department}</td>
                    <td className="text-muted" style={{ fontSize: '12px' }}>{req.appliedDate}</td>
                    <td style={{ maxWidth: '240px', fontSize: '12px', color: '#334155' }}>
                      "{req.reason}"
                    </td>
                    <td>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {req.reviewNotes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charter New Club Modal */}
      <Modal
        isOpen={isCharterModalOpen}
        onClose={() => setIsCharterModalOpen(false)}
        title="Charter New University Club"
        subtitle="Officially register a new student organization under University Regulations"
      >
        <form onSubmit={handleCharterSubmit}>
          {charterError && (
            <div className="alert-box error" role="alert">
              <div>{charterError}</div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="club-name">
              Club Official Name <span className="required-star">*</span>
            </label>
            <input
              id="club-name"
              type="text"
              className="form-input"
              placeholder="e.g. Apex Artificial Intelligence & Data Society"
              value={newClubData.name}
              onChange={(e) => setNewClubData({ ...newClubData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="club-cat">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="club-cat"
                className="form-select"
                value={newClubData.category}
                onChange={(e) => setNewClubData({ ...newClubData, category: e.target.value })}
                required
              >
                <option value="Technology">Technology</option>
                <option value="Oratory & Debate">Oratory & Debate</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Media & Design">Media & Design</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Social & Community">Social & Community</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="club-short">
                Abbreviation / Code
              </label>
              <input
                id="club-short"
                type="text"
                className="form-input"
                placeholder="e.g. AIDS"
                value={newClubData.shortName}
                onChange={(e) => setNewClubData({ ...newClubData, shortName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="club-coord">
                Lead Coordinator <span className="required-star">*</span>
              </label>
              <input
                id="club-coord"
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Alistair Finch & Maya Lin"
                value={newClubData.coordinator}
                onChange={(e) => setNewClubData({ ...newClubData, coordinator: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="club-email">
                Official Email <span className="required-star">*</span>
              </label>
              <input
                id="club-email"
                type="email"
                className="form-input"
                placeholder="ai.society@apex.edu"
                value={newClubData.email}
                onChange={(e) => setNewClubData({ ...newClubData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="club-loc">
                Meeting Room / Lab
              </label>
              <input
                id="club-loc"
                type="text"
                className="form-input"
                placeholder="e.g. Turing Center, 4th Floor"
                value={newClubData.location}
                onChange={(e) => setNewClubData({ ...newClubData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="club-sched">
                Regular Meeting Time
              </label>
              <input
                id="club-sched"
                type="text"
                className="form-input"
                placeholder="e.g. Thursdays, 4:00 PM"
                value={newClubData.meetingSchedule}
                onChange={(e) => setNewClubData({ ...newClubData, meetingSchedule: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="club-desc">
              Charter Description & Mission <span className="required-star">*</span>
            </label>
            <textarea
              id="club-desc"
              className="form-textarea"
              rows="3"
              placeholder="State the objective, activities, and scope of this society..."
              value={newClubData.description}
              onChange={(e) => setNewClubData({ ...newClubData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="club-tags">
              Tags (comma separated)
            </label>
            <input
              id="club-tags"
              type="text"
              className="form-input"
              placeholder="e.g. AI, MachineLearning, PyTorch"
              value={newClubData.tags}
              onChange={(e) => setNewClubData({ ...newClubData, tags: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCharterModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Charter Club
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
