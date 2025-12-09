import { useState } from 'react';
import type { Task, FamilyMember } from '../types';
import { TASK_ICONS, MEMBER_COLORS } from '../types';

interface TaskListProps {
  tasks: Task[];
  members: FamilyMember[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function TaskList({ tasks, members, onToggle, onDelete, onAdd }: TaskListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getMemberColor = (assignedTo: string) => {
    const member = members.find(m => m.name === assignedTo);
    return member ? MEMBER_COLORS[member.color_index] : MEMBER_COLORS[0];
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onDelete(id);
      setDeletingId(null);
    }, 300);
  };

  const TaskCard = ({ task, index }: { task: Task; index: number }) => {
    const color = getMemberColor(task.assigned_to);
    const isDeleting = deletingId === task.id;

    return (
      <div 
        className={`glass-card p-5 transition-all duration-300 ${
          task.completed ? 'opacity-60' : ''
        } ${isDeleting ? 'scale-95 opacity-0' : ''}`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox personalizado */}
          <button
            onClick={() => onToggle(task.id)}
            className={`w-7 h-7 rounded-xl border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center ${
              task.completed 
                ? 'bg-gradient-to-br from-mint-400 to-mint-500 border-mint-500 shadow-sm' 
                : 'border-gray-300 hover:border-mint-400 hover:bg-mint-50'
            }`}
          >
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Header con icono y título */}
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{TASK_ICONS[task.category] || '📝'}</span>
              <div className="flex-1">
                <h4 className={`font-semibold text-gray-800 text-lg leading-tight ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{task.description}</p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="badge transition-all hover:scale-105"
                style={{
                  backgroundColor: color.bg,
                  color: color.text,
                  borderColor: color.ring
                }}
              >
                {task.assigned_to}
              </span>
              {task.frequency && task.frequency !== 'Una vez' && (
                <span className="badge bg-gray-100 text-gray-600 border-gray-200">
                  🔄 {task.frequency}
                </span>
              )}
            </div>
          </div>

          {/* Botón de eliminar */}
          <button
            onClick={() => handleDelete(task.id)}
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-coral-500 hover:bg-coral-50 
                       transition-all flex items-center justify-center haptic opacity-0 group-hover:opacity-100"
            style={{ opacity: 1 }} // Temporalmente siempre visible en móvil
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Empty state */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="relative inline-block mb-6">
            <div className="text-7xl animate-float">✨</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/5 rounded-full blur-sm" />
          </div>
          <h3 className="font-display text-2xl font-bold text-gray-800 mb-3">
            ¡Todo en orden!
          </h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            No hay tareas pendientes. Añade la primera para empezar a organizaros.
          </p>
          <button
            onClick={onAdd}
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva tarea
          </button>
        </div>
      ) : (
        <>
          {/* Tareas pendientes */}
          {pendingTasks.length > 0 && (
            <section>
              <h3 className="font-display font-bold text-gray-700 mb-4 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral-400" />
                Pendientes
                <span className="text-gray-400 font-normal text-sm">({pendingTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Tareas completadas */}
          {completedTasks.length > 0 && (
            <section>
              <h3 className="font-display font-bold text-gray-700 mb-4 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint-400" />
                Completadas
                <span className="text-gray-400 font-normal text-sm">({completedTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {completedTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
