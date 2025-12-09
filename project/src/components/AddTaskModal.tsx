import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Family, FamilyMember, Task } from '../types';
import { TASK_ICONS, CATEGORIES, FREQUENCIES, MEMBER_COLORS } from '../types';

interface AddTaskModalProps {
  family: Family;
  members: FamilyMember[];
  onCreated: (task: Task) => void;
  onClose: () => void;
  currentMember?: string;
}

export default function AddTaskModal({ family, members, onCreated, onClose, currentMember }: AddTaskModalProps) {
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
      const { data } = await supabase
        .from('tasks')
        .insert({
          family_id: family.id,
          title: formData.title.trim(),
          category: formData.category,
          assigned_to: formData.assigned_to,
          frequency: formData.frequency,
          completed: false,
          created_by: currentMember
        })
        .select()
        .single();

      if (data) {
        onCreated(data as Task);
      }

      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-6 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card-strong w-full sm:max-w-lg rounded-t-4xl sm:rounded-4xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 px-6 py-5 flex items-center justify-between rounded-t-4xl">
          <h2 className="font-display text-xl font-bold text-gray-800">Nueva tarea</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-all haptic"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Input de título */}
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Qué hay que hacer?"
              className="input-field text-lg font-medium"
              autoFocus
            />
          </div>

          {/* Categorías */}
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Tipo de tarea</p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.slice(0, 8).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-3 rounded-2xl transition-all flex flex-col items-center gap-1.5 ${
                    formData.category === cat
                      ? 'bg-gradient-to-br from-mint-400 to-mint-500 text-white shadow-glow scale-105'
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{TASK_ICONS[cat]}</span>
                  <span className={`text-xs font-medium capitalize truncate w-full text-center ${
                    formData.category === cat ? 'text-white' : 'text-gray-600'
                  }`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
            {/* Segunda fila de categorías */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {CATEGORIES.slice(8).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-3 rounded-2xl transition-all flex flex-col items-center gap-1.5 ${
                    formData.category === cat
                      ? 'bg-gradient-to-br from-mint-400 to-mint-500 text-white shadow-glow scale-105'
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{TASK_ICONS[cat]}</span>
                  <span className={`text-xs font-medium capitalize truncate w-full text-center ${
                    formData.category === cat ? 'text-white' : 'text-gray-600'
                  }`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Asignación y frecuencia */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quién */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">¿Quién?</p>
              <div className="glass-card p-2 space-y-1">
                {members.map(member => {
                  const color = MEMBER_COLORS[member.color_index];
                  const isSelected = formData.assigned_to === member.name;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, assigned_to: member.name })}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl transition-all ${
                        isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                        {member.name}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-mint-500">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frecuencia */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">¿Cuándo?</p>
              <div className="glass-card p-2 space-y-1">
                {FREQUENCIES.map(freq => {
                  const isSelected = formData.frequency === freq;
                  const icons: Record<string, string> = {
                    'Una vez': '1️⃣',
                    'Diario': '📅',
                    'Semanal': '📆',
                    'Mensual': '🗓️'
                  };
                  return (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFormData({ ...formData, frequency: freq })}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl transition-all ${
                        isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                      }`}
                    >
                      <span className="text-lg">{icons[freq]}</span>
                      <span className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                        {freq}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-mint-500">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={!formData.title.trim() || loading}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Añadiendo...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Añadir tarea
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
