import React, { useState, useEffect } from 'react';
import { 
  Edit2, 
  Plus, 
  Search,
  Check,
  X,
  Trash2,
  Activity
} from 'lucide-react';
import { ownerService } from '../../services/api';
import { toast } from 'react-toastify';

const VenueCard = ({ turf, isSelected, onClick }) => (
  <div 
    onClick={() => onClick(turf)}
    className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
      isSelected ? "border-[#f05a28] ring-1 ring-[#f05a28]" : "border-slate-200 hover:border-[#f05a28]/50"
    }`}
  >
    <img className="w-16 h-16 rounded-lg object-cover" src={turf.image} alt={turf.name} />
    <div className="flex-1">
      <h4 className="font-bold text-slate-900">{turf.name}</h4>
      <p className="text-sm text-slate-500">₹{turf.pricePerHour}/hour</p>
    </div>
    <div className={isSelected ? "text-[#f05a28]" : "text-slate-300"}>
      <Edit2 size={18} />
    </div>
  </div>
);

const Venues = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    sport: 'football',
    location: '',
    pricePerHour: '',
    capacity: '',
    description: '',
    image: '',
    openTime: '06:00',
    closeTime: '23:00',
    isActive: true
  });

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const res = await ownerService.getTurfs();
      setTurfs(res.data);
      if (res.data.length > 0 && !selectedTurf) {
        handleSelectTurf(res.data[0]);
      }
    } catch (err) {
      toast.error('Failed to fetch turfs');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTurf = (turf) => {
    setSelectedTurf(turf);
    setFormData({
      name: turf.name,
      sport: turf.sport,
      location: turf.location,
      pricePerHour: turf.pricePerHour,
      capacity: turf.capacity,
      description: turf.description,
      image: turf.image,
      openTime: turf.openTime,
      closeTime: turf.closeTime,
      isActive: turf.isActive
    });
    setIsEditing(false);
  };

  const handleNewTurf = () => {
    setSelectedTurf(null);
    setFormData({
      name: '',
      sport: 'football',
      location: '',
      pricePerHour: '',
      capacity: '',
      description: '',
      image: '',
      openTime: '06:00',
      closeTime: '23:00',
      isActive: true
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTurf) {
        await ownerService.updateTurf(selectedTurf._id, formData);
        toast.success('Turf updated successfully');
      } else {
        await ownerService.createTurf(formData);
        toast.success('Turf created successfully');
      }
      fetchTurfs();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save turf');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this turf?')) return;
    try {
      await ownerService.deleteTurf(selectedTurf._id);
      toast.success('Turf deleted');
      setSelectedTurf(null);
      fetchTurfs();
    } catch (err) {
      toast.error('Failed to delete turf');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#f05a28]">My Turfs</h2>
          <p className="text-slate-500">Manage your venues, pricing, and availability.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Venue List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Venue List</h3>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {turfs.map(turf => (
              <VenueCard 
                key={turf._id} 
                turf={turf} 
                isSelected={selectedTurf?._id === turf._id} 
                onClick={handleSelectTurf}
              />
            ))}
            {turfs.length === 0 && (
              <p className="text-slate-500 italic text-center py-8">No turfs added yet.</p>
            )}
          </div>
          
          <button 
            onClick={handleNewTurf}
            className="w-full py-3 mt-4 bg-[#f05a28] hover:bg-[#f05a28]/90 text-white rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-[#f05a28]/20"
          >
            <Plus size={18} />
            Add New Turf
          </button>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {(selectedTurf || isEditing) ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {isEditing ? 'Add New Turf' : `Edit: ${selectedTurf.name}`}
                </h3>
                <div className="flex items-center gap-4">
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                    >
                      Edit Mode
                    </button>
                  )}
                  {selectedTurf && (
                    <button 
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Turf Name</label>
                    <input 
                      name="name"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="text" 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Sport</label>
                    <select 
                      name="sport"
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70"
                      value={formData.sport}
                      onChange={handleChange}
                    >
                      <option value="football">Football</option>
                      <option value="cricket">Cricket</option>
                      <option value="tennis">Tennis</option>
                      <option value="badminton">Badminton</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input 
                      name="location"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="text" 
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Price per Hour (₹)</label>
                    <input 
                      name="pricePerHour"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="number" 
                      value={formData.pricePerHour}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Capacity</label>
                    <input 
                      name="capacity"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="number" 
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Image URL</label>
                    <input 
                      name="image"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="text" 
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Open Time</label>
                    <input 
                      name="openTime"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="time" 
                      value={formData.openTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Close Time</label>
                    <input 
                      name="closeTime"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      type="time" 
                      value={formData.closeTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                      name="description"
                      required
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#f05a28] focus:border-[#f05a28] outline-none disabled:opacity-70" 
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="isActive" 
                      name="isActive"
                      disabled={!isEditing}
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#f05a28]"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">Active / Open for bookings</label>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-2.5 bg-[#f05a28] text-white font-bold text-sm rounded-lg hover:bg-[#f05a28]/90 shadow-lg shadow-[#f05a28]/20 transition-all"
                    >
                      {selectedTurf ? 'Update Turf' : 'Create Turf'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <Activity className="mx-auto mb-4 opacity-20" size={64} />
              <p className="text-lg font-medium">Select a turf from the list to view or edit details</p>
              <p className="text-sm mt-1">Or click 'Add New Turf' to create a new listing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venues;
