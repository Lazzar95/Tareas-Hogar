import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  familyId: string;
}

export default function ShoppingList({ items, familyId }: ShoppingListProps) {
  const [newItem, setNewItem] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await supabase.from('shopping_items').insert({
      family_id: familyId,
      name: newItem.trim(),
      checked: false
    });

    setNewItem('');
  };

  const toggleItem = async (id: string, checked: boolean) => {
    await supabase
      .from('shopping_items')
      .update({ checked: !checked })
      .eq('id', id);
  };

  const deleteItem = async (id: string) => {
    setDeletingId(id);
    setTimeout(async () => {
      await supabase.from('shopping_items').delete().eq('id', id);
      setDeletingId(null);
    }, 200);
  };

  const pendingItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);

  const ShoppingItemCard = ({ item }: { item: ShoppingItem }) => {
    const isDeleting = deletingId === item.id;
    
    return (
      <div 
        className={`glass-card p-4 transition-all duration-200 ${
          item.checked ? 'opacity-60' : ''
        } ${isDeleting ? 'scale-95 opacity-0' : ''}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleItem(item.id, item.checked)}
            className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 transition-all duration-200 flex items-center justify-center ${
              item.checked 
                ? 'bg-gradient-to-br from-mint-400 to-mint-500 border-mint-500' 
                : 'border-gray-300 hover:border-sky-400 hover:bg-sky-50'
            }`}
          >
            {item.checked && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <span className={`flex-1 font-medium ${
            item.checked ? 'line-through text-gray-400' : 'text-gray-800'
          }`}>
            {item.name}
          </span>
          
          <button
            onClick={() => deleteItem(item.id)}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-coral-500 hover:bg-coral-50 
                       transition-all flex items-center justify-center haptic"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Input para añadir */}
      <form onSubmit={handleAdd} className="glass-card-strong p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Añadir producto..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/50 border-2 border-gray-200/60 
                       focus:border-sky-400 focus:ring-4 focus:ring-sky-100 
                       outline-none transition-all text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newItem.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 
                       text-white font-bold text-xl shadow-sm
                       hover:shadow-md hover:scale-105 active:scale-95
                       transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            +
          </button>
        </div>
      </form>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="relative inline-block mb-6">
            <div className="text-7xl animate-float">🛍️</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/5 rounded-full blur-sm" />
          </div>
          <h3 className="font-display text-2xl font-bold text-gray-800 mb-3">
            Lista vacía
          </h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Añade productos arriba y sincroniza con toda la familia
          </p>
        </div>
      ) : (
        <>
          {/* Items pendientes */}
          {pendingItems.length > 0 && (
            <section>
              <h3 className="font-display font-bold text-gray-700 mb-4 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Por comprar
                <span className="text-gray-400 font-normal text-sm">({pendingItems.length})</span>
              </h3>
              <div className="space-y-2">
                {pendingItems.map(item => (
                  <ShoppingItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Items comprados */}
          {checkedItems.length > 0 && (
            <section>
              <h3 className="font-display font-bold text-gray-700 mb-4 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint-400" />
                Comprados
                <span className="text-gray-400 font-normal text-sm">({checkedItems.length})</span>
              </h3>
              <div className="space-y-2">
                {checkedItems.map(item => (
                  <ShoppingItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
