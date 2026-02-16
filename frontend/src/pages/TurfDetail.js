import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaClock, FaUsers, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { turfService } from '../services/api';
import { toast } from 'react-toastify';

const TurfDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurf();
  }, [id]);

  const fetchTurf = async () => {
    try {
      setLoading(true);
      const response = await turfService.getTurf(id);
      setTurf(response.data);
    } catch (error) {
      console.error('Error fetching turf:', error);
      toast.error('Failed to load turf details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading turf details...</p>
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Turf not found</p>
          <button
            onClick={() => navigate('/turfs')}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Turfs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/turfs')}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Turfs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={turf.image}
                alt={turf.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block text-xs font-semibold px-3 py-1 bg-green-100 text-green-600 rounded-full uppercase mb-3">
                    {turf.sport}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800">{turf.name}</h1>
                </div>
                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                  <FaStar className="text-yellow-500 mr-2" />
                  <span className="font-bold text-gray-800">{turf.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 flex items-center mb-6">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                {turf.location}
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">{turf.description}</p>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaClock className="text-green-600 text-xl" />
                  <div>
                    <div className="text-sm text-gray-500">Timing</div>
                    <div className="font-semibold text-gray-800">
                      {turf.openTime} - {turf.closeTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                  <div>
                    <div className="text-sm text-gray-500">Capacity</div>
                    <div className="font-semibold text-gray-800">{turf.capacity} players</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <span className="text-green-600 text-2xl font-bold">₹</span>
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-semibold text-gray-800">₹{turf.pricePerHour}/hour</div>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {turf.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ₹{turf.pricePerHour}
                  <span className="text-lg text-gray-500 font-normal">/hour</span>
                </div>
                <p className="text-sm text-gray-600">Best price guaranteed</p>
              </div>

              <button
                onClick={() => navigate(`/booking/${turf.id}`)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg mb-4"
              >
                Book Now
              </button>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Operating Hours</span>
                  <span className="font-semibold text-gray-800">
                    {turf.openTime} - {turf.closeTime}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-semibold text-gray-800">{turf.capacity} players</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-semibold text-gray-800">{turf.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  💯 100% Secure Payment • 🔄 Free Cancellation up to 2 hours before
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfDetail;
