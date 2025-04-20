import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoan, Loan } from '../../contexts/LoanContext';
import { mockUsers } from '../../data/mockData';
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Search,
  ChevronDown,
  Filter,
  AlertCircle,
  Building,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';

const LoanRequestManagement: React.FC = () => {
  const { loans, approveLoan, rejectLoan, disburseLoan } = useLoan();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get loan ID from URL query params
  const queryParams = new URLSearchParams(location.search);
  const loanId = queryParams.get('id');
  
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [filterStatus, setFilterStatus] = useState<Loan['status'] | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Apply filters and sorting
  const filteredLoans = loans.filter(loan => {
    if (filterStatus !== 'all' && loan.status !== filterStatus) {
      return false;
    }
    
    if (searchTerm) {
      // In a real app, we would search on employee name too
      const searchTermLower = searchTerm.toLowerCase();
      const amountStr = loan.amount.toString();
      const idStr = loan.id.toLowerCase();
      const dateStr = format(new Date(loan.requestDate), 'MMM d, yyyy').toLowerCase();
      
      return amountStr.includes(searchTermLower) || 
             idStr.includes(searchTermLower) || 
             dateStr.includes(searchTermLower);
    }
    
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.requestDate).getTime();
    const dateB = new Date(b.requestDate).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Find employee information
  const getEmployeeInfo = (employeeId: string) => {
    return mockUsers.find(user => user.id === employeeId);
  };

  // Handle loan approval
  const handleApprove = async () => {
    if (!selectedLoan) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      const success = await approveLoan(selectedLoan.id, approvalNote);
      
      if (success) {
        // Refresh the selected loan
        const updatedLoan = loans.find(loan => loan.id === selectedLoan.id);
        setSelectedLoan(updatedLoan || null);
        setApprovalNote('');
      } else {
        setErrorMessage('Failed to approve loan');
      }
    } catch (err) {
      setErrorMessage('An error occurred during approval');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle loan rejection
  const handleReject = async () => {
    if (!selectedLoan || !rejectionReason) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      const success = await rejectLoan(selectedLoan.id, rejectionReason);
      
      if (success) {
        // Refresh the selected loan
        const updatedLoan = loans.find(loan => loan.id === selectedLoan.id);
        setSelectedLoan(updatedLoan || null);
        setRejectionReason('');
      } else {
        setErrorMessage('Failed to reject loan');
      }
    } catch (err) {
      setErrorMessage('An error occurred during rejection');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle loan disbursement
  const handleDisburse = async () => {
    if (!selectedLoan) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      const success = await disburseLoan(selectedLoan.id);
      
      if (success) {
        // Refresh the selected loan
        const updatedLoan = loans.find(loan => loan.id === selectedLoan.id);
        setSelectedLoan(updatedLoan || null);
      } else {
        setErrorMessage('Failed to disburse loan');
      }
    } catch (err) {
      setErrorMessage('An error occurred during disbursement');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Set selected loan from URL params
  useEffect(() => {
    if (loanId) {
      const loan = loans.find(l => l.id === loanId);
      if (loan) {
        setSelectedLoan(loan);
      }
    }
  }, [loanId, loans]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Loan Requests</h1>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-6 animate-slide-up">
          <AlertCircle size={20} className="mr-2" />
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan list */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="card bg-white mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search loans..."
                  className="input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <select
                    className="input appearance-none pr-10"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as Loan['status'] | 'all')}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="disbursed">Disbursed</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    className="input appearance-none pr-10"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="card bg-white overflow-hidden">
            {filteredLoans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLoans.map(loan => {
                      const employee = getEmployeeInfo(loan.employeeId);
                      
                      return (
                        <tr 
                          key={loan.id} 
                          className={`hover:bg-gray-50 cursor-pointer ${selectedLoan?.id === loan.id ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            setSelectedLoan(loan);
                            // Update URL without full page reload
                            navigate(`/admin/requests?id=${loan.id}`, { replace: true });
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {employee?.profileImage ? (
                                <img 
                                  src={employee.profileImage} 
                                  alt={employee?.name}
                                  className="h-8 w-8 rounded-full mr-3 object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                                  {employee?.name.charAt(0)}
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900">{employee?.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(loan.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(loan.requestDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              loan.status === 'pending' ? 'badge-warning' : 
                              loan.status === 'approved' ? 'badge-success' : 
                              loan.status === 'rejected' ? 'badge-danger' : 
                              loan.status === 'disbursed' ? 'badge-primary' : 
                              'badge-success'
                            }`}>
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-primary hover:text-primary-dark">
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <Filter className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Matching Loans</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Loan details */}
        <div className="lg:col-span-1">
          {selectedLoan ? (
            <div className="card bg-white">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">Loan Details</h2>
                <p className="text-sm text-gray-500">ID: {selectedLoan.id}</p>
              </div>
              
              {/* Employee Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Employee Information</h3>
                
                {(() => {
                  const employee = getEmployeeInfo(selectedLoan.employeeId);
                  
                  return (
                    <div className="flex items-start">
                      {employee?.profileImage ? (
                        <img 
                          src={employee.profileImage} 
                          alt={employee?.name}
                          className="h-12 w-12 rounded-full mr-4 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                          {employee?.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{employee?.name}</p>
                        <p className="text-sm text-gray-500">{employee?.position}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Building size={12} className="mr-1" />
                          <span>{employee?.department}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <DollarSign size={12} className="mr-1" />
                          <span>Salary: {employee?.salary ? formatCurrency(employee.salary) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Loan Info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Loan Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Requested Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedLoan.requestedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Approved Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedLoan.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`badge ${
                      selectedLoan.status === 'pending' ? 'badge-warning' : 
                      selectedLoan.status === 'approved' ? 'badge-success' : 
                      selectedLoan.status === 'rejected' ? 'badge-danger' : 
                      selectedLoan.status === 'disbursed' ? 'badge-primary' : 
                      'badge-success'
                    }`}>
                      {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Request Date:</span>
                    <span>{formatDate(selectedLoan.requestDate)}</span>
                  </div>
                  {selectedLoan.approvalDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Approval Date:</span>
                      <span>{formatDate(selectedLoan.approvalDate)}</span>
                    </div>
                  )}
                  {selectedLoan.disbursementDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Disbursement Date:</span>
                      <span>{formatDate(selectedLoan.disbursementDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Repayment Period:</span>
                    <span>{selectedLoan.repaymentPeriod} {selectedLoan.repaymentPeriod === 1 ? 'Month' : 'Months'}</span>
                  </div>
                </div>
                
                {selectedLoan.notes && (
                  <div className="mt-4">
                    <h4 className="text-base font-medium mb-2">Notes</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">
                      {selectedLoan.notes}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div>
                <h3 className="text-lg font-medium mb-3">Actions</h3>
                
                {selectedLoan.status === 'pending' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="approvalNote" className="block text-sm font-medium text-gray-700 mb-1">
                        Approval Note (Optional)
                      </label>
                      <textarea
                        id="approvalNote"
                        className="input min-h-[80px]"
                        placeholder="Add a note for approval..."
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        className="btn-primary flex-1"
                        onClick={handleApprove}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Approve Loan'}
                      </button>
                      
                      <button
                        type="button"
                        className="btn-danger flex-1"
                        data-bs-toggle="modal"
                        data-bs-target="#rejectModal"
                      >
                        Reject Loan
                      </button>
                    </div>
                    
                    {/* Rejection Dialog */}
                    <div className="mt-4">
                      <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                        Rejection Reason (Required)
                      </label>
                      <textarea
                        id="rejectionReason"
                        className="input min-h-[80px]"
                        placeholder="Provide reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      
                      <button
                        className="btn-danger w-full mt-2"
                        onClick={handleReject}
                        disabled={isProcessing || !rejectionReason}
                      >
                        {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedLoan.status === 'approved' && (
                  <button
                    className="btn-primary w-full"
                    onClick={handleDisburse}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Disburse Loan'}
                  </button>
                )}
                
                {selectedLoan.status === 'rejected' && (
                  <div className="flex items-center p-4 bg-red-50 rounded-md">
                    <XCircle className="text-error mr-3" size={20} />
                    <p className="text-sm text-gray-800">
                      This loan request has been rejected.
                    </p>
                  </div>
                )}
                
                {selectedLoan.status === 'disbursed' && (
                  <div className="flex items-center p-4 bg-blue-50 rounded-md">
                    <DollarSign className="text-primary mr-3" size={20} />
                    <p className="text-sm text-gray-800">
                      This loan has been disbursed and is in repayment phase.
                    </p>
                  </div>
                )}
                
                {selectedLoan.status === 'completed' && (
                  <div className="flex items-center p-4 bg-green-50 rounded-md">
                    <CheckCircle className="text-success mr-3" size={20} />
                    <p className="text-sm text-gray-800">
                      This loan has been fully repaid.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card bg-white flex flex-col items-center justify-center text-center p-8">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <CreditCard className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No Loan Selected</h3>
              <p className="text-gray-500">Select a loan from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanRequestManagement;