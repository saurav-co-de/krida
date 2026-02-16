import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-wider">KRIDA</h3>
            <p className="text-sm text-gray-400">
              Your premier destination for booking elite sports venues and connecting with the community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/turfs" className="hover:text-orange-500 transition-colors">Browse Turfs</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-orange-500 transition-colors">My Bookings</Link>
              </li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Sports</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/turfs?sport=cricket" className="hover:text-orange-500 transition-colors">Cricket</Link>
              </li>
              <li>
                <Link to="/turfs?sport=badminton" className="hover:text-orange-500 transition-colors">Badminton</Link>
              </li>
              <li>
                <Link to="/turfs?sport=tennis" className="hover:text-orange-500 transition-colors">Tennis</Link>
              </li>
              <li>
                <Link to="/turfs?sport=football" className="hover:text-orange-500 transition-colors">Football</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@krida.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Bangalore, Karnataka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} KRIDA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
