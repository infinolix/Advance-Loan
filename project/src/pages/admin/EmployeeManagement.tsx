import React, { useState } from 'react';
import { mockUsers } from '../../data/mockData';
import { format } from 'date-fns';
import {
  Users,
  User,
  Search,
  Plus,
  Edit,
  Trash,
  XCircle,
  AlertCircle,
  CheckCircle,
  Mail,
  Building,
  Briefcase,
  DollarSign,
  Calendar
} from 'lucide-react';

const EmployeeManagement: React.FC = () => {
  // In a real app, we would use the auth context to manage users
  const [employees, setEmployees] = useState([...mockUsers].filter(user => user.role === 'employee'));
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockUsers[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const filteredEmployees = employees.filter(emp => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchTermLower) ||
      emp.email.toLowerCase().includes(searchTermLower) ||
      (emp.department && emp.department.toLowerCase().includes(searchTermLower)) ||
      (emp.position && emp.position.toLowerCase().includes(searchTermLower))
    );
  });

  const handleSelectEmployee = (employee: typeof mockUsers[0]) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  };

  const handleEditEmployee = () => {
    setIsEditing(true);
  };

  const handleDeleteRequest = (employeeId: string) => {
    setDeleteConfirmId(employeeId);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      // Remove employee from list
      setEmployees(prev => prev.filter(emp => emp.id !== deleteConfirmId));
      
      // If the deleted employee was selected, clear selection
      if (selectedEmployee && selectedEmployee.id === deleteConfirmId) {
        setSelectedEmployee(null);
      }
      
      setDeleteConfirmId(null);
      setSuccessMessage('Employee deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save changes to the server
    setIsEditing(false);
    setSuccessMessage('Employee information updated successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '—';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        
        <button
          className="btn-primary flex items-center"
          onClick={() => {
            // In a real app, this would show a form to add a new employee
            setSuccessMessage('This feature is not implemented in the demo');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage('');
            }, 3000);
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Employee
        </button>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-6 animate-slide-up">
          <CheckCircle size={20} className="mr-2" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-6 animate-slide-up">
          <AlertCircle size={20} className="mr-2" />
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee list */}
        <div className="lg:col-span-1">
          <div className="card bg-white mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="card bg-white overflow-hidden">
            <h2 className="text-lg font-medium flex items-center mb-4">
              <Users className="mr-2" size={20} />
              Employees ({filteredEmployees.length})
            </h2>
            
            {filteredEmployees.length > 0 ? (
              <div className="divide-y divide-gray-100 -mx-6">
                {filteredEmployees.map(employee => (
                  <div 
                    key={employee.id}
                    className={`flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                      selectedEmployee?.id === employee.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectEmployee(employee)}
                  >
                    {employee.profileImage ? (
                      <img 
                        src={employee.profileImage} 
                        alt={employee.name}
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                        {employee.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Employees Found</h3>
                <p className="text-gray-500">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Employee details */}
        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="card bg-white">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Employee Details</h2>
                
                <div className="flex space-x-2">
                  <button
                    className="btn-outline flex items-center"
                    onClick={handleEditEmployee}
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  
                  <button
                    className="btn-danger flex items-center"
                    onClick={() => handleDeleteRequest(selectedEmployee.id)}
                  >
                    <Trash size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="flex items-center mb-6">
                    {selectedEmployee.profileImage ? (
                      <img 
                        src={selectedEmployee.profileImage} 
                        alt={selectedEmployee.name}
                        className="h-16 w-16 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl mr-4">
                        {selectedEmployee.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">{selectedEmployee.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          defaultValue={selectedEmployee.name}
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
                          className="input pl-10"
                          defaultValue={selectedEmployee.email}
                        />
                      </div>
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
                          defaultValue={selectedEmployee.department}
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
                          defaultValue={selectedEmployee.position}
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
                          defaultValue={selectedEmployee.salary}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                        Join Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="joinDate"
                          name="joinDate"
                          type="date"
                          className="input pl-10"
                          defaultValue={selectedEmployee.joinDate ? 
                            new Date(selectedEmployee.joinDate).toISOString().split('T')[0] : 
                            ''
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    {selectedEmployee.profileImage ? (
                      <img 
                        src={selectedEmployee.profileImage} 
                        alt={selectedEmployee.name}
                        className="h-24 w-24 rounded-full mr-6 object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl mr-6">
                        {selectedEmployee.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold mb-1">{selectedEmployee.name}</h3>
                      <p className="text-gray-500 mb-2">{selectedEmployee.position}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Mail size={14} className="mr-1" />
                        {selectedEmployee.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Employee ID</p>
                      <p className="font-medium">{selectedEmployee.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Department</p>
                      <p className="font-medium">{selectedEmployee.department || '—'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Monthly Salary</p>
                      <p className="font-medium">{formatCurrency(selectedEmployee.salary)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Join Date</p>
                      <p className="font-medium">{formatDate(selectedEmployee.joinDate)}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">Loan Summary</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <p className="text-sm text-gray-500 mb-1">Total Loans</p>
                        <p className="text-xl font-bold text-gray-900">2</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <p className="text-sm text-gray-500 mb-1">Active Loans</p>
                        <p className="text-xl font-bold text-primary">1</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">$4,000</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <p className="text-sm text-gray-500 mb-1">Outstanding</p>
                        <p className="text-xl font-bold text-accent">$1,500</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card bg-white flex flex-col items-center justify-center text-center p-8">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <User className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium mb-2">No Employee Selected</h3>
              <p className="text-gray-500">Select an employee from the list to view details</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <AlertCircle className="text-error mr-2" size={24} />
                <h2 className="text-xl font-bold">Confirm Deletion</h2>
              </div>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <p className="mb-6">
              Are you sure you want to delete this employee? This action cannot be undone and will remove all associated loan records.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="btn-outline"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;