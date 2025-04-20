import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar } from 'lucide-react';

const LoanCard = ({ loan, onClick }) => {
  const getStatusIcon = () => {
    switch (loan.status) {
      case 'approved':
        return <CheckCircle className="text-success" size={20} />;
      case 'rejected':
        return <XCircle className="text-error" size={20} />;
      case 'pending':
        return <Clock className="text-warning" size={20} />;
      case 'disbursed':
        return <DollarSign className="text-primary" size={20} />;
      case 'completed':
        return <CheckCircle className="text-success" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (loan.status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      case 'disbursed':
        return 'Disbursed';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (loan.status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      case 'disbursed':
        return 'badge-primary';
      case 'completed':
        return 'badge-success';
      default:
        return 'badge-outline';
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Calculate progress of repayment
  const totalPayments = loan.repaymentSchedule.length;
  const paidPayments = loan.repaymentSchedule.filter(p => p.status === 'paid').length;
  const progressPercent = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0;

  return (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <DollarSign className="text-primary mr-2" size={24} />
          <h3 className="text-lg font-medium">Loan ${loan.amount.toLocaleString()}</h3>
        </div>
        <span className={`badge ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-1">{getStatusText()}</span>
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Request Date</span>
          <span>{formatDate(loan.requestDate)}</span>
        </div>
        
        {loan.approvalDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Approval Date</span>
            <span>{formatDate(loan.approvalDate)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Repayment Period</span>
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {loan.repaymentPeriod} {loan.repaymentPeriod === 1 ? 'Month' : 'Months'}
          </span>
        </div>
        
        {loan.status === 'disbursed' || loan.status === 'completed' ? (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Repayment Progress</span>
              <span>{paidPayments} of {totalPayments} payments</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LoanCard;