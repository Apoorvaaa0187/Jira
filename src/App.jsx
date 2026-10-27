import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { ClubsView } from './views/ClubsView';
import { EventsView } from './views/EventsView';
import { MyRegistrationsView } from './views/MyRegistrationsView';
import { CoordinatorView } from './views/CoordinatorView';
import { PresidentView } from './views/PresidentView';

function AppContent() {
  const { currentUser } = useApp();

  const getDefaultTab = (role) => {
    if (role === 'president') return 'president';
    if (role === 'coordinator') return 'coordinator';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTab(currentUser?.role));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [selectedClubForModal, setSelectedClubForModal] = useState(null);

  // When currentUser changes (e.g. login or role switch), set appropriate default tab
  useEffect(() => {
    if (currentUser) {
      setActiveTab(getDefaultTab(currentUser.role));
    }
  }, [currentUser?.role, currentUser?.id]);

  const handleSelectEventFromDashboard = (event) => {
    setSelectedEventForModal(event);
    setActiveTab('events');
  };

  const handleSelectClubFromDashboard = (club) => {
    setSelectedClubForModal(club);
    setActiveTab('clubs');
  };

  // If user is not authenticated, render Login/Register Auth View
  if (!currentUser) {
    return (
      <>
        <AuthView />
        <ToastContainer />
      </>
    );
  }

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
            <ClubsView
              initialSelectedClub={selectedClubForModal}
              onClearSelectedClub={() => setSelectedClubForModal(null)}
            />
          )}

          {activeTab === 'events' && (
            <EventsView
              initialSelectedEvent={selectedEventForModal}
              onClearSelectedEvent={() => setSelectedEventForModal(null)}
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

          {activeTab === 'president' && (
            <PresidentView />
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
