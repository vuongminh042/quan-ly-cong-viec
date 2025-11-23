import {
  CheckSquare,
  Folder,
  LayoutDashboard,
  X,
  Sparkles
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
    <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-6 mb-8">
        <Link to="/" className="flex items-center group">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
            <CheckSquare className="h-7 w-7 text-white" />
          </div>
          <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Taskify
          </span>
        </Link>
        {closeSidebar && (
          <button
            className="ml-auto h-10 w-10 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden transition-all"
            onClick={closeSidebar}
          >
            <span className="sr-only">Đóng menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>
      
      <div className="mt-2 flex-grow flex flex-col">
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end={item.href === '/'}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="px-4 mt-6">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px] shadow-xl animate-pulse-glow">
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-5">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Tăng năng suất! 🚀
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bạn đang làm rất tốt! Tiếp tục phát huy nhé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

