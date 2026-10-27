import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_MEMBERSHIP_REQUESTS,
  INITIAL_EVENT_REGISTRATIONS,
  INITIAL_USER
} from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  CLUBS: 'apex_ucms_clubs',
  EVENTS: 'apex_ucms_events',
  REQUESTS: 'apex_ucms_requests',
  REGISTRATIONS: 'apex_ucms_registrations',
  USER: 'apex_ucms_user'
};

export const AppProvider = ({ children }) => {
  // Load initial data with localStorage fallback
  const [clubs, setClubs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLUBS);
      return saved ? JSON.parse(saved) : INITIAL_CLUBS;
    } catch (e) {
      console.error('Error reading clubs from localStorage', e);
      return INITIAL_CLUBS;
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      console.error('Error reading events from localStorage', e);
      return INITIAL_EVENTS;
    }
  });

  const [membershipRequests, setMembershipRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIP_REQUESTS;
    } catch (e) {
      console.error('Error reading requests from localStorage', e);
      return INITIAL_MEMBERSHIP_REQUESTS;
    }
  });

  const [eventRegistrations, setEventRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EVENT_REGISTRATIONS;
    } catch (e) {
      console.error('Error reading registrations from localStorage', e);
      return INITIAL_EVENT_REGISTRATIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch (e) {
      console.error('Error reading user from localStorage', e);
      return INITIAL_USER;
    }
  });

  const [toasts, setToasts] = useState([]);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    } catch (e) {
      console.error('Failed to save clubs to localStorage', e);
    }
  }, [clubs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to localStorage', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(membershipRequests));
    } catch (e) {
      console.error('Failed to save membershipRequests to localStorage', e);
    }
  }, [membershipRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(eventRegistrations));
    } catch (e) {
      console.error('Failed to save eventRegistrations to localStorage', e);
    }
  }, [eventRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to save currentUser to localStorage', e);
    }
  }, [currentUser]);

  // Toast notification helper
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // MODULE 1: CLUB MANAGEMENT & MEMBERSHIP
  const submitMembershipRequest = ({ clubId, studentName, rollNo, email, department, year, reason }) => {
    // 1. Validation
    if (!studentName?.trim() || !rollNo?.trim() || !email?.trim() || !department?.trim() || !year?.trim() || !reason?.trim()) {
      addToast('error', 'Validation Error', 'Please complete all required fields including your reason for joining.');
      return { success: false, error: 'All fields are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast('error', 'Invalid Email', 'Please enter a valid student university email address.');
      return { success: false, error: 'Invalid email address.' };
    }

    if (reason.trim().length < 15) {
      addToast('error', 'Reason Too Short', 'Please provide at least 15 characters describing why you wish to join.');
      return { success: false, error: 'Reason must be at least 15 characters.' };
    }

    const club = clubs.find((c) => c.id === clubId);
    if (!club) {
      addToast('error', 'Club Not Found', 'The selected club could not be identified.');
      return { success: false, error: 'Club not found.' };
    }

    // 2. Duplicate Check: Check if rollNo or email already requested this club
    const normalizedRoll = rollNo.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existingRequest = membershipRequests.find(
      (req) =>
        req.clubId === clubId &&
        (req.rollNo.trim().toUpperCase() === normalizedRoll || req.email.trim().toLowerCase() === normalizedEmail)
    );

    if (existingRequest) {
      if (existingRequest.status === 'Approved') {
        addToast('warning', 'Already a Member', `You are already an approved active member of ${club.name}.`);
        return { success: false, error: 'Already an approved member of this club.' };
      } else if (existingRequest.status === 'Pending') {
        addToast('warning', 'Duplicate Request', `You already have a pending membership application for ${club.name}.`);
        return { success: false, error: 'Membership request is already pending review.' };
      } else {
        addToast('error', 'Application Denied Previously', `Your prior application for ${club.name} was rejected. Contact ${club.email} for appeals.`);
        return { success: false, error: 'Previous request was rejected.' };
      }
    }

    // 3. Create and Save Request
    const newRequest = {
      id: `req-${Date.now()}`,
      clubId,
      clubName: club.name,
      studentName: studentName.trim(),
      rollNo: normalizedRoll,
      email: normalizedEmail,
      department: department.trim(),
      year: year.trim(),
      reason: reason.trim(),
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      reviewNotes: 'Application submitted and queued for coordinator review.'
    };

    setMembershipRequests((prev) => [newRequest, ...prev]);
    addToast('success', 'Application Submitted', `Your membership request for ${club.name} is now pending approval.`);
    return { success: true, request: newRequest };
  };

  // Coordinator action: Approve or Reject membership (PBL lifecycle demonstration)
  const updateMembershipStatus = (requestId, newStatus, note = '') => {
    const targetRequest = membershipRequests.find((req) => req.id === requestId);
    const affectedClubId = targetRequest ? targetRequest.clubId : null;

    setMembershipRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: newStatus,
            reviewNotes:
              note ||
              (newStatus === 'Approved'
                ? 'Application approved by Club Coordinator.'
                : 'Application declined due to capacity limitations.')
          };
        }
        return req;
      })
    );

    // If approved and was not already approved, increment club member count
    if (newStatus === 'Approved' && affectedClubId && targetRequest?.status !== 'Approved') {
      setClubs((prev) =>
        prev.map((c) => (c.id === affectedClubId ? { ...c, memberCount: c.memberCount + 1 } : c))
      );
    }

    addToast(
      newStatus === 'Approved' ? 'success' : 'info',
      `Application ${newStatus}`,
      `Membership request status has been updated to "${newStatus}".`
    );
  };

  // MODULE 2: EVENT MANAGEMENT & REGISTRATION
  const registerForEvent = ({ eventId, studentName, rollNo, email, department, year }) => {
    // 1. Validation
    if (!studentName?.trim() || !rollNo?.trim() || !email?.trim() || !department?.trim() || !year?.trim()) {
      addToast('error', 'Validation Error', 'Please complete all student identification fields to register.');
      return { success: false, error: 'All fields are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast('error', 'Invalid Email', 'Please enter a valid student university email.');
      return { success: false, error: 'Invalid email address.' };
    }

    const event = events.find((e) => e.id === eventId);
    if (!event) {
      addToast('error', 'Event Not Found', 'The requested event could not be found.');
      return { success: false, error: 'Event not found.' };
    }

    // 2. Capacity Check: Prevent registration if event is full
    if (event.availableSeats <= 0) {
      addToast('error', 'Event Full', `Registration failed: "${event.title}" is already full (0 seats available).`);
      return { success: false, error: 'This event is full. No seats available.' };
    }

    // 3. Duplicate Check: Prevent multiple registrations by same student
    const normalizedRoll = rollNo.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    const alreadyRegistered = eventRegistrations.find(
      (reg) =>
        reg.eventId === eventId &&
        (reg.rollNo.trim().toUpperCase() === normalizedRoll || reg.email.trim().toLowerCase() === normalizedEmail)
    );

    if (alreadyRegistered) {
      addToast('warning', 'Already Registered', `You are already registered for "${event.title}". Ticket: ${alreadyRegistered.ticketCode}`);
      return { success: false, error: `Duplicate registration. Ticket: ${alreadyRegistered.ticketCode}` };
    }

    // 4. Success: Generate Ticket and Decrement Available Seats
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = event.category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'EVT');
    const ticketCode = `APX-${prefix}-${randomSuffix}`;

    const newRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      eventTitle: event.title,
      clubName: event.clubName,
      studentName: studentName.trim(),
      rollNo: normalizedRoll,
      email: normalizedEmail,
      department: department.trim(),
      year: year.trim(),
      registeredDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ticketCode,
      status: 'Confirmed',
      eventDate: event.date,
      location: event.location
    };

    // Decrement seat count in event list
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            availableSeats: Math.max(0, e.availableSeats - 1),
            registeredCount: e.registeredCount + 1
          };
        }
        return e;
      })
    );

    setEventRegistrations((prev) => [newRegistration, ...prev]);
    addToast('success', 'Registration Confirmed!', `Seat booked for "${event.title}". Pass: ${ticketCode}`);
    return { success: true, registration: newRegistration };
  };

  // Cancel registration & release seat back to event pool
  const cancelEventRegistration = (registrationId) => {
    const reg = eventRegistrations.find((r) => r.id === registrationId);
    if (!reg) return;

    // Increment seat back
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === reg.eventId) {
          return {
            ...e,
            availableSeats: Math.min(e.totalCapacity, e.availableSeats + 1),
            registeredCount: Math.max(0, e.registeredCount - 1)
          };
        }
        return e;
      })
    );

    setEventRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    addToast('info', 'Registration Cancelled', `Registration for "${reg.eventTitle}" was cancelled. 1 seat released.`);
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CLUBS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setClubs(INITIAL_CLUBS);
    setEvents(INITIAL_EVENTS);
    setMembershipRequests(INITIAL_MEMBERSHIP_REQUESTS);
    setEventRegistrations(INITIAL_EVENT_REGISTRATIONS);
    setCurrentUser(INITIAL_USER);

    addToast('success', 'Reset Complete', 'All clubs, events, and registrations have been restored to sample PBL defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        clubs,
        events,
        membershipRequests,
        eventRegistrations,
        currentUser,
        setCurrentUser,
        toasts,
        addToast,
        removeToast,
        submitMembershipRequest,
        updateMembershipStatus,
        registerForEvent,
        cancelEventRegistration,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
