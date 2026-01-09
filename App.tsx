
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { api } from './services/api';
import { supabase } from './services/supabase';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial user check
    const checkUser = async () => {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        if (!currentUser.profileComplete) {
          setCurrentPage('profile');
        } else if (currentUser.role === UserRole.NONE) {
          setCurrentPage('role-selection');
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const u = await api.getCurrentUser();
        setUser(u);
        if (u && !u.profileComplete) setCurrentPage('profile');
        else if (u && u.role === UserRole.NONE) setCurrentPage('role-selection');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentPage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string) => {
    // This is now handled by the supabase auth listener automatically
    // but we can trigger navigation here if needed.
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setCurrentPage('landing');
  };

  const navigateToProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-details');
  };

  const renderPage = () => {
    if (loading) return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    switch (currentPage) {
      case 'landing':
        return <Landing user={user} onNavigate={setCurrentPage} onPropertyClick={navigateToProperty} />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'role-selection':
        return <RoleSelection user={user} onComplete={() => setCurrentPage('landing')} />;
      case 'profile':
        return <Profile user={user!} onComplete={async () => {
          const u = await api.getCurrentUser();
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
