
import React, { useState, useEffect, useCallback } from 'react';
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
  const [history, setHistory] = useState<string[]>(['landing']);

  const navigate = useCallback((page: string, reset = false) => {
    if (page === currentPage && !reset) return;
    if (reset) {
      setHistory(['landing', page]);
    } else {
      setHistory(prev => [...prev, page]);
    }
    setCurrentPage(page);
  }, [currentPage]);

  const checkSetupAndNavigate = useCallback((u: User) => {
    if (!u.profileComplete) {
      navigate('profile');
    } else if (u.role === UserRole.NONE) {
      navigate('role-selection');
    } else {
      navigate('landing');
    }
  }, [navigate]);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await api.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        checkSetupAndNavigate(currentUser);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const u = await api.getCurrentUser();
        if (u) {
          setUser(u);
          checkSetupAndNavigate(u);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('landing', true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, checkSetupAndNavigate]);

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousPage = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPage(previousPage);
    } else {
      setCurrentPage('landing');
    }
  };

  const handleLogin = async (email: string, password?: string) => {
    try {
      const u = await api.login(email, password);
      if (u) {
        // Explicitly set user and navigate in case the Supabase listener doesn't trigger 
        // (common in demo mode or certain network conditions)
        setUser(u);
        checkSetupAndNavigate(u);
      }
    } catch (e: any) {
      alert(e.message || "Failed to log in");
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate('landing', true);
  };

  const navigateToProperty = (id: string) => {
    setSelectedPropertyId(id);
    navigate('property-details');
  };

  const renderPage = () => {
    if (loading) return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    switch (currentPage) {
      case 'landing':
        return <Landing user={user} onNavigate={navigate} onPropertyClick={navigateToProperty} />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'role-selection':
        return <RoleSelection user={user} onComplete={() => navigate('landing')} />;
      case 'profile':
        return <Profile user={user!} onComplete={async () => {
          const u = await api.getCurrentUser();
          if (u) {
            setUser(u);
            checkSetupAndNavigate(u);
          }
        }} />;
      case 'search':
        return <Search onPropertyClick={navigateToProperty} />;
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={navigate} onPropertyClick={navigateToProperty} />;
      case 'add-property':
        return <AddProperty user={user!} onComplete={() => navigate('dashboard')} />;
      case 'property-details':
        return <PropertyDetails propertyId={selectedPropertyId!} user={user} onNavigate={navigate} />;
      case 'wishlist':
        return <Wishlist onPropertyClick={navigateToProperty} />;
      default:
        return <Landing user={user} onNavigate={navigate} onPropertyClick={navigateToProperty} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={navigate}
      onBack={handleBack}
      currentPage={currentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
