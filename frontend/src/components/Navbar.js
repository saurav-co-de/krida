import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaList, FaUserAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1">
                <img src={logo} alt="KRIDA Logo" className="h-10 w-auto" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent tracking-wider">
                KRIDA
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors font-semibold">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/turfs" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors font-semibold">
              <FaList />
              <span>Browse Turfs</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors font-semibold">
                  <FaUserAlt className="text-orange-600" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-md transform hover:scale-105 active:scale-95 text-sm font-bold"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors font-semibold">
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-md font-bold text-sm"
                >
                  <div className="flex items-center space-x-1">
                    <FaUserPlus />
                    <span>Join Now</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={toggleMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link
              to="/turfs"
              onClick={toggleMenu}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <FaList />
              <span>Browse Turfs</span>
            </Link>

            <div className="border-t border-gray-100 my-2 pt-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <FaUserAlt className="text-orange-600" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="flex justify-start items-center space-x-2 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors font-bold"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={toggleMenu}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md mt-2 font-bold"
                  >
                    <FaUserPlus />
                    <span>Join Now</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
