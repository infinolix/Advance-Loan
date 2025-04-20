import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoan } from '../../contexts/LoanContext';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const LoanApplication: React.FC = () => {
  const { user } = useAuth();
  const { calculateEligibility, applyForLoan, activePolicy } = useLoan();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('3');
  const [notes, setNotes] = useState('');
  const [eligibility, setEligibility] = useState<{ eligible: boolean; maxAmount: number; reason?: string }>({
    eligible: false,
    maxAmount: 0
  });
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.salary) {
      setEligibility(calculateEligibility(user.salary));
    }
  }, [user, calculateEligibility]);

  useEffect(() => {
    if (amount && period) {
      const amountValue = parseFloat(amount);
      const periodValue = parseInt(period);
      if (!isNaN(amountValue) && !isNaN(periodValue) && periodValue > 0) {
        setMonthlyPayment(amountValue / periodValue);
      } else {
        setMonthlyPayment(0);
      }
    } else {
      setMonthlyPayment(0);
    }
  }, [amount, period]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amountValue = parseFloat(amount);
    const periodValue = parseInt(period);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }
    
    if (amountValue > eligibility.maxAmount) {
      setError('Requested amount exceeds your eligible amount');
      return;
    }
    
    if (isNaN(periodValue) || periodValue <= 0) {
      setError('Please select a valid repayment period');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await applyForLoan(amountValue, periodValue, notes);
      
      if (success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/employee/dashboard');
        }, 2000);
      } else {
        setError('Failed to submit loan application');
      }
    } catch (err) {
      setError('An error occurred while processing your application');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="bg-success bg-opacity-10 rounded-full p-4 mb-4">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted</h1>
        <p className="text-gray-600 text-center mb-4">
          Your loan application has been submitted successfully.
        </p>
        <p className="text-gray-600 text-center mb-8">
          You will be redirected to the dashboard in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Apply for a Loan</h1>
      
      {!eligibility.eligible ? (
        <div className="card bg-white p-8 max-w-lg mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="bg-error bg-opacity-10 rounded-full p-4 mb-4">
              <AlertCircle className="h-8 w-8 text-error" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Not Eligible for a Loan</h2>
            <p className="text-gray-600 mb-4">
              {eligibility.reason || 'You are not eligible for a loan at this time.'}
            </p>
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card bg-white">
              <h2 className="text-xl font-semibold mb-6">Loan Application Form</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center mb-6 animate-slide-up">
                  <AlertCircle size={20} className="mr-2" />
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount (Max: {formatCurrency(eligibility.maxAmount)})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="1"
                      max={eligibility.maxAmount}
                      required
                      className="input pl-10"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                    Repayment Period (Months)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="period"
                      name="period"
                      required
                      className="input pl-10"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      {activePolicy && Array.from(
                        { length: activePolicy.maxRepaymentPeriod - activePolicy.minRepaymentPeriod + 1 },
                        (_, i) => activePolicy.minRepaymentPeriod + i
                      ).map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Month' : 'Months'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Purpose of Loan (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="input min-h-[120px]"
                    placeholder="Please describe why you need this loan..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="card bg-white sticky top-6">
              <h3 className="text-lg font-medium mb-4">Loan Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Requested Amount</span>
                  <span className="font-medium">
                    {amount ? formatCurrency(parseFloat(amount)) : '$0'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Repayment Period</span>
                  <span className="font-medium">
                    {period} {parseInt(period) === 1 ? 'Month' : 'Months'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Monthly Payment</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">
                    {activePolicy?.processingFee ? 
                      formatCurrency(activePolicy.processingFee) : 
                      '$0'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-md flex items-start">
                <HelpCircle className="text-primary mt-0.5 mr-2 flex-shrink-0" size={18} />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">How it works:</p>
                  <p>Once approved, the loan amount will be credited to your account. Repayments will be automatically deducted from your monthly salary.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplication;