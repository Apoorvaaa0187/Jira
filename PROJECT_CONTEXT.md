# Project Context

## Evidence and scope

This document describes the files and behavior present in the workspace at the time of inspection. **Verified** statements are directly supported by the checked-in source, configuration, or README. **Assumptions / code-inspection risks** are explicitly labeled and have not been confirmed by runtime or automated tests. No secrets or environment-variable values are included.

The inventory below omits installed dependencies (`node_modules/`) and build output (`dist/`). No other application source folders were present in the inspected project tree.

## 1. Purpose and overview

**Verified:** The project is the University Club Management System (UCMS), a college Software Engineering / Problem-Based Learning (PBL) demonstration. It is a client-side university portal for browsing student clubs and campus events, applying for club membership, registering for events, viewing student activity, and simulating coordinator review.

The project is implemented as a single-page React application bundled by Vite. Its sample data and user-generated demo state are stored in the browser's `localStorage`; there is no backend service or remote database in the inspected code.

## 2. Project structure

```text
.
├── PROJECT_CONTEXT.md
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── Header.jsx
    │   ├── Modal.jsx
    │   ├── Sidebar.jsx
    │   └── Toast.jsx
    ├── context/
    │   └── AppContext.jsx
    ├── data/
    │   └── mockData.js
    └── views/
        ├── ClubsView.jsx
        ├── CoordinatorView.jsx
        ├── DashboardView.jsx
        ├── EventsView.jsx
        └── MyRegistrationsView.jsx
```

`node_modules/` contains installed packages and `dist/` contains built output; both are generated/dependency directories and are intentionally excluded from this source inventory.

## 3. Tech stack, libraries, and configuration

**Verified:**

- **Language and UI:** JavaScript with JSX; React 18 (`react`, `react-dom`).
- **Build and development server:** Vite 6 with `@vitejs/plugin-react`.
- **Icons:** `lucide-react`.
- **Styling:** Plain CSS in `src/index.css`; no CSS framework is listed in the package manifest.
- **Persistence:** Browser `localStorage`; no database client or network/API layer appears in the application source.
- **Package configuration:** `package.json` uses ES modules (`"type": "module"`); `package-lock.json` uses lockfile version 3.
- **Vite configuration:** React plugin enabled; dev server is configured for port `3000` and `open: false`.
- **Page shell:** `index.html` provides the `#root` element, page title, inline graduation-cap SVG favicon, and Google Fonts links for Plus Jakarta Sans and Inter.
- **Responsive styling:** CSS includes breakpoints at `900px` and `640px`.
- **Scripts:** `dev`, `build`, and `preview`. No test or lint script is defined in `package.json`.

Direct dependencies declared in the manifest are `react` `^18.3.1`, `react-dom` `^18.3.1`, and `lucide-react` `^0.469.0`. Development dependencies are `vite` `^6.0.7` and `@vitejs/plugin-react` `^4.3.4`.

## 4. Important files

- `README.md` — project description, setup instructions, module summaries, manual demo scenarios, source tree, and stated design limitations.
- `package.json` — package metadata, dependencies, and npm scripts.
- `package-lock.json` — npm dependency lockfile.
- `vite.config.js` — Vite React plugin and local server settings.
- `index.html` — browser document shell and React mount point.
- `src/main.jsx` — mounts `<App />` into `#root` under React `StrictMode` and imports the stylesheet.
- `src/App.jsx` — wraps the UI in `AppProvider`, manages the active tab and mobile sidebar, and renders the selected view.
- `src/index.css` — shared design tokens, layout, component styles, responsive rules, modal, form, toast, and ticket styles.
- `src/context/AppContext.jsx` — shared state, initial `localStorage` loading, persistence effects, form/business validation, membership review, event registration/cancellation, reset, and toast handling.
- `src/data/mockData.js` — sample clubs, events, active student profile, membership requests, and event registrations.
- `src/components/Header.jsx` — page heading, student-profile editing, term badge, and reset-demo control.
- `src/components/Sidebar.jsx` — tab navigation and counts/badges for clubs, events, registrations, and pending requests.
- `src/components/Modal.jsx` — shared overlay dialog; closes on Escape or backdrop click and locks body scrolling while open.
- `src/components/Toast.jsx` — renders dismissible notification messages.
- `src/views/DashboardView.jsx` — overview metrics, featured events, club links, and student guidance.
- `src/views/ClubsView.jsx` — searchable/filterable club directory, details, membership form, and request status.
- `src/views/EventsView.jsx` — searchable/filterable event list, capacity display, registration form, and in-app event pass.
- `src/views/MyRegistrationsView.jsx` — current student's event passes and membership applications; allows cancellation of event registrations.
- `src/views/CoordinatorView.jsx` — membership request search/filter and simulated approve/reject review.

