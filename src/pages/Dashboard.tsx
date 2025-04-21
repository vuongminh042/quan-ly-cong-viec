import { useEffect, useState } from 'react';
import { useTask, Task } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import { LayoutGrid, ListFilter, Plus, Loader, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';

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
  const completedToday = completedTasks.filter(task => {
    const completedDate = new Date(task.updatedAt);
    const today = new Date();
    return completedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  });

  const filteredTasks = filter === 'all'
    ? tasks
    : filter === 'today'
      ? dueTodayTasks
      : filter === 'overdue'
        ? overdueTasks
        : tasks.filter(task => task.status === filter);

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý công việc</h1>
        <p className="text-gray-600">
          {format(new Date(), "EEEE, 'ngày' d 'tháng' M, yyyy", { locale: vi })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Tất cả công việc</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <LayoutGrid className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoàn thành hôm nay</p>
              <p className="text-2xl font-bold">{completedToday.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Ngày đến hạn</p>
              <p className="text-2xl font-bold">{dueTodayTasks.length}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-md">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Quá hạn</p>
              <p className="text-2xl font-bold">{overdueTasks.length}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-md">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Công việc của tôi</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">Tất cả công việc</option>
                  <option value="today">Ngày đến hạn</option>
                  <option value="overdue">Ngày quá hạn</option>
                  <option value="todo">Chuẩn bị làm</option>
                  <option value="in-progress">Đang làm</option>
                  <option value="completed">Hoàn thành</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ListFilter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy công việc nào ?</h3>
              <p className="mt-2 text-gray-500">
                {filter === 'all' ? 'Bạn chưa có công việc nào.' : `Bạn chưa có công việc nào thuộc loại "${filter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.slice(0, 4).map(task => (
                <TaskCard key={task._id} task={task} onEdit={setSelectedTask} />
              ))}
            </div>
          )}

          {filteredTasks.length > 4 && (
            <div className="mt-6 text-center">
              <button className="btn btn-ghost">Danh sách công việc</button>
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {completedTasks.slice(0, 5).map((task, index) => (
              <div key={index} className="p-4 flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Công việc đã hoàn thành</p>
                  <p className="text-sm text-gray-500">{task.title}</p>
                  <p className="text-xs text-gray-400">{format(new Date(task.updatedAt), 'MMM d, h:mm a')}</p>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">Không có hoạt động gần đây</p>
              </div>
            )}
          </div>

          <div className="mt-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Dự án của tôi</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {projects.slice(0, 3).map((project, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ backgroundColor: project.color }}>
                    <span className="text-white font-bold">{project.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {tasks.filter(task => task.project === project._id).length} tasks
                  </span>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">Chưa có dự án nào</p>
                <button className="mt-2 btn btn-ghost text-sm"><Link to='/projects' className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200">Tạo dự án mới</Link></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;