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

  const addShoppingItem = async (name: string) => {
    const { data } = await supabase
      .from('shopping_items')
      .insert({
        family_id: family.id,
        name: name.trim(),
        checked: false
      })
      .select()
      .single();

    if (data) setShopping(prev => [data, ...prev]);
  };

  const toggleShoppingItem = async (id: string, checked: boolean) => {
    setShopping(prev => prev.map(item => item.id === id ? { ...item, checked: !checked } : item));
    await supabase
      .from('shopping_items')
      .update({ checked: !checked })
      .eq('id', id);
  };

  const deleteShoppingItem = async (id: string) => {
    setShopping(prev => prev.filter(item => item.id !== id));
    await supabase.from('shopping_items').delete().eq('id', id);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    // Optimista: actualiza UI antes de la respuesta
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
        : t
    ));

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
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  const addTaskLocal = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3500);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Determinar el color del progreso según porcentaje
  const getProgressColor = () => {
    if (completionPercentage >= 80) return { start: '#14b8a6', end: '#0d9488' }; // mint
    if (completionPercentage >= 50) return { start: '#facc15', end: '#eab308' }; // sunny
    return { start: '#ff6b4a', end: '#ed4c2c' }; // coral
  };

  const progressColor = getProgressColor();

  return (
    <div className="min-h-screen bg-mesh pb-32 relative overflow-hidden">
      {/* Blobs decorativos */}
      <div className="blob blob-mint w-96 h-96 -top-48 -right-48 fixed" />
      <div className="blob blob-lavender w-80 h-80 -bottom-40 -left-40 fixed" />

      {/* Toast notification */}
      {notification && (
        <div className="toast toast-success animate-slide-down">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <p className="font-semibold text-gray-800">{notification}</p>
          </div>
        </div>
      )}

      {/* Modal de código familiar */}
      {showFamilyCode && (
        <FamilyCodeModal
          familyCode={family.code}
          onClose={() => setShowFamilyCode(false)}
        />
      )}

      {/* Header sticky con glassmorphism */}
      <header className="header-sticky">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-800">
                {family.name}
              </h1>
              <button
                onClick={() => setShowFamilyCode(true)}
                className="text-sm text-gray-500 hover:text-mint-600 font-mono mt-0.5 transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
                {family.code}
              </button>
            </div>

            {/* Progress ring */}
            <div className="relative group cursor-pointer" title={`${completedTasks}/${totalTasks} tareas`}>
              <svg width="72" height="72" className="progress-ring">
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - completionPercentage / 100)}
                  strokeLinecap="round"
                  className="progress-ring__circle"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={progressColor.start} />
                    <stop offset="100%" stopColor={progressColor.end} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-gray-800 text-lg group-hover:scale-110 transition-transform">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar moderna */}
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="tab-bar">
          <button
            onClick={() => setView('tasks')}
            className={`tab-item ${view === 'tasks' ? 'tab-item-active' : ''}`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📋</span>
              <span>Tareas</span>
            </span>
          </button>
          <button
            onClick={() => setView('shopping')}
            className={`tab-item ${view === 'shopping' ? 'tab-item-active' : ''}`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>🛍️</span>
              <span>Compra</span>
            </span>
          </button>
          <button
            onClick={() => setView('stats')}
            className={`tab-item ${view === 'stats' ? 'tab-item-active' : ''}`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span>Stats</span>
            </span>
          </button>
        </div>
      </div>

      {/* Content area */}
      <main className="max-w-2xl mx-auto px-6 relative z-10">
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
            onAdd={addShoppingItem}
            onToggle={toggleShoppingItem}
            onDelete={deleteShoppingItem}
          />
        )}

        {view === 'stats' && (
          <Stats
            tasks={tasks}
            members={members}
          />
        )}
      </main>

      {/* FAB para añadir tarea (solo en vista de tareas) */}
      {view === 'tasks' && (
        <button
          onClick={() => setShowAddTask(true)}
          className="fab"
          aria-label="Añadir tarea"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Modal de añadir tarea */}
      {showAddTask && (
        <AddTaskModal
          family={family}
          members={members}
          onCreated={addTaskLocal}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
}
