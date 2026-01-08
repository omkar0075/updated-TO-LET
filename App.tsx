
import React, { useState, useEffect } from 'react';
import { User, UserRole, Property } from './types';
import { api } from './services/api';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { RoleSelection } from './pages/RoleSelection';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Dashboard } from './pages/Dashboard';
import { AddProperty } from './pages/AddProperty';
import { PropertyDetails } from './pages/PropertyDetails';
import { Wishlist } from './pages/Wishlist';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const current = api.getCurrentUser();
    if (current) {
      setUser(current);
      if (!current.profileComplete) {
        setCurrentPage('profile');
      } else if (current.role === UserRole.NONE) {
        setCurrentPage('role-selection');
      }
    }
  }, []);

  const handleLogin = async (email: string) => {
    const loggedUser = await api.login(email);
    setUser(loggedUser);
    if (!loggedUser.profileComplete) {
      setCurrentPage('profile');
    } else if (loggedUser.role === UserRole.NONE) {
      setCurrentPage('role-selection');
    } else {
      setCurrentPage('landing');
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentPage('landing');
  };

  const navigateToProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-details');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing user={user} onNavigate={setCurrentPage} onPropertyClick={navigateToProperty} />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'role-selection':
        return <RoleSelection user={user} onComplete={() => setCurrentPage('landing')} />;
      case 'profile':
        return <Profile user={user!} onComplete={() => {
          const u = api.getCurrentUser();
          setUser(u);
          if (u?.role === UserRole.NONE) setCurrentPage('role-selection');
          else setCurrentPage('landing');
        }} />;
      case 'search':
        return <Search onPropertyClick={navigateToProperty} />;
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={setCurrentPage} onPropertyClick={navigateToProperty} />;
      case 'add-property':
        return <AddProperty user={user!} onComplete={() => setCurrentPage('dashboard')} />;
      case 'property-details':
        return <PropertyDetails propertyId={selectedPropertyId!} user={user} onNavigate={setCurrentPage} />;
      case 'wishlist':
        return <Wishlist onPropertyClick={navigateToProperty} />;
      default:
        return <Landing user={user} onNavigate={setCurrentPage} onPropertyClick={navigateToProperty} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={setCurrentPage}
      currentPage={currentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
