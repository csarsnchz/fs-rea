import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Search, User, LogOut, PlusSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RealEstate</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/explore"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                <Search className="h-5 w-5 mr-1" />
                Explore
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusSquare className="h-5 w-5 mr-1" />
                  Create Listing
                </Link>
                <Link
                  to="/profile"
                  className="ml-4 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-1" />
                  {user?.full_name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}