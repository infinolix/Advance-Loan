import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Building, Briefcase, DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const EmployeeProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    position: user?.position || '',
    salary: user?.salary ? user.salary.toString() : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      const success = await updateUserProfile({
        name: formData.name,
        department: formData.department,
        position: formData.position,
        salary: formData.salary ? parseFloat(formData.salary) : undefined
      });
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating your profile');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      position: user?.position || '',
      salary: user?.salary ? user.salary.toString() : ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-6 animate-slide-up">
          <CheckCircle size={20} className="mr-2" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-6 animate-slide-up">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="card bg-white flex flex-col items-center p-8">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl mb-4">
                {user?.name.charAt(0)}
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
            <p className="text-gray-500 mb-4">{user?.position}</p>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary w-full"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="card bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEdit}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : null}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="input pl-10"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled
                      className="input pl-10 bg-gray-50"
                      value={formData.email}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email address cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      className="input pl-10"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      className="input pl-10"
                      value={formData.position}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                    Monthly Salary
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="salary"
                      name="salary"
                      type="number"
                      min="1"
                      step="any"
                      className="input pl-10"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Full Name
                    </span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email Address
                    </span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Department
                    </span>
                    <span className="font-medium">{user?.department || '—'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      Position
                    </span>
                    <span className="font-medium">{user?.position || '—'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Monthly Salary
                    </span>
                    <span className="font-medium">
                      {user?.salary ? `$${user.salary.toLocaleString()}` : '—'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Join Date
                    </span>
                    <span className="font-medium">
                      {user?.joinDate ? format(new Date(user.joinDate), 'MMMM d, yyyy') : '—'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;