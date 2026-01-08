
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Property, PropertyType, User, UserRole } from '../types';

interface LandingProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onPropertyClick: (id: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ user, onNavigate, onPropertyClick }) => {
  const [featured, setFeatured] = useState<Property[]>([]);

  useEffect(() => {
    api.getProperties().then(props => setFeatured(props.slice(0, 3)));
  }, []);

  const handleListProperty = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    if (user.role === UserRole.TENANT) {
      onNavigate('add-property');
    } else if (user.role === UserRole.SEEKER) {
      const confirmSwitch = window.confirm("You are currently registered as a Seeker. Would you like to switch to a Property Owner account to list your room?");
      if (confirmSwitch) {
        await api.updateProfile({ role: UserRole.TENANT });
        onNavigate('add-property');
      }
    } else {
      onNavigate('role-selection');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative bg-blue-600 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Your Perfect Stay, <br/><span className="text-blue-200 underline decoration-blue-300">Just a Click Away</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
              Connect directly with verified owners. No broker, no hassle. Tailored for students and young professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => onNavigate('search')}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition transform"
              >
                Find Accommodation
              </button>
              <button 
                onClick={handleListProperty}
                className="bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg border border-blue-500 hover:bg-blue-800 transition"
              >
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Categories */}
      <section className="py-12 bg-white -mt-10 relative z-10 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 border rounded-xl hover:border-blue-500 cursor-pointer transition" onClick={() => onNavigate('search')}>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg">
              <i className="fa-solid fa-bed text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold">Rooms</h4>
              <p className="text-xs text-gray-500">Single & Shared</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 border rounded-xl hover:border-blue-500 cursor-pointer transition" onClick={() => onNavigate('search')}>
            <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-lg">
              <i className="fa-solid fa-building-user text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold">PG / Hostels</h4>
              <p className="text-xs text-gray-500">Boys & Girls</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 border rounded-xl hover:border-blue-500 cursor-pointer transition" onClick={() => onNavigate('search')}>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 flex items-center justify-center rounded-lg">
              <i className="fa-solid fa-house-chimney text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold">Apartments</h4>
              <p className="text-xs text-gray-500">1BHK & Flats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Listings</h2>
            <p className="text-gray-600">Handpicked accommodations near top universities</p>
          </div>
          <button onClick={() => onNavigate('search')} className="text-blue-600 font-semibold hover:underline">View All <i className="fa-solid fa-arrow-right ml-1"></i></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map(prop => (
            <div 
              key={prop.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition group cursor-pointer"
              onClick={() => onPropertyClick(prop.id)}
            >
              <div className="relative h-56 overflow-hidden">
                <img src={prop.images[0]} alt={prop.roomType} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {prop.propertyType.replace('_', ' ')}
                </div>
                {prop.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center shadow-lg" title="Verified">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
                  ₹{prop.rent} <span className="text-[10px] font-normal opacity-80">/ month</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{prop.roomType}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-1"><i className="fa-solid fa-location-dot mr-1"></i> {prop.address}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex space-x-3 text-gray-400 text-xs">
                    <span><i className="fa-solid fa-wifi mr-1"></i> WiFi</span>
                    <span><i className="fa-solid fa-fan mr-1"></i> AC</span>
                  </div>
                  <button className="text-blue-600 font-bold text-sm">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why TO-LET?</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-shield-halved text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg mb-2">Verified Listings</h4>
              <p className="text-gray-500 text-sm">Every property is manually checked to ensure safety and quality.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-map-location-dot text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg mb-2">Smart Maps</h4>
              <p className="text-gray-500 text-sm">Find rooms exactly where you need them with our interactive radius search.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-comments text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg mb-2">Direct Chat</h4>
              <p className="text-gray-500 text-sm">Talk directly to owners. No middleman, no extra brokerage.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-wallet text-2xl"></i>
              </div>
              <h4 className="font-bold text-lg mb-2">Best Prices</h4>
              <p className="text-gray-500 text-sm">Negotiate the best deals for long-term stays directly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
