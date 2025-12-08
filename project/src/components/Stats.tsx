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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/80">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Contribución del hogar
        </h3>
        <div className="space-y-5">
          {members.map(member => {
            const stats = getMemberStats(member);
            const color = MEMBER_COLORS[member.color_index];

            return (
              <div key={member.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-600">
                        {stats.completed} de {stats.total} tareas
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-800 text-xl">{stats.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
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

      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center border border-white/80">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Trabajo en equipo!
        </h3>
        <p className="text-gray-600">
          Seguid así, vuestro hogar está cada vez más organizado
        </p>
      </div>
    </div>
  );
}
