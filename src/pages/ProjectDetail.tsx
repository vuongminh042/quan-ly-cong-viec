import {
  AlertCircle,
  ArrowLeft,
  BarChart2,
  CheckCircle2,
  Clock,
  Edit,
  Loader,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { Task, useTask } from '../contexts/TaskContext';
import { TASK_PRIORITY, TASK_STATUS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  labels: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tasks,
    projects,
    isLoading,
    fetchTasks,
    fetchProjects,
    addTask,
    updateTask,
    deleteProject
  } = useTask();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TaskFormData>();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (currentTask) {
      setValue('title', currentTask.title);
      setValue('description', currentTask.description);
      setValue('status', currentTask.status);
      setValue('priority', currentTask.priority);
      setValue('dueDate', currentTask.dueDate.split('T')[0]);
      setValue('labels', currentTask.labels.join(', '));
    }
  }, [currentTask, setValue]);

  const project = projects.find(p => p._id === id);
  const projectTasks = tasks.filter(task => task.project === id);

  const filteredTasks = filterStatus === 'all'
    ? projectTasks
    : projectTasks.filter(task => task.status === filterStatus);

  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress');
  const completedTasks = projectTasks.filter(task => task.status === 'completed');

  const completionRate = projectTasks.length
    ? Math.round((completedTasks.length / projectTasks.length) * 100)
    : 0;

  const openTaskModal = (task: Task | null = null) => {
    setCurrentTask(task);
    if (!task) {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        labels: ''
      });
    }
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setCurrentTask(null);
    reset();
  };

  const onSubmitTask = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const taskData = {
        ...data,
        project: id,
        labels: data.labels ? data.labels.split(',').map(label => label.trim()) : []
      };

      if (currentTask) {
        await updateTask(currentTask._id, taskData);
        toast.success('Task updated successfully');
      } else {
        await addTask(taskData as any);
        toast.success('Task created successfully');
      }
      closeTaskModal();
    } catch (error) {
      toast.error(currentTask ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id!);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Không có dự án nào</h2>
        <p className="mt-2 text-gray-500">Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 btn btn-primary"
        >
          Quay lại Dự án
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center mb-6 gap-2">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <div
              className="h-4 w-4 rounded-full mr-2"
              style={{ backgroundColor: project.color }}
            ></div>
            {project.name}
          </h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => navigate(`/projects/edit/${id}`)}
            className="btn btn-ghost flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Chỉnh sửa dự án</span>
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="btn btn-danger flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Xóa dự án</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số công việc</p>
              <p className="text-2xl font-bold">{projectTasks.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Được tạo vào</p>
              <p className="text-lg font-bold">{formatDate(project.createdAt)}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-md">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="rounded-lg bg-white shadow-sm p-4 flex-1">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Chuẩn bị làm</p>
            <p className="text-2xl font-bold text-gray-700">{todoTasks.length}</p>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow-sm p-4 flex-1">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Đang làm</p>
            <p className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</p>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow-sm p-4 flex-1">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900 mr-4">Công việc</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input max-w-xs"
          >
            <option value="all">Tất cả các trạng thái</option>
            {TASK_STATUS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => openTaskModal()}
          className="btn btn-primary flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm công việc</span>
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy công việc nào</h3>
          <p className="mt-2 text-gray-500">
            {filterStatus === 'all'
              ? 'This project has no tasks yet.'
              : `No ${filterStatus} tasks in this project.`}
          </p>
          <div className="mt-6">
            <button
              onClick={() => openTaskModal()}
              className="btn btn-primary flex items-center gap-1 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo công việc mới</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} onEdit={openTaskModal} />
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {currentTask ? 'Edit Task' : 'Create New Task'}
                      </h3>
                      <button
                        onClick={closeTaskModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmitTask)}>
                      <div className="mb-4">
                        <label htmlFor="title" className="form-label">Tên công việc</label>
                        <input
                          type="text"
                          id="title"
                          className="form-input"
                          {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <p className="form-error">{errors.title.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="description" className="form-label">Mô tả công việc</label>
                        <textarea
                          id="description"
                          rows={3}
                          className="form-input"
                          {...register('description')}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="status" className="form-label">Trạng thái</label>
                          <select
                            id="status"
                            className="form-input"
                            {...register('status')}
                          >
                            {TASK_STATUS.map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="priority" className="form-label">Ưu tiên</label>
                          <select
                            id="priority"
                            className="form-input"
                            {...register('priority')}
                          >
                            {TASK_PRIORITY.map(priority => (
                              <option key={priority.value} value={priority.value}>
                                {priority.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="dueDate" className="form-label">Ngày đến hạn</label>
                        <input
                          type="date"
                          id="dueDate"
                          className="form-input"
                          {...register('dueDate', { required: 'Due date is required' })}
                        />
                        {errors.dueDate && <p className="form-error">{errors.dueDate.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="labels" className="form-label">Nhãn (cách nhau bằng dấu phẩy)</label>
                        <input
                          type="text"
                          id="labels"
                          className="form-input"
                          placeholder="e.g. frontend, bug, feature"
                          {...register('labels')}
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {isSubmitting ? 'Saving...' : currentTask ? 'Update Task' : 'Create Task'}
                        </button>
                        <button
                          type="button"
                          onClick={closeTaskModal}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xóa dự án
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa dự án này không? Tất cả các nhiệm vụ liên quan đến dự án này sẽ trở thành không được gán. Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteProject}
                >
                  Xóa
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;