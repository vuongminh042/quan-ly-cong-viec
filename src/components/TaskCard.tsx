import { useState } from 'react';
import { Task, useTask } from '../contexts/TaskContext';
import { formatDate, priorityColor, statusColor } from '../utils/helpers';
import { MoreVertical, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask, updateTask } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task._id);
      toast.success('Xóa công việc thành công');
    } catch (error) {
      toast.error('Xóa công việc thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (status: 'todo' | 'in-progress' | 'completed') => {
    try {
      await updateTask(task._id, { status });

      const statusText = status === 'todo' ? 'Chuẩn bị làm' : status === 'in-progress' ? 'Đang làm' : 'Hoàn thành';
      toast.success(`Công việc được đánh dấu là "${statusText}"`);
    } catch (error) {
      toast.error('Cập nhật trạng thái công việc thất bại');
    }
  };

  return (
    <div className={`card hover:shadow-card-hover ${task.priority ? `task-priority-${task.priority}` : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="mr-3 h-4 w-4 text-gray-400" />
                  Sửa
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(task.status).replace('bg-', 'bg-opacity-10 text-')
          }`}>
          <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColor(task.status)}`}></span>
          {task.status === 'todo' ? 'Chuẩn bị làm' : task.status === 'in-progress' ? 'Đang làm' : 'Hoàn thành'}
        </span>

        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor(task.priority).replace('bg-', 'bg-opacity-10 text-')
          }`}>
          <span className={`mr-1.5 h-2 w-2 rounded-full ${priorityColor(task.priority)}`}></span>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {task.labels && task.labels.map(label => (
          <span key={label} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        <div className="flex space-x-2">
          {task.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="p-1 rounded-full text-gray-400 hover:text-green-500 focus:outline-none"
              title="Đánh dấu đã hoàn thành"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
