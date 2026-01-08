
import React from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface RoleSelectionProps {
  user: User | null;
  onComplete: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ user, onComplete }) => {
  const handleSelectRole = async (role: UserRole) => {
    try {
      await api.updateProfile({ role });
      onComplete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How would you like to use TO-LET?</h1>
      <p className="text-gray-500 text-lg mb-12">Choose your primary role. You can change this later in settings.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={() => handleSelectRole(UserRole.SEEKER)}
          className="bg-white border-2 border-transparent hover:border-blue-500 rounded-3xl p-10 shadow-xl cursor-pointer transition transform hover:-translate-y-2 group"
        >
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition">
            <i className="fa-solid fa-user-graduate text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-4">I am a Seeker</h2>
          <p className="text-gray-500 mb-8 font-light">
            I am looking for a room, hostel, or flat share. I want to browse listings and connect with owners.
          </p>
          <button className="bg-blue-100 text-blue-700 px-8 py-3 rounded-full font-bold group-hover:bg-blue-600 group-hover:text-white transition">
            Select Seeker
          </button>
        </div>

        <div 
          onClick={() => handleSelectRole(UserRole.TENANT)}
          className="bg-white border-2 border-transparent hover:border-blue-500 rounded-3xl p-10 shadow-xl cursor-pointer transition transform hover:-translate-y-2 group"
        >
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-green-600 group-hover:text-white transition">
            <i className="fa-solid fa-house-user text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-4">I am a property Owner</h2>
          <p className="text-gray-500 mb-8 font-light">
            I want to list my property, manage room vacancies, and receive accommodation requests from students.
          </p>
          <button className="bg-green-100 text-green-700 px-8 py-3 rounded-full font-bold group-hover:bg-green-600 group-hover:text-white transition">
            Select Owner
          </button>
        </div>
      </div>
    </div>
  );
};
