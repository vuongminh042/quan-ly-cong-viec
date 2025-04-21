import {
  ListFilter,
  Loader,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import { Task, useTask } from '../contexts/TaskContext';
import { TASK_PRIORITY, TASK_STATUS } from '../utils/constants';

interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  project?: string;
  labels: string;
}

const Tasks = () => {
  const { tasks, projects, isLoading, fetchTasks, fetchProjects, addTask, updateTask } = useTask();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

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
      setValue('project', currentTask.project);
      setValue('labels', currentTask.labels.join(', '));
    }
  }, [currentTask, setValue]);

  const openModal = (task: Task | null = null) => {
    setCurrentTask(task);
    if (!task) {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        project: '',
        labels: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTask(null);
    reset();
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const taskData = {
        ...data,
        labels: data.labels ? data.labels.split(',').map(label => label.trim()) : []
      };

      if (currentTask) {
        await updateTask(currentTask._id, taskData);
        toast.success('Task updated successfully');
      } else {
        await addTask(taskData as any);
        toast.success('Task created successfully');
      }
      closeModal();
    } catch (error) {
      toast.error(currentTask ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    const projectMatch = filterProject === 'all' || task.project === filterProject;
    return statusMatch && priorityMatch && projectMatch;
  });

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Công việc của tôi</h1>
          <p className="text-gray-600">Quản lý công việc của bạn và theo dõi tiến độ</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">Tất cả trạng thái</option>
              {TASK_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Ưu tiên
            </label>
            <select
              id="priority-filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="form-input"
            >
              <option value="all">Tất cả các ưu tiên</option>
              {TASK_PRIORITY.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="project-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Dự án
            </label>
            <select
              id="project-filter"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="form-input"
            >
              <option value="all">Tất cả dự án</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
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
            <ListFilter className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy công việc nào</h3>
          <p className="mt-2 text-gray-500">
            Hãy thử thay đổi các tùy chọn bộ lọc của bạn hoặc tạo một công việc mới.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} onEdit={openModal} />
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showModal && (
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
                        {currentTask ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
                      </h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-4">
                        <label htmlFor="title" className="form-label">Tên công việc</label>
                        <input
                          type="text"
                          id="title"
                          className="form-input"
                          {...register('title', { required: 'Vui lòng nhập tên công việc' })}
                        />
                        {errors.title && <p className="form-error">{errors.title.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="description" className="form-label">Mô tả</label>
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
                          {...register('dueDate', { required: 'Vui lòng nhập ngày đến hạn' })}
                        />
                        {errors.dueDate && <p className="form-error">{errors.dueDate.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="project" className="form-label">Dự án</label>
                        <select
                          id="project"
                          className="form-input"
                          {...register('project')}
                        >
                          <option value="">Không có dự án nào</option>
                          {projects.map(project => (
                            <option key={project._id} value={project._id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
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
                          {isSubmitting ? 'Saving...' : currentTask ? 'Chỉnh sửa công việc' : 'Tạo công việc'}
                        </button>
                        <button
                          type="button"
                          onClick={closeModal}
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
    </div>
  );
};

export default Tasks;