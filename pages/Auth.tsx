
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // In this mock, we just trigger the login
    onLogin(email);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fa-solid fa-house-chimney text-3xl"></i>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-gray-500 mt-2">{isLogin ? 'Please enter your details to login' : 'Step 1 of 2: Basic details'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition transform hover:-translate-y-0.5"
            >
              {isLogin ? 'Login' : 'Continue'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms & Privacy Policy.
        </div>
      </div>
    </div>
  );
};
