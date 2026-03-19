import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TurfList from './pages/TurfList';
import TurfDetail from './pages/TurfDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
// Owner Pages
import OwnerLayout from './pages/owner/OwnerLayout';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerVenues from './pages/owner/Venues';
import OwnerBookings from './pages/owner/Bookings';
import OwnerAnalytics from './pages/owner/Analytics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/turfs" element={<TurfList />} />
              <Route path="/turfs/:id" element={<TurfDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/booking/:id"
                element={
                  <PrivateRoute>
                    <Booking />
                  </PrivateRoute>
                }
              />
              <Route
                path="/owner/*"
                element={
                  <PrivateRoute roles={['owner', 'admin']}>
                    <Routes>
                      <Route path="/" element={<OwnerLayout title="Dashboard"><OwnerDashboard /></OwnerLayout>} />
                      <Route path="/venues" element={<OwnerLayout title="My Turfs"><OwnerVenues /></OwnerLayout>} />
                      <Route path="/bookings" element={<OwnerLayout title="Bookings"><OwnerBookings /></OwnerLayout>} />
                      <Route path="/analytics" element={<OwnerLayout title="Analytics"><OwnerAnalytics /></OwnerLayout>} />
                    </Routes>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
