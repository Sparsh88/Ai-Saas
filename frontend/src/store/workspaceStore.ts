import { create } from 'zustand';
import axios from 'axios';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceState {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  selectProject: (projectId: string) => void;
  createProject: (name: string, description?: string) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (projectId: string, taskData: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => Promise<void>;
  updateTaskDetails: (taskId: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  projects: [],
  activeProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    const { projects: existing } = get();
    if (existing.length === 0) {
      set({ loading: true, error: null });
    }
    try {
      const response = await axios.get('/api/workspace/projects');
      const projects = response.data;
      
      const { activeProject } = get();
      let updatedActiveProject = null;
      
      if (activeProject) {
        updatedActiveProject = projects.find((p: Project) => p.id === activeProject.id) || null;
      } else if (projects.length > 0) {
        updatedActiveProject = projects[0];
      }

      set({ projects, activeProject: updatedActiveProject, loading: false });
    } catch (err: any) {
      set({ error: 'Failed to load projects.', loading: false });
    }
  },

  selectProject: (projectId) => {
    const { projects } = get();
    const active = projects.find((p) => p.id === projectId) || null;
    set({ activeProject: active });
  },

  createProject: async (name, description) => {
    try {
      const response = await axios.post('/api/workspace/projects', { name, description });
      const newProj = response.data;
      
      const currentProjects = get().projects;
      set({
        projects: [newProj, ...currentProjects],
        activeProject: newProj,
      });
      return newProj;
    } catch (err) {
      console.error('Create project error:', err);
      return null;
    }
  },

  deleteProject: async (id) => {
    try {
      await axios.delete(`/api/workspace/projects/${id}`);
      const remainingProjects = get().projects.filter((p) => p.id !== id);
      
      let nextActive = null;
      if (remainingProjects.length > 0) {
        nextActive = remainingProjects[0];
      }
      
      set({ projects: remainingProjects, activeProject: nextActive });
    } catch (err) {
      console.error('Delete project error:', err);
    }
  },

  createTask: async (projectId, taskData) => {
    try {
      const response = await axios.post(`/api/workspace/projects/${projectId}/tasks`, taskData);
      const newTask = response.data;
      
      // Update projects list locally
      const updatedProjects = get().projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, tasks: [...p.tasks, newTask] };
        }
        return p;
      });

      set({ projects: updatedProjects });

      // Refresh active project references
      const active = get().activeProject;
      if (active && active.id === projectId) {
        set({ activeProject: { ...active, tasks: [...active.tasks, newTask] } });
      }
    } catch (err) {
      console.error('Create task error:', err);
    }
  },

  updateTaskStatus: async (taskId, newStatus) => {
    try {
      const response = await axios.put(`/api/workspace/tasks/${taskId}`, { status: newStatus });
      const updatedTask = response.data;

      // Update locally
      const updatedProjects = get().projects.map((p) => {
        if (p.id === updatedTask.projectId) {
          return {
            ...p,
            tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          };
        }
        return p;
      });

      set({ projects: updatedProjects });

      const active = get().activeProject;
      if (active && active.id === updatedTask.projectId) {
        set({
          activeProject: {
            ...active,
            tasks: active.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          },
        });
      }
    } catch (err) {
      console.error('Update status task error:', err);
    }
  },

  updateTaskDetails: async (taskId, taskData) => {
    try {
      const response = await axios.put(`/api/workspace/tasks/${taskId}`, taskData);
      const updatedTask = response.data;

      // Update locally
      const updatedProjects = get().projects.map((p) => {
        if (p.id === updatedTask.projectId) {
          return {
            ...p,
            tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          };
        }
        return p;
      });

      set({ projects: updatedProjects });

      const active = get().activeProject;
      if (active && active.id === updatedTask.projectId) {
        set({
          activeProject: {
            ...active,
            tasks: active.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          },
        });
      }
    } catch (err) {
      console.error('Update task details error:', err);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`/api/workspace/tasks/${taskId}`);

      const active = get().activeProject;
      if (active) {
        const remainingTasks = active.tasks.filter((t) => t.id !== taskId);
        
        const updatedProjects = get().projects.map((p) => {
          if (p.id === active.id) {
            return { ...p, tasks: remainingTasks };
          }
          return p;
        });

        set({
          projects: updatedProjects,
          activeProject: { ...active, tasks: remainingTasks },
        });
      }
    } catch (err) {
      console.error('Delete task error:', err);
    }
  },
}));
