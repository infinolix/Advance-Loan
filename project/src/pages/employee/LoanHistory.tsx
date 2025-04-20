import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { useLoan, Loan } from '../../contexts/LoanContext';
import {
  CreditCard,
  Search,
  ChevronDown,
  XCircle,
  AlertCircle
} from 'lucide-react';
import LoanCard from '../../components/ui/LoanCard';

const LoanHistory: React.FC = () => {
  const { user } = useAuth();
  const { loans } = useLoan();
  
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [filterStatus, setFilterStatus] = useState<Loan['status'] | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get user's loans
  const userLoans = loans.filter(loan => loan.employeeId === user?.id);
  
  // Apply filters and sorting
  const filteredLoans = userLoans.filter(loan => {
    if (filterStatus !== 'all' && loan.status !== filterStatus) {
      return false;
    }
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const amountStr = loan.amount.toString();
      const dateStr = format(new Date(loan.requestDate), 'MMM d, yyyy').toLowerCase();
      
      return amountStr.includes(searchTermLower) || dateStr.includes(searchTermLower);
    }
    
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.requestDate).getTime();
    const dateB = new Date(b.requestDate).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Loan History</h1>
      
      {/* Filters and search */}
      <div className="card bg-white mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search loans..."
              className="input pl-10"
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
      
      {/* Loan list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.length > 0 ? (
          filteredLoans.map(loan => (
            <LoanCard 
              key={loan.id} 
              loan={loan} 
              onClick={() => setSelectedLoan(loan)}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="card bg-white flex flex-col items-center justify-center text-center p-8">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <AlertCircle className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No Loans Found</h3>
              <p className="text-gray-500">
                {userLoans.length === 0 
                  ? "You haven't applied for any loans yet."
                  : "No loans match your search criteria."}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Loan details modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <CreditCard className="text-primary mr-2" size={24} />
                  <h2 className="text-xl font-bold">Loan Details</h2>
                </div>
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Loan Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
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
                    {selectedLoan.completionDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Completion Date:</span>
                        <span>{formatDate(selectedLoan.completionDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Repayment Period:</span>
                      <span>{selectedLoan.repaymentPeriod} {selectedLoan.repaymentPeriod === 1 ? 'Month' : 'Months'}</span>
                    </div>
                  </div>
                  
                  {selectedLoan.notes && (
                    <div className="mt-6">
                      <h4 className="text-base font-medium mb-2">Notes</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">
                        {selectedLoan.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Repayment Schedule</h3>
                  {selectedLoan.repaymentSchedule.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedLoan.repaymentSchedule.map((payment, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(payment.date)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`badge ${
                                  payment.status === 'pending' ? 'bg-gray-100 text-gray-800' : 
                                  payment.status === 'paid' ? 'badge-success' : 
                                  'badge-danger'
                                }`}>
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No repayment schedule available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanHistory;