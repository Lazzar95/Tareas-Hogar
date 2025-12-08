import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Family, FamilyMember } from '../types';
import { TASK_ICONS, CATEGORIES, FREQUENCIES } from '../types';

interface AddTaskModalProps {
  family: Family;
  members: FamilyMember[];
  onClose: () => void;
}

export default function AddTaskModal({ family, members, onClose }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'limpieza',
    assigned_to: members[0]?.name || '',
    frequency: 'Una vez'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      await supabase.from('tasks').insert({
        family_id: family.id,
        title: formData.title.trim(),
        category: formData.category,
        assigned_to: formData.assigned_to,
        frequency: formData.frequency,
        completed: false
      });

      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-6 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto border border-white/80">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-800">Nueva tarea</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Qué hay que hacer?"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none text-lg font-medium transition-all"
              autoFocus
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Tipo de tarea</p>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2 ${
                    formData.category === cat
                      ? 'bg-orange-500 text-white shadow-lg scale-105'
                      : 'bg-white/70 hover:scale-105 border border-gray-200'
                  }`}
                >
                  <span className="text-3xl">{TASK_ICONS[cat]}</span>
                  <span className={`text-xs font-semibold capitalize ${
                    formData.category === cat ? 'text-white' : 'text-gray-600'
                  }`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">¿Quién?</p>
              <select
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none font-medium transition-all"
              >
                {members.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">¿Cuándo?</p>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none font-medium transition-all"
              >
                {FREQUENCIES.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!formData.title.trim() || loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Añadiendo...' : '✓ Añadir'}
          </button>
        </form>
      </div>
    </div>
  );
}
