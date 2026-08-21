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
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="w-48 h-9 bg-white/5 rounded-xl shimmer-effect" />
          <div className="w-32 h-9 bg-white/5 rounded-xl shimmer-effect" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['To Do', 'In Progress', 'Done'].map((colName, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-4 border border-white/5 bg-white/2 min-h-[480px] space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {colName}
                </span>
                <div className="w-5 h-5 rounded-full bg-white/10" />
              </div>
              {[1, 2, 3].map((cardIdx) => (
                <div
                  key={cardIdx}
                  className="p-4 rounded-xl border border-white/5 bg-white/5 shimmer-effect space-y-2.5"
                >
                  <div className="w-20 h-4 bg-white/15 rounded-full" />
                  <div className="w-3/4 h-4 bg-white/10 rounded" />
                  <div className="w-1/2 h-3 bg-white/5 rounded" />
                  <div className="w-1/3 h-3 bg-white/5 rounded mt-3" />
                </div>
              ))}
            </div>
          ))}
        </div>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1c1c1c] pb-4">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-blue-600 dark:text-[#3b82f6]" />
          <select
            value={activeProject?.id || ''}
            onChange={(e) => selectProject(e.target.value)}
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#222222] text-slate-900 dark:text-slate-200 text-sm font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500/50"
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
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Create Project"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode controls & Add task button */}
        {activeProject && (
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'KANBAN'
                    ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KanbanSquare className="w-4 h-4" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('CALENDAR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'CALENDAR'
                    ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Calendar</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/25 cursor-pointer"
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
              { id: 'TODO', title: 'To Do', tasks: todoTasks, glow: 'border-t-[#3b82f6]' },
              { id: 'IN_PROGRESS', title: 'In Progress', tasks: inProgressTasks, glow: 'border-t-sky-500' },
              { id: 'DONE', title: 'Done', tasks: doneTasks, glow: 'border-t-emerald-500' }
            ].map((col) => (
              <div key={col.id} className="p-4 rounded-2xl border border-slate-200 dark:border-[#1c1c1c] bg-white dark:bg-[#0d0d0d] flex flex-col min-h-[450px] shadow-sm">
                <div className={`flex items-center justify-between border-t-2 ${col.glow} pt-3 pb-4 mb-2`}>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-heading">{col.title}</span>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded-full">
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
                        className="p-4 rounded-xl border border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#111111] flex flex-col justify-between group cursor-pointer hover:border-blue-500/40 transition-all shadow-sm"
                      >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#3b82f6] transition-colors leading-snug">{task.title}</h4>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-200 dark:border-[#1c1c1c]">
                        {/* Due date */}
                        <div className="flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                        </div>

                        {/* Priority Selector or Status Toggle */}
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-lg ${
                            task.priority === 'HIGH'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : task.priority === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
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
                            className="p-1 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#3b82f6] transition-colors"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>

                  {col.tasks.length === 0 && (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-600 text-xs font-sans">
                      No cards here.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Calendar View */
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#1c1c1c] shadow-sm">
            <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <CalendarIcon className="w-4.5 h-4.5 text-[#3b82f6]" />
              <span>Deadlines Calendar</span>
            </h3>
            
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {activeProject.tasks.filter((t) => t.dueDate).length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                  No tasks with active deadline dates found in this project.
                </div>
              ) : (
                activeProject.tasks
                  .filter((t) => t.dueDate)
                  .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                  .map((task) => (
                    <div key={task.id} className="p-4 rounded-xl border border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#111111] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-[#3b82f6]">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{task.title}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Project: {activeProject.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">{new Date(task.dueDate!).toLocaleDateString()}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Scheduled Date</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          task.status === 'DONE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
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
        <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm flex flex-col items-center gap-2">
          <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          <span>You don't have any active projects yet. Click the folder icon above to add one.</span>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#222222] rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Create Workspace Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Job Hunt 2026"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] focus:border-blue-500/50 rounded-xl py-2.5 px-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Summarize goals or topics..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] focus:border-blue-500/50 rounded-xl py-2.5 px-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-200 dark:border-[#1c1c1c] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/25 cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#222222] rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Add Task Card</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Polish resume section"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] focus:border-blue-500/50 rounded-xl py-2.5 px-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Task details..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] focus:border-blue-500/50 rounded-xl py-2.5 px-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-xs outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] focus:border-blue-500/50 rounded-xl py-2.5 px-3 text-slate-900 dark:text-white text-xs outline-none transition-all"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#222222] focus:border-blue-500/50 rounded-xl py-2 px-3 text-slate-900 dark:text-white text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-200 dark:border-[#1c1c1c] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/25 cursor-pointer"
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
