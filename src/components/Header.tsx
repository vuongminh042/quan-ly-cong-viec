import { Bell, LogOut, Menu as MenuIcon, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  openSidebar: () => void;
}

const Header = ({ openSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              onClick={openSidebar}
            >
              <span className="sr-only">Mở menu bên</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Tìm kiếm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tìm kiếm"
                    type="search"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Xem thông báo</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Menu người dùng */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="max-w-xs bg-gray-100 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Mở menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>

              {showProfileMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="mr-3 h-4 w-4 text-gray-400" />
                    Hồ sơ của bạn
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown thông báo */}
      {showNotifications && (
        <div className="origin-top-right absolute right-12 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-2">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="text-sm font-medium">Thông báo</h3>
              <button className="text-xs text-blue-500 hover:text-blue-700">Đánh dấu đã đọc hết</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="px-4 py-3 hover:bg-gray-50 border-b">
                <p className="text-sm font-medium">Sắp đến hạn công việc</p>
                <p className="text-xs text-gray-500">Hoàn thành "Cài đặt dự án" trong vòng 2 giờ</p>
              </div>
              <div className="px-4 py-3 hover:bg-gray-50 border-b bg-blue-50">
                <p className="text-sm font-medium">Công việc mới được giao</p>
                <p className="text-xs text-gray-500">Bạn vừa được giao "Thiết kế wireframe"</p>
              </div>
              <div className="px-4 py-3 hover:bg-gray-50">
                <p className="text-sm font-medium">Đã hoàn thành công việc</p>
                <p className="text-xs text-gray-500">"API phía sau" đã được đánh dấu hoàn thành</p>
              </div>
            </div>
            <div className="px-4 py-2 border-t">
              <Link
                to="#"
                className="block text-center text-sm text-blue-500 hover:text-blue-700"
                onClick={() => setShowNotifications(false)}
              >
                Xem tất cả thông báo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
