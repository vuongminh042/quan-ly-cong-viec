export const API_URL = 'http://localhost:5000/api';

export const TASK_STATUS = [
  { value: 'todo', label: 'Chuẩn bị làm' },
  { value: 'in-progress', label: 'Đang làm' },
  { value: 'completed', label: 'Hoàn thành' }
];

export const TASK_PRIORITY = [
  { value: 'low', label: 'Thấp', color: 'bg-green-500' },
  { value: 'medium', label: 'Trung bình', color: 'bg-amber-500' },
  { value: 'high', label: 'Cao', color: 'bg-red-500' }
];

export const PROJECT_COLORS = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EF4444', label: 'Red' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#22C55E', label: 'Green' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#64748B', label: 'Slate' }
];