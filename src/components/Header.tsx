import { LogOut, Menu as MenuIcon, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  openSidebar: () => void;
}

const Header = ({ openSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="glass-card-white shadow-lg z-10 border-b border-white/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
              onClick={openSidebar}
            >
              <span className="sr-only">Mở menu bên</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="ml-2 relative">
              <div>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="max-w-xs bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center text-sm focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Mở menu</span>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>

              {showProfileMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl py-2 glass-card-white border border-white/50 focus:outline-none animate-scale-in"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    role="menuitem"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Hồ sơ của bạn
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    role="menuitem"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
