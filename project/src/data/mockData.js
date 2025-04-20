// Mock users data
export const mockUsers = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@myadvance.com',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'emp1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    salary: 5000,
    joinDate: '2022-03-15T12:00:00Z',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'emp2',
    name: 'Anna Johnson',
    email: 'anna@example.com',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    salary: 4500,
    joinDate: '2022-05-01T12:00:00Z',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'emp3',
    name: 'Robert Chen',
    email: 'robert@example.com',
    role: 'employee',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 5500,
    joinDate: '2021-11-10T12:00:00Z',
    profileImage: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300',
  }
];

// Mock loan policies
export const mockLoanPolicies = [
  {
    id: 'policy1',
    name: 'Standard Advance',
    description: 'Standard salary advance policy for all employees',
    maxLoanAmount: 10000,
    maxLoanPercentage: 50, // 50% of monthly salary
    minRepaymentPeriod: 1,
    maxRepaymentPeriod: 6,
    interestRate: 0, // 0% annual interest
    processingFee: 0, // No processing fee
    minEmploymentDuration: 3, // 3 months minimum employment
    isActive: true
  },
  {
    id: 'policy2',
    name: 'Executive Advance',
    description: 'Premium advance option for executive staff',
    maxLoanAmount: 20000,
    maxLoanPercentage: 70, // 70% of monthly salary
    minRepaymentPeriod: 1,
    maxRepaymentPeriod: 12,
    interestRate: 0, // 0% annual interest
    processingFee: 0, // No processing fee
    minEmploymentDuration: 6, // 6 months minimum employment
    isActive: false
  }
];

// Mock loans
export const mockLoans = [
  {
    id: 'loan1',
    employeeId: 'emp1',
    amount: 2500,
    requestedAmount: 2500,
    status: 'disbursed',
    repaymentPeriod: 5,
    repaymentSchedule: [
      {
        date: '2023-03-01T12:00:00Z',
        amount: 500,
        status: 'paid'
      },
      {
        date: '2023-04-01T12:00:00Z',
        amount: 500,
        status: 'paid'
      },
      {
        date: '2023-05-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-06-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-07-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      }
    ],
    requestDate: '2023-01-15T10:30:00Z',
    approvalDate: '2023-01-17T14:25:00Z',
    disbursementDate: '2023-01-18T09:15:00Z'
  },
  {
    id: 'loan2',
    employeeId: 'emp2',
    amount: 2000,
    requestedAmount: 2000,
    status: 'approved',
    repaymentPeriod: 4,
    repaymentSchedule: [
      {
        date: '2023-04-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-05-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-06-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-07-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      }
    ],
    requestDate: '2023-02-10T15:45:00Z',
    approvalDate: '2023-02-12T11:20:00Z'
  },
  {
    id: 'loan3',
    employeeId: 'emp3',
    amount: 3000,
    requestedAmount: 3000,
    status: 'pending',
    repaymentPeriod: 6,
    repaymentSchedule: [
      {
        date: '2023-04-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-05-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-06-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-07-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-08-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      },
      {
        date: '2023-09-01T12:00:00Z',
        amount: 500,
        status: 'pending'
      }
    ],
    requestDate: '2023-03-01T09:30:00Z'
  },
  {
    id: 'loan4',
    employeeId: 'emp1',
    amount: 1500,
    requestedAmount: 2000,
    status: 'rejected',
    repaymentPeriod: 3,
    repaymentSchedule: [],
    requestDate: '2022-12-05T14:20:00Z',
    notes: 'Rejection reason: Requested amount exceeds policy limits'
  }
];