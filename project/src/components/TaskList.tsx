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
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getMemberColor = (assignedTo: string) => {
    const member = members.find(m => m.name === assignedTo);
    return member ? MEMBER_COLORS[member.color_index] : MEMBER_COLORS[0];
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const color = getMemberColor(task.assigned_to);

    return (
      <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white/80 hover:shadow-lg transition-all ${task.completed ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="w-8 h-8 rounded-xl border-3 border-gray-300 checked:bg-green-500 checked:border-green-500 cursor-pointer flex-shrink-0 mt-1 transition-all"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{TASK_ICONS[task.category]}</span>
              <div className="flex-1">
                <h4 className={`font-semibold text-gray-800 text-lg ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-sm font-semibold border"
                style={{
                  backgroundColor: color.bg,
                  color: color.text,
                  borderColor: color.ring
                }}
              >
                {task.assigned_to}
              </span>
              {task.frequency && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {task.frequency}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
      <button
        onClick={onAdd}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
      >
        + Nueva tarea
      </button>

      {tasks.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/80 shadow-md">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Todo limpio
          </h3>
          <p className="text-gray-600">
            Añade la primera tarea para empezar
          </p>
        </div>
      ) : (
        <>
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-700 mb-3 px-2 text-lg">
                Pendientes ({pendingTasks.length})
              </h3>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-700 mb-3 px-2 text-lg">
                Completadas ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
