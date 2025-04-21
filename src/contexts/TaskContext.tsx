import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  project?: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  addTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/tasks`, getAuthHeaders());
      setTasks(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/projects`, getAuthHeaders());
      setProjects(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task, getAuthHeaders());
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      setError('Failed to add task');
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, task, getAuthHeaders());
      setTasks(prev => prev.map(t => t._id === id ? response.data : t));
      return response.data;
    } catch (error) {
      setError('Failed to update task');
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeaders());
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      setError('Failed to delete task');
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const addProject = async (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, project, getAuthHeaders());
      setProjects(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      setError('Failed to add project');
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, project, getAuthHeaders());
      setProjects(prev => prev.map(p => p._id === id ? response.data : p));
      return response.data;
    } catch (error) {
      setError('Failed to update project');
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/projects/${id}`, getAuthHeaders());
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      setError('Failed to delete project');
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTasks();
      fetchProjects();
    }
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        isLoading,
        error,
        fetchTasks,
        fetchProjects,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        updateProject,
        deleteProject
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};