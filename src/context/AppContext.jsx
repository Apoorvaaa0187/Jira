import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_MEMBERSHIP_REQUESTS,
  INITIAL_EVENT_REGISTRATIONS,
  INITIAL_USERS,
  INITIAL_USER
} from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  CLUBS: 'apex_ucms_clubs',
  EVENTS: 'apex_ucms_events',
  REQUESTS: 'apex_ucms_requests',
  REGISTRATIONS: 'apex_ucms_registrations',
  USERS: 'apex_ucms_users',
  AUTH_USER: 'apex_ucms_auth_user'
};

export const AppProvider = ({ children }) => {
  // Load users
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      console.error('Error reading users from localStorage', e);
      return INITIAL_USERS;
    }
  });

  // Load active logged-in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch (e) {
      console.error('Error reading auth user from localStorage', e);
      return INITIAL_USER;
    }
  });

  // Load clubs
  const [clubs, setClubs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLUBS);
      return saved ? JSON.parse(saved) : INITIAL_CLUBS;
    } catch (e) {
      console.error('Error reading clubs from localStorage', e);
      return INITIAL_CLUBS;
    }
  });

  // Load events
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      console.error('Error reading events from localStorage', e);
      return INITIAL_EVENTS;
    }
  });

  // Load membership requests
  const [membershipRequests, setMembershipRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIP_REQUESTS;
    } catch (e) {
      console.error('Error reading requests from localStorage', e);
      return INITIAL_MEMBERSHIP_REQUESTS;
    }
  });

  // Load event registrations
  const [eventRegistrations, setEventRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EVENT_REGISTRATIONS;
    } catch (e) {
      console.error('Error reading registrations from localStorage', e);
      return INITIAL_EVENT_REGISTRATIONS;
    }
  });

  const [toasts, setToasts] = useState([]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch (e) {
      console.error('Failed to save auth user to localStorage', e);
    }
  }, [currentUser]);

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

  // Toast notification helper
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ==========================================
  // AUTHENTICATION & AUTHORIZATION
  // ==========================================

  const login = (email, password) => {
    if (!email?.trim() || !password?.trim()) {
      addToast('error', 'Login Failed', 'Please provide both email and password.');
      return { success: false, error: 'Email and password are required.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!foundUser) {
      addToast('error', 'Authentication Failed', 'Invalid email address or password.');
      return { success: false, error: 'Invalid email or password.' };
    }

    setCurrentUser(foundUser);
    addToast('success', 'Welcome Back', `Logged in as ${foundUser.name} (${foundUser.role.toUpperCase()}).`);
    return { success: true, user: foundUser };
  };

  const register = ({ name, email, password, role, rollNo, department, year, assignedClubId }) => {
    if (!name?.trim() || !email?.trim() || !password?.trim() || !role?.trim() || !rollNo?.trim() || !department?.trim()) {
      addToast('error', 'Registration Failed', 'Please complete all required fields.');
      return { success: false, error: 'All fields are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return { success: false, error: 'Invalid email address format.' };
    }

    if (password.length < 6) {
      addToast('error', 'Weak Password', 'Password must be at least 6 characters.');
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      addToast('warning', 'Account Exists', 'An account with this email address already exists.');
      return { success: false, error: 'An account with this email already exists.' };
    }

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    let assignedClubName = '';
    if (role === 'coordinator' && assignedClubId) {
      const c = clubs.find((club) => club.id === assignedClubId);
      if (c) assignedClubName = c.name;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role, // 'student' | 'coordinator' | 'president'
      rollNo: rollNo.trim().toUpperCase(),
      department: department.trim(),
      year: year ? year.trim() : (role === 'coordinator' ? 'Faculty Lead' : 'Council Lead'),
      assignedClubId: assignedClubId || null,
      assignedClubName: assignedClubName || null,
      avatarInitials: initials || 'AP'
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast('success', 'Registration Successful', `Account created! Welcome to UCMS as a ${role}.`);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('info', 'Logged Out', 'You have been successfully signed out.');
  };

  // Quick switch role for testing / grading ease
  const switchRole = (targetRole) => {
    const demoUser = users.find((u) => u.role === targetRole);
    if (demoUser) {
      setCurrentUser(demoUser);
      addToast('info', 'Switched Portal', `Now viewing as ${demoUser.name} (${demoUser.role.toUpperCase()}).`);
    }
  };

  // ==========================================
  // MODULE 1: CLUB MANAGEMENT & MEMBERSHIP
  // ==========================================

  const submitMembershipRequest = ({ clubId, studentName, rollNo, email, department, year, reason }) => {
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
        addToast('error', 'Application Denied Previously', `Your prior application for ${club.name} was rejected. Contact coordinator for appeals.`);
        return { success: false, error: 'Previous request was rejected.' };
      }
    }

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

  // ==========================================
  // MODULE 2: EVENT MANAGEMENT & REGISTRATION
  // ==========================================

  const registerForEvent = ({ eventId, studentName, rollNo, email, department, year }) => {
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

    if (event.availableSeats <= 0) {
      addToast('error', 'Event Full', `Registration failed: "${event.title}" is already full (0 seats available).`);
      return { success: false, error: 'This event is full. No seats available.' };
    }

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

  const cancelEventRegistration = (registrationId) => {
    const reg = eventRegistrations.find((r) => r.id === registrationId);
    if (!reg) return;

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

  // ==========================================
  // COORDINATOR & PRESIDENT CREATION POWERS
  // ==========================================

  // Create new event (for Coordinator of their club, or President for any club)
  const createEvent = ({ title, clubId, category, date, time, location, totalCapacity, description, eligibility }) => {
    if (!title?.trim() || !clubId || !date || !time || !location?.trim() || !totalCapacity) {
      addToast('error', 'Incomplete Form', 'Please complete all required event parameters.');
      return { success: false, error: 'All fields are required.' };
    }

    const club = clubs.find((c) => c.id === clubId);
    const capacityNum = parseInt(totalCapacity, 10);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      addToast('error', 'Invalid Capacity', 'Capacity must be a positive integer.');
      return { success: false, error: 'Capacity must be a positive integer.' };
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      clubId,
      clubName: club ? club.name : 'University Council',
      category: category || (club ? club.category : 'General'),
      date,
      time,
      location: location.trim(),
      totalCapacity: capacityNum,
      availableSeats: capacityNum,
      registeredCount: 0,
      description: description ? description.trim() : 'Official campus event.',
      eligibility: eligibility ? eligibility.trim() : 'Open to all university students',
      badge: 'New Event'
    };

    setEvents((prev) => [newEvent, ...prev]);
    addToast('success', 'Event Published', `"${newEvent.title}" is now open for student registration.`);
    return { success: true, event: newEvent };
  };

  // President power: Charter/create new recognized club
  const createClub = ({ name, shortName, category, coordinator, email, location, meetingSchedule, description, tags }) => {
    if (!name?.trim() || !category?.trim() || !coordinator?.trim() || !email?.trim() || !description?.trim()) {
      addToast('error', 'Incomplete Form', 'Please provide club name, category, coordinator, email, and description.');
      return { success: false, error: 'All required fields must be filled.' };
    }

    const newClub = {
      id: `club-${Date.now()}`,
      name: name.trim(),
      shortName: shortName ? shortName.trim() : name.split(' ').map((w) => w[0]).join('').slice(0, 4),
      category: category.trim(),
      coordinator: coordinator.trim(),
      email: email.trim(),
      location: location ? location.trim() : 'Campus Center',
      meetingSchedule: meetingSchedule ? meetingSchedule.trim() : 'TBD',
      memberCount: 1,
      established: new Date().getFullYear(),
      description: description.trim(),
      tags: tags && tags.length > 0 ? tags : ['StudentClub', category.trim()]
    };

    setClubs((prev) => [newClub, ...prev]);
    addToast('success', 'Club Chartered', `"${newClub.name}" has been officially registered.`);
    return { success: true, club: newClub };
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CLUBS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

    setClubs(INITIAL_CLUBS);
    setEvents(INITIAL_EVENTS);
    setMembershipRequests(INITIAL_MEMBERSHIP_REQUESTS);
    setEventRegistrations(INITIAL_EVENT_REGISTRATIONS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);

    addToast('success', 'Reset Complete', 'Application restored to default PBL demo state.');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        switchRole,
        clubs,
        events,
        membershipRequests,
        eventRegistrations,
        toasts,
        addToast,
        removeToast,
        submitMembershipRequest,
        updateMembershipStatus,
        registerForEvent,
        cancelEventRegistration,
        createEvent,
        createClub,
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
