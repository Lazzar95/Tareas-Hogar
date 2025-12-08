import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  familyId: string;
}

export default function ShoppingList({ items, familyId }: ShoppingListProps) {
  const [newItem, setNewItem] = useState('');

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
    await supabase.from('shopping_items').delete().eq('id', id);
  };

  const pendingItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleAdd} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/80">
        <div className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Ej: Leche desnatada, pan integral..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!newItem.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            +
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/80 shadow-md">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Lista vacía
          </h3>
          <p className="text-gray-600">
            Añade el primer producto arriba
          </p>
        </div>
      ) : (
        <>
          {pendingItems.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-700 mb-3 px-2 text-lg">
                Por comprar ({pendingItems.length})
              </h3>
              <div className="space-y-2">
                {pendingItems.map(item => (
                  <div key={item.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/80 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id, item.checked)}
                        className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-green-500 checked:border-green-500 cursor-pointer transition-all"
                      />
                      <span className={`flex-1 font-medium text-gray-800 ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkedItems.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-700 mb-3 px-2 text-lg">
                Comprados ({checkedItems.length})
              </h3>
              <div className="space-y-2">
                {checkedItems.map(item => (
                  <div key={item.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/80 opacity-60">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id, item.checked)}
                        className="w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-green-500 checked:border-green-500 cursor-pointer transition-all"
                      />
                      <span className="flex-1 font-medium text-gray-800 line-through">
                        {item.name}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
