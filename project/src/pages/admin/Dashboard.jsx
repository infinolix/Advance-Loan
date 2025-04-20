import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { useLoan } from '../../contexts/LoanContext';
import { 
  CreditCard, 
  DollarSign, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  BarChart
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { loans, loanPolicies } = useLoan();
  
  // Calculate statistics
  const totalEmployees = 3; // In a real app, this would be calculated from a users list
  const totalLoans = loans.length;
  const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
  const approvedLoans = loans.filter(loan => loan.status === 'approved').length;
  const rejectedLoans = loans.filter(loan => loan.status === 'rejected').length;
  const disbursedLoans = loans.filter(loan => loan.status === 'disbursed').length;
  const completedLoans = loans.filter(loan => loan.status === 'completed').length;
  
  // Calculate total loan amount
  const totalLoanAmount = loans.reduce((sum, loan) => {
    if (loan.status === 'disbursed' || loan.status === 'completed') {
      return sum + loan.amount;
    }
    return sum;
  }, 0);
  
  // Get pending loan requests
  const pendingLoanRequests = loans
    .filter(loan => loan.status === 'pending')
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-500 text-sm">Total Employees</h3>
            <Users className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{totalEmployees}</div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-500 text-sm">Total Loans</h3>
            <CreditCard className="text-primary" size={20} />
          </div>
          <div className="text-2xl font-bold">{totalLoans}</div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-500 text-sm">Pending Requests</h3>
            <Clock className="text-warning" size={20} />
          </div>
          <div className="text-2xl font-bold">{pendingLoans}</div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-500 text-sm">Disbursed Amount</h3>
            <DollarSign className="text-accent" size={20} />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</div>
        </div>
      </div>
      
      {/* Loan Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - in real app, would use a charting library */}
        <div className="lg:col-span-2 card bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Loan Status Overview</h2>
            <BarChart className="text-primary" size={20} />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Pending</span>
                <span>{pendingLoans}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-warning h-2 rounded-full" 
                  style={{ width: `${(pendingLoans / totalLoans) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Approved</span>
                <span>{approvedLoans}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: `${(approvedLoans / totalLoans) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Rejected</span>
                <span>{rejectedLoans}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-error h-2 rounded-full" 
                  style={{ width: `${(rejectedLoans / totalLoans) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Disbursed</span>
                <span>{disbursedLoans}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(disbursedLoans / totalLoans) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Completed</span>
                <span>{completedLoans}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${(completedLoans / totalLoans) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Active Policies */}
        <div className="card bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Loan Policies</h2>
            <Link 
              to="/admin/policies" 
              className="text-primary text-sm flex items-center hover:underline"
            >
              Manage
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {loanPolicies.map(policy => (
              <div key={policy.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{policy.name}</h3>
                    <p className="text-sm text-gray-500">{policy.description}</p>
                  </div>
                  {policy.isActive && (
                    <span className="badge badge-success">Active</span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Max Amount: </span>
                    {policy.maxLoanAmount ? formatCurrency(policy.maxLoanAmount) : 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Max %: </span>
                    {policy.maxLoanPercentage}%
                  </div>
                  <div>
                    <span className="text-gray-500">Repayment: </span>
                    {policy.minRepaymentPeriod}-{policy.maxRepaymentPeriod} months
                  </div>
                  <div>
                    <span className="text-gray-500">Interest: </span>
                    {policy.interestRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pending Requests */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Pending Loan Requests</h2>
          <Link 
            to="/admin/requests" 
            className="text-primary text-sm flex items-center hover:underline"
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="card bg-white overflow-hidden">
          {pendingLoanRequests.length > 0 ? (
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
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingLoanRequests.slice(0, 5).map(loan => {
                    // Find the employee 
                    const employee = { name: 'John Smith' }; // In a real app, would look up user
                    
                    return (
                      <tr key={loan.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(loan.requestedAmount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{format(new Date(loan.requestDate), 'MMM d, yyyy')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{loan.repaymentPeriod} months</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/admin/requests?id=${loan.id}`} className="text-primary hover:text-primary-dark">
                            Review
                          </Link>
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
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Pending Requests</h3>
              <p className="text-gray-500">All loan requests have been processed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;