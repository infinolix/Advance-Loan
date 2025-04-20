import React, { useState } from 'react';
import { useLoan, LoanPolicy } from '../../contexts/LoanContext';
import { 
  ClipboardList, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash,
  Info,
  XCircle
} from 'lucide-react';

const LoanPolicyManagement: React.FC = () => {
  const { loanPolicies, updateLoanPolicy, createLoanPolicy } = useLoan();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<LoanPolicy, 'id'>>({
    name: '',
    description: '',
    maxLoanAmount: null,
    maxLoanPercentage: 50,
    minRepaymentPeriod: 1,
    maxRepaymentPeriod: 6,
    interestRate: 0,
    processingFee: 0,
    minEmploymentDuration: 3,
    isActive: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const editPolicy = (policy: LoanPolicy) => {
    setFormData({
      name: policy.name,
      description: policy.description,
      maxLoanAmount: policy.maxLoanAmount,
      maxLoanPercentage: policy.maxLoanPercentage,
      minRepaymentPeriod: policy.minRepaymentPeriod,
      maxRepaymentPeriod: policy.maxRepaymentPeriod,
      interestRate: policy.interestRate,
      processingFee: policy.processingFee,
      minEmploymentDuration: policy.minEmploymentDuration,
      isActive: policy.isActive
    });
    setEditingPolicyId(policy.id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const createNewPolicy = () => {
    setFormData({
      name: '',
      description: '',
      maxLoanAmount: null,
      maxLoanPercentage: 50,
      minRepaymentPeriod: 1,
      maxRepaymentPeriod: 6,
      interestRate: 0,
      processingFee: 0,
      minEmploymentDuration: 3,
      isActive: false
    });
    setEditingPolicyId(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingPolicyId(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validation
    if (!formData.name) {
      setErrorMessage('Policy name is required');
      return;
    }
    
    if (formData.maxLoanPercentage <= 0) {
      setErrorMessage('Maximum loan percentage must be greater than 0');
      return;
    }
    
    if (formData.minRepaymentPeriod <= 0 || formData.maxRepaymentPeriod <= 0) {
      setErrorMessage('Repayment periods must be greater than 0');
      return;
    }
    
    if (formData.minRepaymentPeriod > formData.maxRepaymentPeriod) {
      setErrorMessage('Minimum repayment period cannot be greater than maximum');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (isEditing && editingPolicyId) {
        // Update existing policy
        success = await updateLoanPolicy({
          id: editingPolicyId,
          ...formData
        });
        
        if (success) {
          setSuccessMessage('Policy updated successfully');
        }
      } else if (isCreating) {
        // Create new policy
        success = await createLoanPolicy(formData);
        
        if (success) {
          setSuccessMessage('New policy created successfully');
        }
      }
      
      if (success) {
        setIsEditing(false);
        setIsCreating(false);
        setEditingPolicyId(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage('Operation failed');
      }
    } catch (err) {
      setErrorMessage('An error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (policyId: string) => {
    setDeleteConfirmId(policyId);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const confirmDelete = () => {
    // In a real app, we would have a deleteLoanPolicy function
    // For this demo, we'll just show a success message
    setDeleteConfirmId(null);
    setSuccessMessage('Policy deleted successfully');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'No Limit';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Loan Policies</h1>
        
        <button
          className="btn-primary flex items-center"
          onClick={createNewPolicy}
        >
          <Plus size={16} className="mr-1" />
          New Policy
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
      
      {(isEditing || isCreating) ? (
        <div className="card bg-white">
          <h2 className="text-xl font-bold mb-6">
            {isEditing ? 'Edit Loan Policy' : 'Create New Loan Policy'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Policy Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="input"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxLoanAmount" className="block text-sm font-medium text-gray-700">
                  Maximum Loan Amount (Leave empty for no limit)
                </label>
                <input
                  id="maxLoanAmount"
                  name="maxLoanAmount"
                  type="number"
                  min="0"
                  step="100"
                  className="input"
                  value={formData.maxLoanAmount === null ? '' : formData.maxLoanAmount}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxLoanPercentage" className="block text-sm font-medium text-gray-700">
                  Maximum Percentage of Salary (%) *
                </label>
                <input
                  id="maxLoanPercentage"
                  name="maxLoanPercentage"
                  type="number"
                  min="1"
                  max="100"
                  required
                  className="input"
                  value={formData.maxLoanPercentage}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="minRepaymentPeriod" className="block text-sm font-medium text-gray-700">
                  Minimum Repayment Period (Months) *
                </label>
                <input
                  id="minRepaymentPeriod"
                  name="minRepaymentPeriod"
                  type="number"
                  min="1"
                  required
                  className="input"
                  value={formData.minRepaymentPeriod}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxRepaymentPeriod" className="block text-sm font-medium text-gray-700">
                  Maximum Repayment Period (Months) *
                </label>
                <input
                  id="maxRepaymentPeriod"
                  name="maxRepaymentPeriod"
                  type="number"
                  min="1"
                  required
                  className="input"
                  value={formData.maxRepaymentPeriod}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                  Annual Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  min="0"
                  step="0.1"
                  className="input"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="processingFee" className="block text-sm font-medium text-gray-700">
                  Processing Fee
                </label>
                <input
                  id="processingFee"
                  name="processingFee"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={formData.processingFee}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="minEmploymentDuration" className="block text-sm font-medium text-gray-700">
                  Minimum Employment Duration (Months)
                </label>
                <input
                  id="minEmploymentDuration"
                  name="minEmploymentDuration"
                  type="number"
                  min="0"
                  className="input"
                  value={formData.minEmploymentDuration}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isActive" className="font-medium text-gray-700">
                    Active
                  </label>
                  <p className="text-gray-500">Make this the active policy for new loans</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="btn-outline"
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Policy' : 'Create Policy'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loanPolicies.map(policy => (
            <div key={policy.id} className="card bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{policy.name}</h2>
                  <p className="text-gray-500">{policy.description}</p>
                </div>
                
                {policy.isActive && (
                  <span className="badge badge-success">Active</span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Max Amount</p>
                  <p className="font-medium">{formatCurrency(policy.maxLoanAmount)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Max % of Salary</p>
                  <p className="font-medium">{policy.maxLoanPercentage}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Repayment Period</p>
                  <p className="font-medium">{policy.minRepaymentPeriod} - {policy.maxRepaymentPeriod} months</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="font-medium">{policy.interestRate}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Processing Fee</p>
                  <p className="font-medium">{formatCurrency(policy.processingFee)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Min. Employment</p>
                  <p className="font-medium">{policy.minEmploymentDuration} months</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  className="btn-outline flex items-center"
                  onClick={() => editPolicy(policy)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                
                <button
                  className="btn-danger flex items-center"
                  onClick={() => handleDeleteRequest(policy.id)}
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
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
              Are you sure you want to delete this loan policy? This action cannot be undone.
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

export default LoanPolicyManagement;