import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { useLoan } from '../../contexts/LoanContext';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import LoanCard from '../../components/ui/LoanCard';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { loans, calculateEligibility } = useLoan();
  const [eligibility, setEligibility] = useState<{ eligible: boolean; maxAmount: number; reason?: string }>({
    eligible: false,
    maxAmount: 0
  });

  useEffect(() => {
    if (user?.salary) {
      setEligibility(calculateEligibility(user.salary));
    }
  }, [user, calculateEligibility]);

  // Get user's loans
  const userLoans = loans.filter(loan => loan.employeeId === user?.id);
  
  // Get upcoming payments
  const upcomingPayments = userLoans
    .filter(loan => loan.status === 'disbursed')
    .flatMap(loan => 
      loan.repaymentSchedule
        .filter(payment => payment.status === 'pending')
        .map(payment => ({
          loanId: loan.id,
          amount: payment.amount,
          date: new Date(payment.date),
          loanAmount: loan.amount
        }))
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  // Get active loan
  const activeLoan = userLoans.find(loan => loan.status === 'disbursed');
  
  // Calculate loan statistics
  const pendingLoans = userLoans.filter(loan => loan.status === 'pending').length;
  const approvedLoans = userLoans.filter(loan => loan.status === 'approved').length;
  const disbursedLoans = userLoans.filter(loan => loan.status === 'disbursed').length;
  const completedLoans = userLoans.filter(loan => loan.status === 'completed').length;
  
  // Format currency
  const formatCurrency = (amount: number) => {
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      {/* Eligibility and overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary text-white col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-medium">Loan Eligibility</h2>
            <DollarSign size={24} />
          </div>
          <div className="space-y-4">
            <div className="flex items-end">
              <div className="text-3xl font-bold">
                {eligibility.eligible 
                  ? formatCurrency(eligibility.maxAmount)
                  : '$0'}
              </div>
              <div className="text-primary-light ml-2">
                Max Amount
              </div>
            </div>
            
            <div className="text-sm">
              {eligibility.eligible 
                ? 'You are eligible to apply for a loan'
                : eligibility.reason || 'You are not eligible for a loan at this time'}
            </div>
            
            {eligibility.eligible && (
              <Link 
                to="/employee/apply" 
                className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors mt-2"
              >
                Apply Now
                <ArrowRight size={16} className="ml-2" />
              </Link>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card bg-white">
            <div className="text-sm text-gray-500 mb-1">Active Loans</div>
            <div className="flex items-center">
              <CreditCard className="text-primary mr-2" size={18} />
              <span className="text-2xl font-bold">{disbursedLoans}</span>
            </div>
          </div>
          
          <div className="card bg-white">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="flex items-center">
              <Clock className="text-warning mr-2" size={18} />
              <span className="text-2xl font-bold">{pendingLoans}</span>
            </div>
          </div>
          
          <div className="card bg-white">
            <div className="text-sm text-gray-500 mb-1">Approved</div>
            <div className="flex items-center">
              <CheckCircle className="text-success mr-2" size={18} />
              <span className="text-2xl font-bold">{approvedLoans}</span>
            </div>
          </div>
          
          <div className="card bg-white">
            <div className="text-sm text-gray-500 mb-1">Completed</div>
            <div className="flex items-center">
              <CheckCircle className="text-accent mr-2" size={18} />
              <span className="text-2xl font-bold">{completedLoans}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active loan and repayment schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active loan card */}
        <div className="col-span-1">
          <h2 className="text-lg font-medium mb-4">Current Loan</h2>
          {activeLoan ? (
            <LoanCard loan={activeLoan} onClick={() => {}} />
          ) : (
            <div className="card bg-white flex flex-col items-center justify-center text-center p-8">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <CreditCard className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No Active Loans</h3>
              <p className="text-gray-500 mb-4">You don't have any active loans at the moment.</p>
              {eligibility.eligible && (
                <Link 
                  to="/employee/apply" 
                  className="btn-primary"
                >
                  Apply for a Loan
                </Link>
              )}
            </div>
          )}
        </div>
        
        {/* Upcoming payments */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Upcoming Payments</h2>
            <Link 
              to="/employee/history" 
              className="text-primary text-sm flex items-center hover:underline"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {upcomingPayments.length > 0 ? (
            <div className="card bg-white">
              <div className="divide-y divide-gray-100">
                {upcomingPayments.map((payment, index) => (
                  <div key={index} className={`flex items-center justify-between py-3 ${index === 0 ? 'pt-0' : ''} ${index === upcomingPayments.length - 1 ? 'pb-0' : ''}`}>
                    <div className="flex items-center">
                      <div className="bg-primary-light bg-opacity-10 rounded-full p-2 mr-3">
                        <Calendar size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-500">
                          Due on {format(payment.date, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Loan</p>
                      <p className="font-medium">{formatCurrency(payment.loanAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card bg-white flex flex-col items-center justify-center text-center p-8">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <Calendar className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No Upcoming Payments</h3>
              <p className="text-gray-500">You don't have any upcoming loan payments scheduled.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent loan application activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <Link 
            to="/employee/history" 
            className="text-primary text-sm flex items-center hover:underline"
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {userLoans.length > 0 ? (
          <div className="card bg-white">
            <div className="divide-y divide-gray-100">
              {userLoans.slice(0, 5).map((loan) => (
                <div key={loan.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center">
                    {loan.status === 'pending' && (
                      <Clock className="text-warning mr-3" size={20} />
                    )}
                    {loan.status === 'approved' && (
                      <CheckCircle className="text-success mr-3" size={20} />
                    )}
                    {loan.status === 'rejected' && (
                      <XCircle className="text-error mr-3" size={20} />
                    )}
                    {loan.status === 'disbursed' && (
                      <DollarSign className="text-primary mr-3" size={20} />
                    )}
                    {loan.status === 'completed' && (
                      <CheckCircle className="text-accent mr-3" size={20} />
                    )}
                    <div>
                      <p className="font-medium">
                        {formatCurrency(loan.amount)} Loan {loan.status === 'rejected' ? 'Request' : ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(loan.requestDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${
                      loan.status === 'pending' ? 'badge-warning' : 
                      loan.status === 'approved' ? 'badge-success' : 
                      loan.status === 'rejected' ? 'badge-danger' : 
                      loan.status === 'disbursed' ? 'badge-primary' : 
                      'badge-success'
                    }`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card bg-white flex flex-col items-center justify-center text-center p-8">
            <div className="bg-gray-100 rounded-full p-3 mb-4">
              <AlertCircle className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">No Loan Activity</h3>
            <p className="text-gray-500 mb-4">You haven't applied for any loans yet.</p>
            {eligibility.eligible && (
              <Link 
                to="/employee/apply" 
                className="btn-primary"
              >
                Apply for a Loan
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;