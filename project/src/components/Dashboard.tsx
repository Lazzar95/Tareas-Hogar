import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Family, FamilyMember, Task, ShoppingItem } from '../types';
import TaskList from './TaskList';
import ShoppingList from './ShoppingList';
import Stats from './Stats';
import AddTaskModal from './AddTaskModal';
import FamilyCodeModal from './FamilyCodeModal';

interface DashboardProps {
  family: Family;
  members: FamilyMember[];
}

type View = 'tasks' | 'shopping' | 'stats';

export default function Dashboard({ family, members }: DashboardProps) {
  const [view, setView] = useState<View>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showFamilyCode, setShowFamilyCode] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadTasks();
    loadShopping();

    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `family_id=eq.${family.id}` }, loadTasks)
      .subscribe();

    const shoppingSubscription = supabase
      .channel('shopping_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_items', filter: `family_id=eq.${family.id}` }, loadShopping)
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
      shoppingSubscription.unsubscribe();
    };
  }, [family.id]);

  const loadTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('family_id', family.id)
      .order('created_at', { ascending: false });

    if (data) setTasks(data);
  };

  const loadShopping = async () => {
    const { data } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('family_id', family.id)
      .order('created_at', { ascending: false });

    if (data) setShopping(data);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    await supabase
      .from('tasks')
      .update({
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (newCompleted) {
      showNotification(`¡${task.assigned_to} completó "${task.title}"! ✨`);
    }
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3500);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 pb-24">
      {notification && (
        <div className="fixed top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-50 p-5 border-l-4 border-green-500 animate-slide-in-right max-w-sm">
          <p className="font-semibold text-gray-800">{notification}</p>
        </div>
      )}

      {showFamilyCode && (
        <FamilyCodeModal
          familyCode={family.code}
          onClose={() => setShowFamilyCode(false)}
        />
      )}

      <div className="bg-white/70 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {family.name}
              </h1>
              <button
                onClick={() => setShowFamilyCode(true)}
                className="text-sm text-gray-600 hover:text-orange-500 font-mono mt-1 transition-colors"
              >
                Código: {family.code}
              </button>
            </div>
            <div className="relative">
              <svg width="80" height="80" className="transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="7"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="url(#gradient)"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - completionPercentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6B8E5A" />
                    <stop offset="100%" stopColor="#8ba675" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-gray-800 text-xl">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-5">
        <div className="flex gap-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-md border border-white/80">
          <button
            onClick={() => setView('tasks')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              view === 'tasks'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            📋 Tareas
          </button>
          <button
            onClick={() => setView('shopping')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              view === 'shopping'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            🛒 Compra
          </button>
          <button
            onClick={() => setView('stats')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              view === 'stats'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            📊 Stats
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {view === 'tasks' && (
          <TaskList
            tasks={tasks}
            members={members}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onAdd={() => setShowAddTask(true)}
          />
        )}

        {view === 'shopping' && (
          <ShoppingList
            items={shopping}
            familyId={family.id}
          />
        )}

        {view === 'stats' && (
          <Stats
            tasks={tasks}
            members={members}
          />
        )}
      </div>

      {showAddTask && (
        <AddTaskModal
          family={family}
          members={members}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
}
