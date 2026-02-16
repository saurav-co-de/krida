import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaStar, FaSearch, FaCheckCircle } from 'react-icons/fa';
import { GiCricketBat, GiTennisRacket, GiSoccerBall } from 'react-icons/gi';
import { MdSportsTennis } from 'react-icons/md';
import { turfService, statsService } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [turfsResponse, statsResponse] = await Promise.all([
        turfService.getAllTurfs(),
        statsService.getStats()
      ]);

      // Get top 3 featured turfs (highest rated)
      const featured = turfsResponse.data
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      setFeaturedTurfs(featured);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sports = [
    { name: 'Cricket', icon: GiCricketBat, color: 'text-blue-600', bg: 'bg-blue-50', filter: 'cricket' },
    { name: 'Badminton', icon: MdSportsTennis, color: 'text-green-600', bg: 'bg-green-50', filter: 'badminton' },
    { name: 'Tennis', icon: GiTennisRacket, color: 'text-yellow-600', bg: 'bg-yellow-50', filter: 'tennis' },
    { name: 'Football', icon: GiSoccerBall, color: 'text-red-600', bg: 'bg-red-50', filter: 'football' },
  ];

  const features = [
    { icon: FaSearch, title: 'Easy Search', description: 'Find the perfect turf in seconds' },
    { icon: FaClock, title: 'Instant Booking', description: 'Book your slot instantly online' },
    { icon: FaCheckCircle, title: 'Verified Venues', description: 'All turfs are verified and quality checked' },
    { icon: FaStar, title: 'Best Prices', description: 'Competitive pricing across all venues' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-red-900 to-orange-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slideUp tracking-tight">
              Unleash Your <span className="text-orange-500">Sporting Spirit</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200">
              Book the Best Turfs • Compete • Conquer
            </p>
            <button
              onClick={() => navigate('/turfs')}
              className="bg-orange-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-2xl mr-4"
            >
              Explore Venues
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-black transition-all transform hover:scale-105"
            >
              My Bookings
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl font-bold">{stats.totalTurfs}+</div>
                <div className="text-orange-200 mt-2">Elite Venues</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl font-bold">{stats.totalBookings}+</div>
                <div className="text-orange-200 mt-2">Games Played</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl font-bold">4</div>
                <div className="text-orange-200 mt-2">Sports</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-orange-200 mt-2">Support</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Choose Your Sport
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sports.map((sport) => {
              const Icon = sport.icon;
              return (
                <button
                  key={sport.name}
                  onClick={() => navigate(`/turfs?sport=${sport.filter}`)}
                  className={`${sport.bg} p-8 rounded-xl text-center hover:shadow-xl transition-all transform hover:scale-105 card-hover`}
                >
                  <Icon className={`${sport.color} text-5xl mx-auto mb-4`} />
                  <h3 className="font-semibold text-lg text-gray-800">{sport.name}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Top Rated Turfs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              </div>
            ) : (
              featuredTurfs.map((turf) => (
                <div
                  key={turf.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer"
                  onClick={() => navigate(`/turfs/${turf.id}`)}
                >
                  <img
                    src={turf.image}
                    alt={turf.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-600 rounded-full uppercase">
                        {turf.sport}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <FaStar className="mr-1" />
                        <span className="font-semibold">{turf.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{turf.name}</h3>
                    <p className="text-gray-600 flex items-center mb-4">
                      <FaMapMarkerAlt className="mr-2 text-orange-600" />
                      {turf.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{turf.pricePerHour}
                        <span className="text-sm text-gray-500">/hour</span>
                      </span>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-bold shadow-md">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose KRIDA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-all">
                    <Icon className="text-orange-600 group-hover:text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
            Elevate Your Game Today
          </h2>
          <p className="text-2xl mb-10 text-orange-50 font-medium">
            Join the KRIDA community and dominate the field
          </p>
          <button
            onClick={() => navigate('/turfs')}
            className="bg-white text-orange-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-black hover:text-white transition-all transform hover:scale-110 shadow-2xl"
          >
            Find Your Match
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
