
import React, { useState, useEffect } from 'react';
import { User, UserRole, Property, AccommodationRequest } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onPropertyClick: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onPropertyClick }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<AccommodationRequest[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (user.role === UserRole.TENANT) {
      api.getProperties().then(all => setProperties(all.filter(p => p.ownerId === user.id)));
      api.getRequests().then(setRequests);
    } else {
      api.getWishlist().then(list => setWishlistCount(list.length));
      api.getRequests().then(setRequests);
    }
  }, [user]);

  if (user.role === UserRole.TENANT) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500">Manage your properties and tenant requests</p>
          </div>
          <button 
            onClick={() => onNavigate('add-property')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:bg-blue-700"
          >
            <i className="fa-solid fa-plus mr-2"></i> Add New Property
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-blue-600 text-sm font-bold uppercase mb-2">Total Listings</div>
            <div className="text-3xl font-black text-gray-900">{properties.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-green-600 text-sm font-bold uppercase mb-2">New Requests</div>
            <div className="text-3xl font-black text-gray-900">{requests.filter(r => r.status === 'new').length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-orange-600 text-sm font-bold uppercase mb-2">Verified</div>
            <div className="text-3xl font-black text-gray-900">{properties.filter(p => p.verified).length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-purple-600 text-sm font-bold uppercase mb-2">Views (Last 30d)</div>
            <div className="text-3xl font-black text-gray-900">124</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold">My Properties</h3>
            {properties.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-2xl border-2 border-dashed">
                <p className="text-gray-400 mb-4">You haven't listed any properties yet.</p>
                <button onClick={() => onNavigate('add-property')} className="text-blue-600 font-bold hover:underline">Get started now</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border flex gap-4">
                    <img src={p.images[0]} className="w-24 h-24 object-cover rounded-lg" alt="" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold truncate">{p.roomType}</h4>
                      <p className="text-xs text-gray-500 mb-2 truncate">{p.address}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">₹{p.rent}</span>
                        <div className="flex space-x-2">
                           <button className="p-1.5 text-gray-400 hover:text-blue-600 transition"><i className="fa-solid fa-pen-to-square"></i></button>
                           <button onClick={() => onPropertyClick(p.id)} className="p-1.5 text-gray-400 hover:text-blue-600 transition"><i className="fa-solid fa-eye"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
             <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
             <div className="bg-white rounded-2xl border shadow-sm divide-y">
               {requests.length > 0 ? requests.slice(0, 5).map(r => (
                 <div key={r.id} className="p-4 flex items-start gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                     <i className="fa-solid fa-user-tag"></i>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-900">New enquiry from Seeker</p>
                     <p className="text-xs text-gray-500 italic mb-1">"{r.message}"</p>
                     <p className="text-[10px] text-gray-400">2 hours ago</p>
                   </div>
                 </div>
               )) : (
                 <p className="p-10 text-center text-gray-400 text-sm">No activity yet</p>
               )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Seeker Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Seeker Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user.fullName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div 
          onClick={() => onNavigate('search')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
            <i className="fa-solid fa-magnifying-glass text-xl"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Find Your Room</h3>
          <p className="text-blue-100 text-sm opacity-80 font-light">Browse thousands of verified student rooms across India.</p>
        </div>
        
        <div 
          onClick={() => onNavigate('wishlist')}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-heart text-xl"></i>
            </div>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">{wishlistCount} Saved</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Your Wishlist</h3>
          <p className="text-gray-500 text-sm font-light">Quick access to the accommodations you loved.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-paper-plane text-xl"></i>
            </div>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">{requests.length} Requests</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Sent Enquiries</h3>
          <p className="text-gray-500 text-sm font-light">Track responses from property owners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-bold mb-6">Recent Enquiries</h3>
          <div className="bg-white rounded-2xl border divide-y overflow-hidden">
            {requests.length > 0 ? requests.map(r => (
              <div key={r.id} className="p-5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">Accommodation Request</h4>
                  <p className="text-xs text-gray-500">Sent on: {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  r.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {r.status}
                </span>
              </div>
            )) : (
              <div className="p-10 text-center text-gray-400">No requests sent yet</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-6">Recommended for You</h3>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
             <p className="text-sm text-blue-800 mb-4">Complete your profile to see tailored recommendations based on your preferences!</p>
             <button onClick={() => onNavigate('search')} className="text-blue-600 font-bold text-sm hover:underline">Explore all listings <i className="fa-solid fa-arrow-right ml-1"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};
