
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                <i className="fa-solid fa-house-chimney text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-blue-600 tracking-tight">TO-LET</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => onNavigate('landing')} 
                className={`text-sm font-medium ${currentPage === 'landing' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('search')} 
                className={`text-sm font-medium ${currentPage === 'search' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Find Rooms
              </button>
              
              {user ? (
                <>
                  <button 
                    onClick={() => onNavigate('dashboard')} 
                    className={`text-sm font-medium ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Dashboard
                  </button>
                  <div className="flex items-center space-x-4">
                    <button className="relative p-2 text-gray-500 hover:text-blue-600">
                      <i className="fa-solid fa-bell text-lg"></i>
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button 
                      onClick={() => onNavigate('profile')} 
                      className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{user.fullName || 'User'}</span>
                    </button>
                    <button onClick={onLogout} className="text-gray-400 hover:text-red-500">
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => onNavigate('auth')} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Login / Signup
                </button>
              )}
            </div>

            <div className="md:hidden">
               <button className="text-gray-600 p-2">
                 <i className="fa-solid fa-bars text-xl"></i>
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-800 pb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white p-1 rounded mr-2">
                  <i className="fa-solid fa-house-chimney"></i>
                </div>
                <span className="text-xl font-bold text-white">TO-LET</span>
              </div>
              <p className="text-gray-400 text-sm">India's leading accommodation platform for students and young professionals.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Seekers</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-blue-500">Search Rooms</a></li>
                <li><a href="#" className="hover:text-blue-500">PGs & Hostels</a></li>
                <li><a href="#" className="hover:text-blue-500">Apartments</a></li>
                <li><a href="#" className="hover:text-blue-500">Wishlist</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Owners</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-blue-500">List Property</a></li>
                <li><a href="#" className="hover:text-blue-500">Manage Listings</a></li>
                <li><a href="#" className="hover:text-blue-500">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-500">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><i className="fa-solid fa-envelope mr-2"></i> support@tolet.com</li>
                <li><i className="fa-solid fa-phone mr-2"></i> +91 98765 43210</li>
                <li className="flex space-x-4 mt-4">
                  <i className="fa-brands fa-facebook hover:text-blue-500 cursor-pointer"></i>
                  <i className="fa-brands fa-instagram hover:text-pink-500 cursor-pointer"></i>
                  <i className="fa-brands fa-twitter hover:text-blue-400 cursor-pointer"></i>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-500 text-xs">&copy; {new Date().getFullYear()} TO-LET. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
