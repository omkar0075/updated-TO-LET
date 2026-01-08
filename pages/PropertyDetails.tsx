
import React, { useEffect, useState } from 'react';
import { Property, User, UserRole } from '../types';
import { api } from '../services/api';
import { MapPicker } from '../components/MapPicker';

interface PropertyDetailsProps {
  propertyId: string;
  user: User | null;
  onNavigate: (page: string) => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyId, user, onNavigate }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    api.getProperties().then(props => {
      const p = props.find(item => item.id === propertyId);
      setProperty(p || null);
      setLoading(false);
    });

    if (user) {
      api.getWishlist().then(list => {
        setIsWishlisted(list.some(i => i.id === propertyId));
      });
    }
  }, [propertyId, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    const result = await api.toggleWishlist(propertyId);
    setIsWishlisted(result);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNavigate('auth');
      return;
    }
    if (!message) return;
    
    await api.sendRequest(propertyId, property!.ownerId, message);
    setSent(true);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!property) return <div className="h-screen flex items-center justify-center">Property not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 rounded-3xl overflow-hidden h-[400px]">
            <img src={property.images[0]} className="h-full w-full object-cover" alt="" />
            <div className="grid grid-rows-2 gap-4">
              <img src={property.images[1] || 'https://picsum.photos/seed/alt/600/400'} className="h-full w-full object-cover" alt="" />
              <div className="relative h-full w-full">
                <img src={property.images[2] || 'https://picsum.photos/seed/alt2/600/400'} className="h-full w-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold cursor-pointer">View All Photos</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{property.propertyType.replace('_', ' ')}</span>
                {property.verified && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"><i className="fa-solid fa-check mr-1"></i> Verified</span>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.roomType}</h1>
              <p className="text-gray-500"><i className="fa-solid fa-location-dot mr-1"></i> {property.address}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">₹{property.rent}</div>
              <p className="text-sm text-gray-500">Per Month</p>
            </div>
          </div>

          <div className="border-y py-8 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><i className="fa-solid fa-wifi"></i></div>
              <span className="text-sm font-medium">Free WiFi</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><i className="fa-solid fa-fan"></i></div>
              <span className="text-sm font-medium">Air Conditioned</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><i className="fa-solid fa-utensils"></i></div>
              <span className="text-sm font-medium">Kitchen</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><i className="fa-solid fa-shirt"></i></div>
              <span className="text-sm font-medium">Laundry</span>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">{property.description || 'Spacious accommodation perfect for students or working professionals. Located in a safe neighborhood with easy access to public transport and essential services.'}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <div className="h-80 rounded-2xl overflow-hidden border">
              <MapPicker initialCenter={property.coordinates} interactive={false} onLocationSelect={() => {}} />
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Contact Owner</h3>
              <button 
                onClick={handleToggleWishlist}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isWishlisted ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400 hover:text-pink-600'}`}
              >
                <i className={`fa-solid fa-heart ${isWishlisted ? 'animate-bounce' : ''}`}></i>
              </button>
            </div>

            {sent ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center">
                <i className="fa-solid fa-circle-check text-4xl mb-4"></i>
                <h4 className="font-bold mb-2">Request Sent!</h4>
                <p className="text-sm">The owner has been notified. You'll hear from them soon in your dashboard.</p>
                <button onClick={() => onNavigate('dashboard')} className="mt-4 text-sm font-bold underline">Go to Dashboard</button>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                  <textarea 
                    className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-32"
                    placeholder="Hi, I'm interested in this room. Is it still available?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg"
                >
                  Send Enquiry
                </button>
                <p className="text-[10px] text-gray-400 text-center px-4">By sending an enquiry, you agree to our safety guidelines for seekers.</p>
              </form>
            )}

            <div className="mt-8 pt-8 border-t">
              <h4 className="font-bold text-sm mb-4">Safety Tips</h4>
              <ul className="text-xs text-gray-500 space-y-2">
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i> Always visit the property before paying</li>
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i> Meet the owner in a public place if possible</li>
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i> Request to see valid ownership documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
