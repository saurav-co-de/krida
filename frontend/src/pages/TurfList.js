import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import { turfService } from '../services/api';

const TurfList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const sports = [
    { value: 'all', label: 'All Sports' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'football', label: 'Football' },
  ];

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    filterTurfs();
  }, [selectedSport, searchQuery, turfs]);

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      const response = await turfService.getAllTurfs();
      setTurfs(response.data);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTurfs = () => {
    let filtered = turfs;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter((turf) => turf.sport === selectedSport);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (turf) =>
          turf.name.toLowerCase().includes(query) ||
          turf.location.toLowerCase().includes(query) ||
          turf.description.toLowerCase().includes(query)
      );
    }

    setFilteredTurfs(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Browse Sports Turfs
          </h1>
          <p className="text-gray-600">
            Find and book the perfect venue for your next game
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Sport Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                {sports.map((sport) => (
                  <option key={sport.value} value={sport.value}>
                    {sport.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredTurfs.length} {filteredTurfs.length === 1 ? 'turf' : 'turfs'} found
            </span>
            {(selectedSport !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSport('all');
                  setSearchQuery('');
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Turfs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading turfs...</p>
          </div>
        ) : filteredTurfs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No turfs found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedSport('all');
                setSearchQuery('');
              }}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Clear filters to see all turfs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTurfs.map((turf) => (
              <div
                key={turf.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer animate-slideUp"
                onClick={() => navigate(`/turfs/${turf.id}`)}
              >
                <div className="relative">
                  <img
                    src={turf.image}
                    alt={turf.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center shadow-md">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-semibold text-gray-800">{turf.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-600 rounded-full uppercase">
                      {turf.sport}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{turf.name}</h3>
                  <p className="text-gray-600 flex items-center mb-4">
                    <FaMapMarkerAlt className="mr-2 text-green-600 flex-shrink-0" />
                    <span className="truncate">{turf.location}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {turf.facilities.slice(0, 3).map((facility, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                    {turf.facilities.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{turf.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{turf.pricePerHour}
                      </span>
                      <span className="text-sm text-gray-500">/hour</span>
                    </div>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfList;
