import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { ClubsView } from './views/ClubsView';
import { EventsView } from './views/EventsView';
import { MyRegistrationsView } from './views/MyRegistrationsView';
import { CoordinatorView } from './views/CoordinatorView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [selectedClubForModal, setSelectedClubForModal] = useState(null);

  const handleSelectEventFromDashboard = (event) => {
    setSelectedEventForModal(event);
    setActiveTab('events');
  };

  const handleSelectClubFromDashboard = (club) => {
    setSelectedClubForModal(club);
    setActiveTab('clubs');
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="page-content">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onSelectEvent={handleSelectEventFromDashboard}
              onSelectClub={handleSelectClubFromDashboard}
            />
          )}

          {activeTab === 'clubs' && (
            <ClubsView initialSelectedClub={selectedClubForModal} />
          )}

          {activeTab === 'events' && (
            <EventsView
              initialSelectedEvent={selectedEventForModal}
              onNavigateToRegistrations={() => setActiveTab('registrations')}
            />
          )}

          {activeTab === 'registrations' && (
            <MyRegistrationsView
              onNavigateToEvents={() => setActiveTab('events')}
              onNavigateToClubs={() => setActiveTab('clubs')}
            />
          )}

          {activeTab === 'coordinator' && (
            <CoordinatorView />
          )}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
