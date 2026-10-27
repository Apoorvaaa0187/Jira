# University Club Management System (UCMS)
**College Software Engineering PBL (Problem-Based Learning) Project**

A modern, responsive university web application built with **React (Vite)**, **JavaScript**, and **Vanilla CSS** featuring local persistence via `localStorage`, complete user authentication (Login/Register), and role-based authorization portals for **Student**, **Club Coordinator**, and **President**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (bundled with Node.js)

### 2. Installation & Running
Open your terminal (PowerShell or Bash) in the project root directory:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🔑 Pre-Configured Demo Credentials

The login screen features one-click quick login buttons for all 3 roles:

| Role | Email | Password | Assigned Permissions / Scope |
| :--- | :--- | :--- | :--- |
| **Student** | `student@apex.edu` | `password123` | Browse clubs, submit join requests, register for events, view ticket passes, cancel reservations. |
| **Club Coordinator** | `coordinator@apex.edu` | `password123` | Evaluate applications (Approve/Reject with feedback), create events, view attendee rosters for their club. |
| **President** | `president@apex.edu` | `password123` | Executive oversight, charter new recognized clubs, oversee all university events, audit all membership applications. |

*You can also click **"Create Account"** to register a new user under any role with custom credentials.*

---

## 🏛️ Portals & Role-Based Authorization

### 1. Student Portal (`role === 'student'`)
- **Dashboard:** Personal overview, active memberships count, registered event passes count, upcoming activities.
- **Clubs:** Directory of university clubs with search & category filters, details modal, and membership application form (with duplicate checking & input validation).
- **Events:** Campus events with live seat progress meters, seat decrementing, and lockout when 0 seats remain.
- **My Activities:** Tabbed view of digital ticket passes (with pass viewing and cancellation that releases seats) and club application statuses (`Pending`, `Approved`, `Rejected`).

### 2. Club Coordinator Portal (`role === 'coordinator'`)
- **Membership Applications:** Review student applications submitted to their club with filter pills (`All`, `Pending`, `Approved`, `Rejected`). Approving increments the club's active member count live.
- **Manage Club Events:** Publish new campus events (title, date, time, venue, capacity, category, description) which immediately become available for student registration.
- **Attendee Rosters:** View the full list of students registered for any club event with roll number, email, and ticket pass code.
- **Club Profile:** Inspect official meeting times, headquarters, coordinator contact, and current membership roster.

### 3. President Portal (`role === 'president'`)
- **Executive Dashboard:** High-level university metrics (Total Recognized Clubs, Total Student Members, Total Event Passes, Total Pending Requests) and society health comparisons.
- **Club Governance:** View all university clubs and **Charter New Club** via modal form (name, category, coordinator, email, location, meeting schedule, description, tags). Persists to `localStorage` and appears across all student and coordinator directories!
- **University Events Directory:** University-wide overview of all scheduled events and attendance capacity utilization across societies.
- **Central Audit Log:** Master searchable audit log of all student membership requests across all university clubs.

---

## 💾 Local Storage Persistence

All application state is saved directly in browser `localStorage`:
- `apex_ucms_users`: Registered user accounts (passwords, roles, departments, identification).
- `apex_ucms_auth_user`: Active authenticated session.
- `apex_ucms_clubs`: University clubs catalog (including newly chartered clubs).
- `apex_ucms_events`: Campus events catalog (including newly created events).
- `apex_ucms_requests`: Membership applications and coordinator approval/rejection statuses.
- `apex_ucms_registrations`: Confirmed event registration tickets and attendee rosters.

*Clicking the **"Reset"** button in the header restores all data back to the default PBL sample dataset.*
