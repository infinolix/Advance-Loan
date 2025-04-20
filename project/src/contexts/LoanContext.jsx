import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockLoans, mockLoanPolicies } from '../data/mockData';

const LoanContext = createContext({
  loans: [],
  loanPolicies: [],
  activePolicy: null,
  calculateEligibility: () => ({ eligible: false, maxAmount: 0 }),
  applyForLoan: async () => false,
  approveLoan: async () => false,
  rejectLoan: async () => false,
  disburseLoan: async () => false,
  registerPayment: async () => false,
  updateLoanPolicy: async () => false,
  createLoanPolicy: async () => false,
  getEmployeeLoans: () => [],
  getLoanById: () => undefined,
});

export const useLoan = () => useContext(LoanContext);

export const LoanProvider = ({ children }) => {
  const { user } = useAuth();
  const [loans, setLoans] = useState(mockLoans);
  const [loanPolicies, setLoanPolicies] = useState(mockLoanPolicies);
  const [activePolicy, setActivePolicy] = useState(null);
  
  useEffect(() => {
    // Set active policy - in a real app this would be configured by admin
    const defaultPolicy = loanPolicies.find(p => p.isActive) || null;
    setActivePolicy(defaultPolicy);
  }, [loanPolicies]);

  const calculateEligibility = (salary) => {
    if (!activePolicy) {
      return { 
        eligible: false, 
        maxAmount: 0,
        reason: 'No active loan policy found'
      };
    }

    // In a real app, additional employment checks would happen here
    const maxAmount = Math.min(
      activePolicy.maxLoanAmount || Infinity,
      salary * (activePolicy.maxLoanPercentage / 100)
    );

    return {
      eligible: true,
      maxAmount: parseFloat(maxAmount.toFixed(2))
    };
  };

  const generateRepaymentSchedule = (amount, periodMonths, startDate) => {
    const schedule = [];
    const monthlyAmount = amount / periodMonths;
    
    for (let i = 0; i < periodMonths; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i + 1);
      
      schedule.push({
        date: date.toISOString(),
        amount: parseFloat(monthlyAmount.toFixed(2)),
        status: 'pending'
      });
    }
    
    return schedule;
  };

  const applyForLoan = async (amount, period, notes) => {
    try {
      if (!user || !activePolicy) return false;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const eligibility = calculateEligibility(user.salary || 0);
      if (!eligibility.eligible || amount > eligibility.maxAmount) {
        return false;
      }
      
      // Create new loan
      const newLoan = {
        id: `loan_${Math.random().toString(36).substr(2, 9)}`,
        employeeId: user.id,
        requestedAmount: amount,
        amount: amount, // This would be adjusted in case of fees
        status: 'pending',
        repaymentPeriod: period,
        repaymentSchedule: generateRepaymentSchedule(amount, period, new Date()),
        requestDate: new Date().toISOString(),
        notes
      };
      
      setLoans(prev => [...prev, newLoan]);
      return true;
    } catch (error) {
      console.error('Loan application error:', error);
      return false;
    }
  };

  const approveLoan = async (loanId, notes) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoans(prev => prev.map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            status: 'approved',
            approvalDate: new Date().toISOString(),
            notes: notes ? `${loan.notes || ''}\nApproval notes: ${notes}` : loan.notes
          };
        }
        return loan;
      }));
      
      return true;
    } catch (error) {
      console.error('Loan approval error:', error);
      return false;
    }
  };

  const rejectLoan = async (loanId, reason) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoans(prev => prev.map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            status: 'rejected',
            notes: `${loan.notes || ''}\nRejection reason: ${reason}`
          };
        }
        return loan;
      }));
      
      return true;
    } catch (error) {
      console.error('Loan rejection error:', error);
      return false;
    }
  };

  const disburseLoan = async (loanId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoans(prev => prev.map(loan => {
        if (loan.id === loanId && loan.status === 'approved') {
          return {
            ...loan,
            status: 'disbursed',
            disbursementDate: new Date().toISOString(),
          };
        }
        return loan;
      }));
      
      return true;
    } catch (error) {
      console.error('Loan disbursement error:', error);
      return false;
    }
  };

  const registerPayment = async (loanId, paymentIndex) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoans(prev => prev.map(loan => {
        if (loan.id === loanId) {
          const newSchedule = [...loan.repaymentSchedule];
          
          if (newSchedule[paymentIndex]) {
            newSchedule[paymentIndex] = {
              ...newSchedule[paymentIndex],
              status: 'paid'
            };
          }
          
          // Check if all payments are complete
          const allPaid = newSchedule.every(payment => payment.status === 'paid');
          
          return {
            ...loan,
            repaymentSchedule: newSchedule,
            status: allPaid ? 'completed' : loan.status,
            completionDate: allPaid ? new Date().toISOString() : undefined
          };
        }
        return loan;
      }));
      
      return true;
    } catch (error) {
      console.error('Payment registration error:', error);
      return false;
    }
  };

  const updateLoanPolicy = async (policy) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoanPolicies(prev => prev.map(p => 
        p.id === policy.id ? policy : p
      ));
      
      // Update active policy if needed
      if (policy.isActive) {
        setActivePolicy(policy);
        // Deactivate other policies
        setLoanPolicies(prev => prev.map(p => 
          p.id !== policy.id && p.isActive ? { ...p, isActive: false } : p
        ));
      }
      
      return true;
    } catch (error) {
      console.error('Policy update error:', error);
      return false;
    }
  };

  const createLoanPolicy = async (policyData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPolicy = {
        ...policyData,
        id: `policy_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // If the new policy is active, deactivate others
      if (newPolicy.isActive) {
        setLoanPolicies(prev => prev.map(p => 
          p.isActive ? { ...p, isActive: false } : p
        ));
        setActivePolicy(newPolicy);
      }
      
      setLoanPolicies(prev => [...prev, newPolicy]);
      return true;
    } catch (error) {
      console.error('Policy creation error:', error);
      return false;
    }
  };

  const getEmployeeLoans = (employeeId) => {
    return loans.filter(loan => loan.employeeId === employeeId);
  };

  const getLoanById = (loanId) => {
    return loans.find(loan => loan.id === loanId);
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        loanPolicies,
        activePolicy,
        calculateEligibility,
        applyForLoan,
        approveLoan,
        rejectLoan,
        disburseLoan,
        registerPayment,
        updateLoanPolicy,
        createLoanPolicy,
        getEmployeeLoans,
        getLoanById
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};