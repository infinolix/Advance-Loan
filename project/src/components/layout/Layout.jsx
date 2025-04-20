import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  User, 
  CreditCard, 
  History, 
  Settings, 
  LogOut,
  Users,
  ClipboardList,
  FileText,
  BarChart
} from 'lucide-react';

const NavItem = ({ icon, label, active, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-md transition-colors ${
          active 
            ? 'bg-primary text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  );
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const employeeNavItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/employee/dashboard' },
    { icon: <User size={20} />, label: 'Profile', href: '/employee/profile' },
    { icon: <CreditCard size={20} />, label: 'Apply for Loan', href: '/employee/apply' },
    { icon: <History size={20} />, label: 'Loan History', href: '/employee/history' },
  ];

  const adminNavItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'Employees', href: '/admin/employees' },
    { icon: <ClipboardList size={20} />, label: 'Loan Policies', href: '/admin/policies' },
    { icon: <FileText size={20} />, label: 'Loan Requests', href: '/admin/requests' },
    { icon: <BarChart size={20} />, label: 'Reports', href: '/admin/reports' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <CreditCard className="text-primary mr-2" size={24} />
              <h1 className="text-xl font-bold text-gray-900">My Advance</h1>
            </div>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                  {user?.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Administrator' : user?.position}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={location.pathname === item.href}
                  onClick={() => handleNavigation(item.href)}
                />
              ))}
            </ul>
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;