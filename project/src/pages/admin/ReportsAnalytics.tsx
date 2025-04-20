import React, { useState } from 'react';
import { format, subMonths } from 'date-fns';
import { useLoan } from '../../contexts/LoanContext';
import { mockUsers } from '../../data/mockData';
import {
  BarChart,
  Download,
  Calendar,
  ChevronDown,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

// Generate mock data for charts
const generateMockChartData = () => {
  const months = [];
  const loanCounts = [];
  const loanAmounts = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMM yyyy'));
    
    // Generate random data
    loanCounts.push(Math.floor(Math.random() * 7) + 1);
    loanAmounts.push(Math.floor(Math.random() * 15000) + 5000);
  }
  
  return { months, loanCounts, loanAmounts };
};

const ReportsAnalytics: React.FC = () => {
  const { loans } = useLoan();
  const [timeRange, setTimeRange] = useState('last6months');
  
  // Calculate statistics
  const totalEmployees = 3; // In a real app, this would be calculated from the users list
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
  
  // Calculate repayment rate
  const totalRepayments = loans
    .filter(loan => loan.status === 'disbursed' || loan.status === 'completed')
    .reduce((sum, loan) => sum + loan.repaymentSchedule.filter(payment => payment.status === 'paid').length, 0);
  
  const totalScheduledRepayments = loans
    .filter(loan => loan.status === 'disbursed' || loan.status === 'completed')
    .reduce((sum, loan) => sum + loan.repaymentSchedule.length, 0);
  
  const repaymentRate = totalScheduledRepayments > 0 ? 
    Math.round((totalRepayments / totalScheduledRepayments) * 100) : 0;
  
  // Get mock chart data
  const chartData = generateMockChartData();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle export report
  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF report
    alert('Report export functionality would be implemented here in a real application.');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Reports & Analytics</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              className="input appearance-none pr-10"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="allTime">All Time</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <button
            className="btn-outline flex items-center"
            onClick={handleExport}
          >
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Loans</p>
              <p className="text-2xl font-bold">{totalLoans}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-md">
              <CreditCard className="text-primary" size={20} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-success font-medium">{Math.round((completedLoans / totalLoans) * 100)}% </span>
            completion rate
          </div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-md">
              <DollarSign className="text-success" size={20} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-success font-medium">+{formatCurrency(Math.round(totalLoanAmount * 0.1))} </span>
            from last period
          </div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Approval Rate</p>
              <p className="text-2xl font-bold">
                {totalLoans > 0 ? Math.round(((approvedLoans + disbursedLoans + completedLoans) / totalLoans) * 100) : 0}%
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-md">
              <CheckCircle className="text-success" size={20} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-success font-medium">+5% </span>
            from last period
          </div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Repayment Rate</p>
              <p className="text-2xl font-bold">{repaymentRate}%</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-md">
              <DollarSign className="text-primary" size={20} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="text-success font-medium">On track </span>
            for all payments
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Loan Applications</h2>
            <BarChart className="text-primary" size={20} />
          </div>
          
          {/* Simple chart visualization */}
          <div className="space-y-4">
            {chartData.months.map((month, index) => (
              <div key={month}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{month}</span>
                  <span>{chartData.loanCounts[index]} loans</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(chartData.loanCounts[index] / Math.max(...chartData.loanCounts)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Loan Amounts</h2>
            <DollarSign className="text-primary" size={20} />
          </div>
          
          {/* Simple chart visualization */}
          <div className="space-y-4">
            {chartData.months.map((month, index) => (
              <div key={month}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{month}</span>
                  <span>{formatCurrency(chartData.loanAmounts[index])}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full" 
                    style={{ width: `${(chartData.loanAmounts[index] / Math.max(...chartData.loanAmounts)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Loan status breakdown */}
      <div className="card bg-white mb-6">
        <h2 className="text-lg font-medium mb-6">Loan Status Breakdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 bg-blue-50 rounded-md text-center">
            <div className="flex justify-center mb-2">
              <Clock className="text-warning" size={24} />
            </div>
            <p className="text-lg font-bold">{pendingLoans}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="text-success" size={24} />
            </div>
            <p className="text-lg font-bold">{approvedLoans}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-md text-center">
            <div className="flex justify-center mb-2">
              <XCircle className="text-error" size={24} />
            </div>
            <p className="text-lg font-bold">{rejectedLoans}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md text-center">
            <div className="flex justify-center mb-2">
              <DollarSign className="text-primary" size={24} />
            </div>
            <p className="text-lg font-bold">{disbursedLoans}</p>
            <p className="text-sm text-gray-500">Disbursed</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="text-accent" size={24} />
            </div>
            <p className="text-lg font-bold">{completedLoans}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="flex rounded-full overflow-hidden h-4">
              <div 
                className="bg-warning" 
                style={{ width: `${(pendingLoans / totalLoans) * 100}%` }}
              ></div>
              <div 
                className="bg-success" 
                style={{ width: `${(approvedLoans / totalLoans) * 100}%` }}
              ></div>
              <div 
                className="bg-error" 
                style={{ width: `${(rejectedLoans / totalLoans) * 100}%` }}
              ></div>
              <div 
                className="bg-primary" 
                style={{ width: `${(disbursedLoans / totalLoans) * 100}%` }}
              ></div>
              <div 
                className="bg-accent" 
                style={{ width: `${(completedLoans / totalLoans) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Pending: {Math.round((pendingLoans / totalLoans) * 100)}%</span>
            <span>Approved: {Math.round((approvedLoans / totalLoans) * 100)}%</span>
            <span>Rejected: {Math.round((rejectedLoans / totalLoans) * 100)}%</span>
            <span>Disbursed: {Math.round((disbursedLoans / totalLoans) * 100)}%</span>
            <span>Completed: {Math.round((completedLoans / totalLoans) * 100)}%</span>
          </div>
        </div>
      </div>
      
      {/* Top borrowers */}
      <div className="card bg-white">
        <h2 className="text-lg font-medium mb-6">Top Borrowers</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repayment Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.filter(user => user.role === 'employee').map(employee => {
                // Count loans for this employee
                const employeeLoans = loans.filter(loan => loan.employeeId === employee.id);
                const loanCount = employeeLoans.length;
                
                // Calculate total loan amount
                const totalAmount = employeeLoans.reduce((sum, loan) => {
                  if (loan.status === 'disbursed' || loan.status === 'completed') {
                    return sum + loan.amount;
                  }
                  return sum;
                }, 0);
                
                // Calculate repayment rate
                const totalPayments = employeeLoans
                  .filter(loan => loan.status === 'disbursed' || loan.status === 'completed')
                  .reduce((sum, loan) => sum + loan.repaymentSchedule.filter(payment => payment.status === 'paid').length, 0);
                
                const scheduledPayments = employeeLoans
                  .filter(loan => loan.status === 'disbursed' || loan.status === 'completed')
                  .reduce((sum, loan) => sum + loan.repaymentSchedule.length, 0);
                
                const repaymentRate = scheduledPayments > 0 ? 
                  Math.round((totalPayments / scheduledPayments) * 100) : 0;
                
                return (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {employee.profileImage ? (
                          <img 
                            src={employee.profileImage} 
                            alt={employee.name}
                            className="h-8 w-8 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                            {employee.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loanCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(totalAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{repaymentRate}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              repaymentRate >= 90 ? 'bg-success' : 
                              repaymentRate >= 70 ? 'bg-primary' : 
                              repaymentRate >= 50 ? 'bg-warning' : 
                              'bg-error'
                            }`}
                            style={{ width: `${repaymentRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;