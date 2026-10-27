# University Club Management System (UCMS)
**College Software Engineering PBL (Problem-Based Learning) Project**

A modern, responsive university web application built with **React (Vite)**, **JavaScript**, and **Vanilla CSS** featuring local persistence via `localStorage`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (bundled with Node.js)

### 2. Installation & Running
Open your terminal (PowerShell or Bash) in the project root directory:

```bash
# 1. Install dependencies (React, Vite, Lucide Icons)
npm install

# 2. Start the Vite local development server
npm run dev
```

The application will start on `http://localhost:3000` (or `http://localhost:5173`). Open the URL in any web browser.

### 3. Production Build
```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 🏛️ Core Modules & Architecture

### Module 1: Club Management and Membership
- **Component File:** [`src/views/ClubsView.jsx`](file:///c:/Users/DELL/Downloads/SE/src/views/ClubsView.jsx)
- **State & Logic Handler:** [`src/context/AppContext.jsx`](file:///c:/Users/DELL/Downloads/SE/src/context/AppContext.jsx)
- **Key Features:**
  - Displays a directory of 6 university clubs across multiple categories (Technology, Oratory, Culture, Media, Sports).
  - Search by club name, coordinator, description, and tags with category filter pills.
  - "View Details" modal showing meetings, location, contact, and lead faculty.
  - "Join Club" application form with strict validation (Name, Roll Number, Institutional Email, Department, Year, Statement of Interest min 15 chars).
  - **Duplicate Prevention:** Prevents re-applying if the student already has an `Approved`, `Pending`, or `Rejected` record.
  - **3-Tier Status Lifecycle:** Displays `Pending`, `Approved`, or `Rejected` badges with reviewer notes.
  - **Coordinator Review Panel:** [`src/views/CoordinatorView.jsx`](file:///c:/Users/DELL/Downloads/SE/src/views/CoordinatorView.jsx) allows testing approval and rejection of pending requests in real-time.

### Module 2: Event Management and Registration
- **Component File:** [`src/views/EventsView.jsx`](file:///c:/Users/DELL/Downloads/SE/src/views/EventsView.jsx)
- **State & Logic Handler:** [`src/context/AppContext.jsx`](file:///c:/Users/DELL/Downloads/SE/src/context/AppContext.jsx)
- **Key Features:**
  - Displays campus events with descriptions, schedules, locations, organizing clubs, capacity, and remaining seats.
  - Dynamic Seat Meter: Visual progress bar and colored badges (`Open`, `Limited Seats`, `House Full`).
  - Student registration form with instant seat decrementing upon booking.
  - **Duplicate Prevention:** Blocks multiple registrations by the same student roll number or email for an event.
  - **Capacity Lockout:** Strict lockout when `availableSeats === 0` (e.g. RoboWars arena starts full; AI Masterclass starts with only 2 seats left for quick testing).
  - Official digital ticket pass generation (`APX-[CAT]-[RANDOM]`).
  - **Cancellation Flow:** Registrations can be cancelled in "My Activities", immediately releasing the seat back to the event pool.

---

## 🧪 Manual Test Scenarios

| Test Case | Steps to Execute | Expected Result |
| :--- | :--- | :--- |
| **1. Valid Input (Club Membership)** | Go to **Clubs** tab → Click **Join Club** on *Robotics & Automation Society* → Enter reason (e.g. "Excited to work on autonomous navigation and IoT rovers") → Click **Submit Application**. | Success toast appears; application status shows `Pending ⏳`; request appears under **My Activities** > *Club Memberships*. |
| **2. Invalid Input Validation** | Go to **Clubs** tab → Click **Join Club** on *Symphony Cultural Guild* → Leave reason empty or type `< 15` chars (e.g. "hi") or enter an invalid email (e.g. `test`) → Click **Submit Application**. | Form blocks submission; error message displays: *"Please provide at least 15 characters describing why you wish to join"* or *"Please enter a valid student university email address."* |
| **3. Duplicate Action Prevention** | Go to **Clubs** tab → Try to click **Join Club** on *Apex Coding & Open Source Society* (which student `2024CS104` has already joined as Approved). | Button shows `Member ✓`. If forced via form with same roll number `2024CS104`, system blocks with: *"Duplicate Request: You are already an approved member of this club."* |
| **4. Event Registration & Seat Decrement** | Go to **Campus Events** tab → Locate *Hands-on Deep Learning & Edge AI Masterclass* (starts with **2 seats remaining**) → Click **Register Now** → Confirm details → Submit. | Registration succeeds; official ticket pass `APX-TEC-XXXX` is generated; remaining seats immediately drop to **1**. |
| **5. Full-Event Lockout** | In the **Campus Events** tab, register a different roll number (e.g. switch profile to `2024CS202` or change roll number in modal) for the remaining seat of *Edge AI Masterclass*. Now remaining seats = **0**. Attempt to register a third student. Alternatively, check *Autonomous Bot Sprint (RoboWars)*. | Button is disabled with label `House Full / Full (0 Seats)`; submission is blocked with alert: *"Registration failed: This event is completely full (0 seats available)."* |
| **6. Coordinator Review Lifecycle** | Go to **Coordinator Approvals** tab → Find *Literary & Debating Society* (Pending for Aarav) → Click **Approve** or **Reject** → Enter note → Confirm. | Status changes immediately to Approved/Rejected; synced to **My Activities**; club member count updates. |
| **7. Demo State Reset** | Click **Reset Demo** in the top-right header at any time. | Restores original sample data to verify test flows again. |

---

## 📁 Source Code Directory Structure

```text
university-club-management-system/
├── index.html                # Main HTML entry with typography fonts & favicon
├── package.json              # Dependencies: react, react-dom, vite, lucide-react
├── vite.config.js            # Vite build configuration (Port 3000)
├── src/
│   ├── main.jsx              # Application bootstrap
│   ├── App.jsx               # Layout, tab navigation, responsive sidebar
│   ├── index.css             # Complete university design system & responsive styling
│   ├── context/
│   │   └── AppContext.jsx    # Central state, localStorage persistence, duplicate checks, seat decrement
│   ├── data/
│   │   └── mockData.js       # Realistic initial clubs, events, users, and request statuses
│   ├── components/
│   │   ├── Header.jsx        # Navigation header, student profile switcher, reset button
│   │   ├── Sidebar.jsx       # Academic sidebar with badges & active route highlighting
│   │   ├── Modal.jsx         # Accessible modal dialog with backdrop & focus management
│   │   └── Toast.jsx         # Toast notification alert system
│   └── views/
│       ├── DashboardView.jsx # Quick metrics, upcoming events spotlight, quick links
│       ├── ClubsView.jsx     # Module 1: Club directory, search/filters, join request modal
│       ├── EventsView.jsx    # Module 2: Event directory, seat meter, ticket confirmation pass
│       ├── MyRegistrationsView.jsx # Student passes table, membership review statuses, cancel pass
│       └── CoordinatorView.jsx     # Evaluation panel: Approve/Reject requests live
```

---

## ⚠️ Stated Design Limitations

1. **Client-Side Persistence:** Data is stored in the browser's `localStorage` rather than a remote database (MongoDB/PostgreSQL). If you clear your browser cookies/storage or open the app in Incognito mode, default sample data will be restored.
2. **Single-Browser Simulation:** The coordinator review panel runs in the same browser session so you can easily demonstrate both student submission and coordinator approval without needing multi-user authentication servers.
