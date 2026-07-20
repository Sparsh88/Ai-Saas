import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../store/workspaceStore';
import {
  KanbanSquare,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  Clock,
  Loader
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const {
    projects,
    activeProject,
    loading,
    fetchProjects,
    selectProject,
    createProject,
    createTask,
    updateTaskStatus,
    deleteTask,
  } = useWorkspaceStore();

  const [viewMode, setViewMode] = useState<'KANBAN' | 'CALENDAR'>('KANBAN');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // Input fields
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    await createProject(newProjName, newProjDesc);
    setNewProjName('');
    setNewProjDesc('');
    setShowAddProject(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeProject) return;
    await createTask(activeProject.id, {
      title: taskTitle,
      description: taskDesc,
      priority: taskPriority,
      dueDate: taskDueDate || null,
      status: 'TODO'
    });
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('MEDIUM');
    setTaskDueDate('');
    setShowAddTask(false);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <Loader className="w-6 h-6 animate-spin text-indigo-400 mr-2" />
        <span>Loading workspace modules...</span>
      </div>
    );
  }

  // Filter tasks into columns
  const todoTasks = activeProject?.tasks.filter((t) => t.status === 'TODO') || [];
  const inProgressTasks = activeProject?.tasks.filter((t) => t.status === 'IN_PROGRESS') || [];
  const doneTasks = activeProject?.tasks.filter((t) => t.status === 'DONE') || [];

  return (
    <div className="space-y-6">
      {/* Project Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-indigo-400" />
          <select
            value={activeProject?.id || ''}
            onChange={(e) => selectProject(e.target.value)}
            className="bg-slate-900 border border-white/5 text-slate-200 text-sm font-bold rounded-xl px-3 py-2 outline-none focus:border-indigo-500/50"
          >
            {projects.length === 0 && <option value="">No Active Projects</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddProject(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-colors"
            title="Create Project"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode controls & Add task button */}
        {activeProject && (
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex bg-slate-900 border border-white/5 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'KANBAN'
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <KanbanSquare className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('CALENDAR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'CALENDAR'
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Main Boards */}
      {activeProject ? (
        viewMode === 'KANBAN' ? (
          /* Kanban View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columns Mapping */}
            {[
              { id: 'TODO', title: 'To Do', tasks: todoTasks, glow: 'border-t-indigo-500' },
              { id: 'IN_PROGRESS', title: 'In Progress', tasks: inProgressTasks, glow: 'border-t-purple-500' },
              { id: 'DONE', title: 'Done', tasks: doneTasks, glow: 'border-t-emerald-500' }
            ].map((col) => (
              <div key={col.id} className="p-4 rounded-xl border border-white/5 bg-slate-900/20 flex flex-col min-h-[450px]">
                <div className={`flex items-center justify-between border-t-2 ${col.glow} pt-3 pb-4 mb-2`}>
                  <span className="text-xs font-bold text-slate-350">{col.title}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                    {col.tasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  <AnimatePresence mode="popLayout">
                    {col.tasks.map((task) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.94, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: -8 }}
                        whileHover={{ y: -3 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        key={task.id}
                        className="p-4 rounded-xl glass-card border border-white/5 bg-slate-950/45 flex flex-col justify-between group cursor-pointer"
                      >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors leading-snug">{task.title}</h4>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded text-slate-650 hover:text-rose-400 hover:bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/2">
                        {/* Due date */}
                        <div className="flex items-center gap-1 text-[9px] text-slate-550">
                          <Clock className="w-3 h-3" />
                          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                        </div>

                        {/* Priority Selector or Status Toggle */}
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                            task.priority === 'HIGH'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : task.priority === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-450 border border-indigo-500/20'
                          }`}>
                            {task.priority}
                          </span>
                          
                          {/* Quick stage cycle clicker */}
                          <button
                            onClick={() => {
                              const stages: Array<'TODO' | 'IN_PROGRESS' | 'DONE'> = ['TODO', 'IN_PROGRESS', 'DONE'];
                              const nextIdx = (stages.indexOf(task.status) + 1) % stages.length;
                              updateTaskStatus(task.id, stages[nextIdx]);
                            }}
                            className="p-1 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 hover:text-indigo-400 transition-colors"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>

                  {col.tasks.length === 0 && (
                    <div className="py-12 text-center text-slate-650 text-xs font-sans">
                      No cards here.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Calendar View */
          <div className="p-6 rounded-xl glass-panel border border-white/5 bg-slate-900/40">
            <h3 className="text-sm font-heading font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <CalendarIcon className="w-4.5 h-4.5 text-indigo-400" />
              <span>Deadlines Calendar</span>
            </h3>
            
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {activeProject.tasks.filter((t) => t.dueDate).length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No tasks with active deadline dates found in this project.
                </div>
              ) : (
                activeProject.tasks
                  .filter((t) => t.dueDate)
                  .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                  .map((task) => (
                    <div key={task.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-250">{task.title}</h4>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Project: {activeProject.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-300">{new Date(task.dueDate!).toLocaleDateString()}</p>
                          <span className="text-[10px] text-slate-500">Scheduled Date</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          task.status === 'DONE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-450'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )
      ) : (
        <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
          <FolderOpen className="w-8 h-8 text-slate-700" />
          <span>You don't have any active projects yet. Click the folder icon above to add one.</span>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Create Workspace Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Job Hunt 2026"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 px-3 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Summarize goals or topics..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 px-3 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end border-t border-white/5 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Add Task Card</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Polish resume section"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 px-3 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Task details..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 px-3 text-slate-100 placeholder-slate-650 text-xs outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 px-3 text-slate-100 text-xs outline-none transition-all"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 focus:border-indigo-500/50 rounded-lg py-2 px-3 text-slate-100 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-white/5 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskManager;
