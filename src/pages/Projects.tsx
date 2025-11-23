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

interface DuAnFormData {
  name: string;
  description: string;
  color: string;
}

const DuAn = () => {
  const { projects, tasks, isLoading, fetchProjects, addProject, updateProject, deleteProject } = useTask();
  const [hienThiModal, setHienThiModal] = useState(false);
  const [duAnHienTai, setDuAnHienTai] = useState<Project | null>(null);
  const [dangGui, setDangGui] = useState(false);
  const [menuDuAnMo, setMenuDuAnMo] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DuAnFormData>();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (duAnHienTai) {
      setValue('name', duAnHienTai.name);
      setValue('description', duAnHienTai.description);
      setValue('color', duAnHienTai.color);
    }
  }, [duAnHienTai, setValue]);

  const moModal = (duAn: Project | null = null) => {
    setDuAnHienTai(duAn);
    if (!duAn) {
      reset({
        name: '',
        description: '',
        color: PROJECT_COLORS[0].value
      });
    }
    setHienThiModal(true);
  };

  const dongModal = () => {
    setHienThiModal(false);
    setDuAnHienTai(null);
    reset();
  };

  const onSubmit = async (data: DuAnFormData) => {
    try {
      setDangGui(true);
      if (duAnHienTai) {
        await updateProject(duAnHienTai._id, data);
        toast.success('Cập nhật dự án thành công');
      } else {
        await addProject(data);
        toast.success('Tạo dự án thành công');
      }
      dongModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(duAnHienTai ? 'Cập nhật dự án thất bại' : 'Tạo dự án thất bại');
    } finally {
      setDangGui(false);
    }
  };

  const handleXoaDuAn = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa dự án này không?')) {
      try {
        await deleteProject(id);
        toast.success('Xóa dự án thành công');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Xóa dự án thất bại');
      }
    }
  };

  const demSoCongViec = (projectId: string) => {
    return tasks.filter(task => task.project === projectId).length;
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Dự án</h1>
          <p className="text-white/90 text-lg">Quản lý các dự án của bạn và theo dõi tiến độ</p>
        </div>
        <button
          onClick={() => moModal()}
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
              onClick={() => moModal()}
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
                      onClick={() => setMenuDuAnMo(menuDuAnMo === project._id ? null : project._id)}
                      className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>

                    {menuDuAnMo === project._id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setMenuDuAnMo(null);
                              moModal(project);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="mr-3 h-4 w-4 text-gray-400" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => {
                              setMenuDuAnMo(null);
                              handleXoaDuAn(project._id);
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
                    {demSoCongViec(project._id)} công việc
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

      {/* Modal dự án */}
      {hienThiModal && (
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
                        {duAnHienTai ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
                      </h3>
                      <button
                        onClick={dongModal}
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
                          {...register('name', { required: 'Tên dự án không được để trống' })}
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
                          disabled={dangGui}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {dangGui ? 'Đang lưu...' : duAnHienTai ? 'Cập nhật dự án' : 'Tạo dự án'}
                        </button>
                        <button
                          type="button"
                          onClick={dongModal}
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

export default DuAn;