## 5. Implemented and incomplete features

### Implemented (verified in source)

- Dashboard with sample-data counts, current-user activity metrics, featured events, and club shortcuts.
- Club directory with search across club name, description, coordinator, and tags; category filters; details modal; and membership application form.
- Membership validation for required fields, basic email format, and a minimum 15-character interest statement.
- Duplicate membership checks by normalized roll number or email; status states are `Pending`, `Approved`, and `Rejected`.
- Coordinator-view search/filter and approval/rejection with review notes.
- Event directory with search/category filters, event details, seat counts, capacity indicators, and progress meters.
- Event registration validation, duplicate checks by normalized roll number or email, capacity lockout, generated ticket code, and in-app confirmation pass.
- Cancellation of event registrations, with a corresponding seat release.
- Editable active student profile and a reset-to-sample-data action.
- Browser persistence for clubs, events, membership requests, event registrations, and active profile; toast feedback for operations.

### Incomplete or demo-only (verified limitations)

- There is no backend, API, database, authentication, or role/permission enforcement in the inspected application. The coordinator panel is part of the same client UI and is not protected as an actual admin role.
- Demo state is local to one browser profile. It does not synchronize between users, browsers, or devices; browser storage can be cleared or edited by the user.
- Sample catalog data is hard-coded in `src/data/mockData.js`; there is no interface for creating or editing clubs/events.
- Ticket codes and passes are generated/rendered in the browser. The source does not implement email delivery or QR-code generation, despite text in the UI suggesting email/pass workflows.
- The package manifest defines no automated test, lint, or type-check scripts, and no test files are present in the inspected project tree.
- Google Fonts are requested from an external host; those fonts may not load without network access.

## 6. Frontend/backend architecture and data flow

**Verified architecture:** There is a frontend only; no backend component is present.

1. `src/main.jsx` mounts the app. `src/App.jsx` places the interface inside `AppProvider`.
2. `AppProvider` initializes shared state from `localStorage`, falling back to the exported sample values in `mockData.js` when no saved value is available or parsing fails.
3. React context exposes shared catalog, profile, registration, and membership state plus operations to the components/views.
4. Views call context operations for submissions, cancellations, review decisions, profile changes, and reset. The provider updates React state and shows toasts; effects serialize state back into `localStorage`.
5. The UI reads the updated context and rerenders. Navigation is an `activeTab` value in `App.jsx`, not a URL router.

The initial sample set defines six clubs and six events, alongside one sample user, three membership requests, and one event registration.

## 7. Setup and run commands

**Prerequisites:** The README recommends Node.js 18 or newer and npm.

From the project root:

```sh
npm install
npm run dev
```

The Vite development server is configured for `http://localhost:3000`. To make and preview a production build:

```sh
npm run build
npm run preview
```

These are manifest/README commands; this inspection did not run them.

## 8. Bugs, limitations, and development status

### Verified limitations and status

- The project is a PBL/demo implementation using sample data and client-side persistence, not a production multi-user system.
- No automated tests or test/lint scripts were found in the inspected source tree or package scripts.
- `Modal.jsx` handles Escape and backdrop dismissal and locks page scrolling, but contains no focus trap or focus restoration. The README's claim of modal focus management is not supported by the inspected component.
- The in-app ticket pass is a display of stored registration fields and a generated text code; there is no QR or email-delivery implementation.

### Code-inspection risks (not runtime-tested)

- `updateMembershipStatus` assigns `affectedClubId` inside a functional state updater, then reads that variable immediately after scheduling the updater. Since updater execution is controlled by React, the club member count may not update reliably on approval.
- `App.jsx` retains the last selected dashboard club/event while passing it to views as an initial modal selection. The views are conditionally mounted, so revisiting the corresponding tab may reopen the previously selected modal.
- `Header.jsx` initializes its profile form state only on component mount. After using Reset Demo, the active profile resets in context, but an already-mounted header's profile form may still contain the pre-reset values; saving that form can restore them.

The items in the last subsection are observations from source inspection, not confirmed defects from a browser session or test suite.
