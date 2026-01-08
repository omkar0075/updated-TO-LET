
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { INDIAN_PHONE_REGEX } from '../constants';

interface ProfileProps {
  user: User;
  onComplete: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    age: user.age || 18,
    gender: user.gender || 'Prefer not',
    permanentAddress: user.permanentAddress || '',
    currentAddress: user.currentAddress || '',
    sameAddress: false
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      if (name === 'sameAddress' && val) {
        updated.currentAddress = updated.permanentAddress;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.phone || !formData.permanentAddress) {
      setError('Required fields are missing');
      return;
    }

    if (!INDIAN_PHONE_REGEX.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian phone number');
      return;
    }

    if (formData.age < 18) {
      setError('You must be at least 18 years old');
      return;
    }

    try {
      await api.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        age: Number(formData.age),
        gender: formData.gender as any,
        permanentAddress: formData.permanentAddress,
        currentAddress: formData.currentAddress,
        profileComplete: true
      });
      onComplete();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-8 py-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-blue-100">Step 2 of 2: We need a few more details to get you started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center font-medium">
              <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name*</label>
              <input 
                type="text" name="fullName" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName} onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number*</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400 font-medium">+91</span>
                <input 
                  type="tel" name="phone" required
                  className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone} onChange={handleChange} placeholder="9876543210"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Age*</label>
              <input 
                type="number" name="age" required min="18"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.age} onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender*</label>
              <select 
                name="gender" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.gender} onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not">Prefer not</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Permanent Address*</label>
            <textarea 
              name="permanentAddress" required rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.permanentAddress} onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" name="sameAddress" id="sameAddress"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.sameAddress} onChange={handleChange}
            />
            <label htmlFor="sameAddress" className="text-sm font-medium text-gray-600">Current address is same as permanent</label>
          </div>

          {!formData.sameAddress && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current/Temporary Address</label>
              <textarea 
                name="currentAddress" rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.currentAddress} onChange={handleChange}
              ></textarea>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg transition"
          >
            Save Profile & Continue
          </button>
        </form>
      </div>
    </div>
  );
};
