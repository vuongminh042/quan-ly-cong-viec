import {
  BarChart2,
  CheckSquare,
  Folder,
  LayoutDashboard,
  X
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

interface SidebarProps {
  closeSidebar?: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps = {}) => {
  const navigation = [
    { name: 'Thống kê', href: '/', icon: LayoutDashboard },
    { name: 'Công việc của tôi', href: '/tasks', icon: CheckSquare },
    { name: 'Dự án', href: '/projects', icon: Folder }
  ];

  return (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <Link to="/" className="flex items-center">
          <CheckSquare className="h-8 w-8 text-blue-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">Taskify</span>
        </Link>
        {closeSidebar && (
          <button
            className="ml-auto h-10 w-10 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={closeSidebar}
          >
            <span className="sr-only">Đóng menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end={item.href === '/'}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-3 mt-6">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Tăng năng suất</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Hoàn thành 5 công việc hôm nay! Tiếp tục phát huy nhé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
