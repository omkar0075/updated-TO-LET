
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Property } from '../types';

interface WishlistProps {
  onPropertyClick: (id: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onPropertyClick }) => {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const list = await api.getWishlist();
    setItems(list);
    setLoading(false);
  };

  const remove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.toggleWishlist(id);
    loadWishlist();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center">
          <i className="fa-solid fa-heart text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-500">Accommodations you've saved for later</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-heart-crack text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Start exploring and save your favorite rooms here!</p>
          <a href="#search" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">Browse Listings</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(prop => (
            <div 
              key={prop.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition group cursor-pointer"
              onClick={() => onPropertyClick(prop.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={prop.images[0]} alt={prop.roomType} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <button 
                  onClick={(e) => remove(prop.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-pink-600 shadow-md hover:bg-pink-600 hover:text-white transition"
                >
                  <i className="fa-solid fa-heart text-xs"></i>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{prop.roomType}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{prop.address}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 font-bold">₹{prop.rent}</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase tracking-tighter">{prop.propertyType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
