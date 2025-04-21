import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask, Project } from '../contexts/TaskContext';
import {
  Plus,
  X,
  Folder,
  Trash2,
  Clock,
  MoreVertical,
  Edit,
  Loader
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PROJECT_COLORS } from '../utils/constants';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
}

const Projects = () => {
  const { projects, tasks, isLoading, fetchProjects, addProject, updateProject, deleteProject } = useTask();
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectFormData>();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (currentProject) {
      setValue('name', currentProject.name);
      setValue('description', currentProject.description);
      setValue('color', currentProject.color);
    }
  }, [currentProject, setValue]);

  const openModal = (project: Project | null = null) => {
    setCurrentProject(project);
    if (!project) {
      reset({
        name: '',
        description: '',
        color: PROJECT_COLORS[0].value
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProject(null);
    reset();
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      if (currentProject) {
        await updateProject(currentProject._id, data);
        toast.success('Project updated successfully');
      } else {
        await addProject(data);
        toast.success('Project created successfully');
      }
      closeModal();
    } catch (error) {
      toast.error(currentProject ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter(task => task.project === projectId).length;
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dự án</h1>
          <p className="text-gray-600">Quản lý các dự án của bạn và theo dõi tiến độ</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo dự án mới</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Folder className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy dự án nào</h3>
          <p className="mt-2 text-gray-500">
            Tạo một dự án mới để sắp xếp các công việc của bạn.
          </p>
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="btn btn-primary flex items-center gap-1 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo dự án mới</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-2" style={{ backgroundColor: project.color }}></div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <Link to={`/projects/${project._id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{project.name}</h3>
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setProjectMenuOpen(projectMenuOpen === project._id ? null : project._id)}
                      className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>

                    {projectMenuOpen === project._id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setProjectMenuOpen(null);
                              openModal(project);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="mr-3 h-4 w-4 text-gray-400" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => {
                              setProjectMenuOpen(null);
                              handleDeleteProject(project._id);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 className="mr-3 h-4 w-4 text-red-400" />
                            Xóa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-600 line-clamp-2">{project.description}</p>

                <div className="mt-6 flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getProjectTaskCount(project._id)} tasks
                  </span>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>

                <Link
                  to={`/projects/${project._id}`}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Xem chi tiết dự án
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
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
                        {currentProject ? 'Edit Project' : 'Create New Project'}
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
                        <label htmlFor="name" className="form-label">Tên dự án</label>
                        <input
                          type="text"
                          id="name"
                          className="form-input"
                          {...register('name', { required: 'Project name is required' })}
                        />
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
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

                      <div className="mb-4">
                        <label className="form-label">Màu sắc</label>
                        <div className="grid grid-cols-4 gap-3 mt-2">
                          {PROJECT_COLORS.map((color, index) => (
                            <div key={index} className="relative">
                              <input
                                type="radio"
                                id={`color-${index}`}
                                value={color.value}
                                className="sr-only"
                                {...register('color')}
                              />
                              <label
                                htmlFor={`color-${index}`}
                                className="block w-full h-8 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                              ></label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {isSubmitting ? 'Saving...' : currentProject ? 'Update Project' : 'Create Project'}
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

export default Projects;