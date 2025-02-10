import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileBox, 
  FileCheck, 
  Settings, 
  LogOut,
  Users,
  Building2
} from 'lucide-react';
import { logout } from '@/store/slices/assetSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // Navigation items for super admin
  const superAdminNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Institutions',
      href: '/institutions',
      icon: Building2,
      current: location.pathname === '/institutions'
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      current: location.pathname === '/users'
    },
    {
      name: 'Asset Validation',
      href: '/assets/validate',
      icon: FileCheck,
      current: location.pathname === '/assets/validate'
    }
  ];

  const handleNavigation = (href) => {
    navigate(href);
  };

  const handleLogout =()=>{
    localStorage.removeItem('token');
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation header */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                {/* Your logo here */}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {superAdminNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      item.current
                        ? 'border-b-2 border-primary text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="mr-4 text-sm text-gray-500">
                {user?.email}
              </div>
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
              >
                <Settings className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => {/* Implement logout */}}
                className="ml-3 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
              >
                <Link to="/login" >
                <LogOut
                
                onClick={handleLogout}
                className="h-6 w-6"  />

                </Link>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;