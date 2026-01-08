
import React, { useState, useEffect } from 'react';
import { MapPicker } from '../components/MapPicker';
import { api } from '../services/api';
import { Property, PropertyType, Coordinates } from '../types';

interface SearchProps {
  onPropertyClick: (id: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onPropertyClick }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProps, setFilteredProps] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: 0,
    maxPrice: 20000,
    radius: 5,
    center: { lat: 18.5204, lng: 73.8567 } // Pune center
  });

  useEffect(() => {
    api.getProperties().then(setProperties);
  }, []);

  useEffect(() => {
    let result = properties;
    if (filters.type) result = result.filter(p => p.propertyType === filters.type);
    result = result.filter(p => p.rent >= filters.minPrice && p.rent <= filters.maxPrice);
    
    // Radius filter (simplified)
    const getDistance = (c1: Coordinates, c2: Coordinates) => {
       const R = 6371; // Earth radius in km
       const dLat = (c2.lat - c1.lat) * Math.PI / 180;
       const dLng = (c2.lng - c1.lng) * Math.PI / 180;
       const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) *
                 Math.sin(dLng/2) * Math.sin(dLng/2);
       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
       return R * c;
    };

    result = result.filter(p => getDistance(p.coordinates, filters.center) <= filters.radius);

    setFilteredProps(result);
  }, [filters, properties]);

  const handleLocationSelect = (coords: Coordinates) => {
    setFilters(prev => ({ ...prev, center: coords }));
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-80 bg-white border-r overflow-y-auto p-6 z-10 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
          <span>Filters</span>
          <button 
            className="text-xs text-blue-600 font-bold hover:underline"
            onClick={() => setFilters({ type: '', minPrice: 0, maxPrice: 20000, radius: 5, center: { lat: 18.5204, lng: 73.8567 } })}
          >
            Clear All
          </button>
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
            <select 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="ROOM">Individual Room</option>
              <option value="HOSTEL_PG">PG / Hostel</option>
              <option value="APARTMENT">Full Apartment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (₹0 - ₹{filters.maxPrice})</label>
            <input 
              type="range" 
              min="0" max="50000" step="500"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius ({filters.radius} km)</label>
            <input 
              type="range" 
              min="1" max="20" step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={filters.radius}
              onChange={(e) => setFilters(prev => ({ ...prev, radius: Number(e.target.value) }))}
            />
          </div>

          <div className="h-48 rounded-xl overflow-hidden border">
            <MapPicker initialCenter={filters.center} onLocationSelect={handleLocationSelect} />
          </div>
          <p className="text-[10px] text-gray-400 text-center">Drag or search map to set search center</p>
        </div>
      </aside>

      {/* Results Content */}
      <section className="flex-grow flex flex-col bg-gray-50">
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <span className="text-gray-600 font-medium">Found <span className="text-blue-600 font-bold">{filteredProps.length}</span> results</span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              <i className="fa-solid fa-table-cells mr-1"></i> Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition ${viewMode === 'map' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              <i className="fa-solid fa-map mr-1"></i> Map
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProps.map(prop => (
                <div 
                  key={prop.id} 
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => onPropertyClick(prop.id)}
                >
                  <div className="relative h-48">
                    <img src={prop.images[0]} alt={prop.roomType} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600">{prop.propertyType}</div>
                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">₹{prop.rent}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 truncate">{prop.roomType}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1"><i className="fa-solid fa-location-dot mr-1"></i> {prop.address}</p>
                    <div className="flex items-center space-x-2 mt-4">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">Wifi</span>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">Laundry</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProps.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">No properties found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search radius</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full rounded-2xl overflow-hidden border shadow-lg">
               <MapPicker 
                 initialCenter={filters.center} 
                 interactive={true} 
                 onLocationSelect={handleLocationSelect}
               />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
