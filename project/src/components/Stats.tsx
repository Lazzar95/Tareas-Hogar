import type { Task, FamilyMember } from '../types';
import { MEMBER_COLORS } from '../types';

interface StatsProps {
  tasks: Task[];
  members: FamilyMember[];
}

export default function Stats({ tasks, members }: StatsProps) {
  const getMemberStats = (member: FamilyMember) => {
    const memberTasks = tasks.filter(t => t.assigned_to === member.name);
    const completed = memberTasks.filter(t => t.completed).length;
    const total = memberTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  // Calcular totales
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Encontrar al que más ha completado
  const memberWithMostCompleted = members.reduce((best, member) => {
    const stats = getMemberStats(member);
    const bestStats = getMemberStats(best);
    return stats.completed > bestStats.completed ? member : best;
  }, members[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Resumen general */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-display font-bold text-mint-600">{completedTasks}</div>
          <div className="text-xs text-gray-500 font-medium mt-1">Completadas</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-display font-bold text-coral-500">{pendingTasks}</div>
          <div className="text-xs text-gray-500 font-medium mt-1">Pendientes</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-display font-bold text-lavender-500">{totalTasks}</div>
          <div className="text-xs text-gray-500 font-medium mt-1">Total</div>
        </div>
      </div>

      {/* Contribución por miembro */}
      <div className="glass-card-strong p-6">
        <h3 className="font-display text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <span>📊</span>
          Contribución del hogar
        </h3>
        
        <div className="space-y-5">
          {members.map((member, index) => {
            const stats = getMemberStats(member);
            const color = MEMBER_COLORS[member.color_index];
            const isTopContributor = member.id === memberWithMostCompleted?.id && stats.completed > 0;

            return (
              <div 
                key={member.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg relative"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {member.name.charAt(0)}
                      {isTopContributor && (
                        <span className="absolute -top-1 -right-1 text-sm">👑</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500">
                        {stats.completed}/{stats.total} tareas
                      </p>
                    </div>
                  </div>
                  <span 
                    className="font-display font-bold text-xl"
                    style={{ color: color.text }}
                  >
                    {stats.percentage}%
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${stats.percentage}%`,
                      background: `linear-gradient(135deg, ${color.text} 0%, ${color.ring} 100%)`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        {/* Blobs decorativos */}
        <div className="blob blob-mint w-32 h-32 -top-16 -left-16 opacity-40" />
        <div className="blob blob-lavender w-32 h-32 -bottom-16 -right-16 opacity-40" />
        
        <div className="relative z-10">
          <div className="text-5xl mb-4 animate-float">🏆</div>
          <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
            ¡Trabajo en equipo!
          </h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            {completedTasks === 0 
              ? 'Empezad a completar tareas para ver vuestro progreso'
              : completedTasks === totalTasks && totalTasks > 0
                ? '¡Increíble! Habéis completado todas las tareas 🎉'
                : 'Seguid así, vuestro hogar está cada vez más organizado'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
