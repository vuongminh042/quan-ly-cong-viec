import { useEffect, useState } from 'react';
import { useTask, Task } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import { 
  LayoutGrid, 
  ListFilter, 
  Loader, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Calendar
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import ProgressRing from '../components/charts/ProgressRing';
import TaskPieChart from '../components/charts/TaskPieChart';
import TaskBarChart from '../components/charts/TaskBarChart';
import TaskAreaChart from '../components/charts/TaskAreaChart';

const Dashboard = () => {
  const { tasks, projects, isLoading, fetchTasks, fetchProjects } = useTask();
  const [, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const dueTodayTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  });

  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  });

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const todoTasks = tasks.filter(task => task.status === 'todo');
  
  const completedToday = completedTasks.filter(task => {
    const completedDate = new Date(task.updatedAt);
    const today = new Date();
    return completedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  });

  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const pieChartData = [
    { name: 'Hoàn thành', value: completedTasks.length, color: '#43e97b' },
    { name: 'Đang làm', value: inProgressTasks.length, color: '#4facfe' },
    { name: 'Chuẩn bị', value: todoTasks.length, color: '#f093fb' },
    { name: 'Quá hạn', value: overdueTasks.length, color: '#ff6b6b' },
  ].filter(item => item.value > 0);

  const getWeekData = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map(day => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === day.toDateString();
      });

      return {
        name: format(day, 'EEE', { locale: vi }),
        completed: dayTasks.filter(t => t.status === 'completed').length,
        pending: dayTasks.filter(t => t.status === 'in-progress').length,
        overdue: dayTasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate < new Date() && t.status !== 'completed';
        }).length,
      };
    });
  };

  const getAreaChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
    
    return last7Days.map(day => ({
      date: format(day, 'dd/MM'),
      tasks: tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === day.toDateString();
      }).length,
    }));
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : filter === 'today'
      ? dueTodayTasks
      : filter === 'overdue'
        ? overdueTasks
        : tasks.filter(task => task.status === filter);

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Quản lý công việc
        </h1>
        <p className="text-white/90 text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {format(new Date(), "EEEE, 'ngày' d 'tháng' M, yyyy", { locale: vi })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card animate-scale-in">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Tất cả công việc</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {tasks.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">Tổng số công việc</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <LayoutGrid className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="stats-card animate-scale-in delay-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Hoàn thành hôm nay</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                {completedToday.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">+{completedTasks.length} tổng cộng</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-lg">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="stats-card animate-scale-in delay-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Đến hạn hôm nay</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {dueTodayTasks.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">Cần hoàn thành</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <Clock className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="stats-card animate-scale-in delay-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Quá hạn</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {overdueTasks.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">Cần xử lý gấp</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg animate-pulse-glow">
              <AlertTriangle className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="chart-container animate-slide-in-left">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Tỷ lệ hoàn thành
          </h3>
          <div className="flex flex-col items-center justify-center py-4">
            <ProgressRing 
              progress={completionRate} 
              size={180}
              strokeWidth={12}
              color="#667eea"
            />
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                <p className="text-xs text-gray-600">Hoàn thành</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</p>
                <p className="text-xs text-gray-600">Đang làm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container animate-slide-up delay-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Phân bổ công việc
          </h3>
          <TaskPieChart data={pieChartData} />
        </div>

        <div className="chart-container animate-slide-in-right">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Xu hướng 7 ngày
          </h3>
          <TaskAreaChart data={getAreaChartData()} />
        </div>
      </div>

      <div className="chart-container mb-8 animate-slide-up delay-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Thống kê tuần này
        </h3>
        <TaskBarChart data={getWeekData()} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Công việc của tôi</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border-2 border-white/30 bg-white/90 backdrop-blur-md rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 text-sm font-medium transition-all"
                >
                  <option value="all">Tất cả công việc</option>
                  <option value="today">Đến hạn hôm nay</option>
                  <option value="overdue">Quá hạn</option>
                  <option value="todo">Chuẩn bị làm</option>
                  <option value="in-progress">Đang làm</option>
                  <option value="completed">Hoàn thành</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <ListFilter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 glass-card-white rounded-2xl">
              <Loader className="h-10 w-10 text-purple-500 animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="glass-card-white rounded-2xl p-12 text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy công việc nào</h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'Bạn chưa có công việc nào.' : `Bạn chưa có công việc nào thuộc loại "${filter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.slice(0, 6).map((task, index) => (
                <div 
                  key={task._id} 
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard task={task} onEdit={setSelectedTask} />
                </div>
              ))}
            </div>
          )}

          {filteredTasks.length > 6 && (
            <div className="mt-6 text-center">
              <Link to="/tasks">
                <button className="btn btn-primary">
                  Xem tất cả công việc ({filteredTasks.length})
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-4">Hoạt động gần đây</h2>
          </div>
          <div className="glass-card-white rounded-2xl divide-y divide-gray-100">
            {completedTasks.slice(0, 5).map((task, index) => (
              <div key={index} className="p-4 flex items-start hover:bg-purple-50/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Công việc đã hoàn thành</p>
                  <p className="text-sm text-gray-600 line-clamp-1">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{format(new Date(task.updatedAt), 'dd/MM/yyyy, HH:mm')}</p>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">Chưa có hoạt động gần đây</p>
              </div>
            )}
          </div>

          <div className="mt-8 mb-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-4">Dự án của tôi</h2>
          </div>
          <div className="glass-card-white rounded-2xl divide-y divide-gray-100">
            {projects.slice(0, 4).map((project, index) => (
              <Link 
                key={index} 
                to={`/projects/${project._id}`}
                className="p-4 flex items-center justify-between hover:bg-purple-50/50 transition-all group"
              >
                <div className="flex items-center flex-1">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform" 
                    style={{ 
                      background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}dd 100%)` 
                    }}
                  >
                    <span className="text-white font-bold text-lg">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{project.description}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                    {tasks.filter(task => task.project === project._id).length} tasks
                  </span>
                </div>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-3">Chưa có dự án nào</p>
                <Link to='/projects'>
                  <button className="btn btn-primary text-sm">
                    Tạo dự án mới
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;