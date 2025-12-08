export interface Family {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  name: string;
  color_index: number;
  created_at: string;
}

export interface Task {
  id: string;
  family_id: string;
  title: string;
  description: string;
  category: string;
  assigned_to: string;
  frequency: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  family_id: string;
  name: string;
  checked: boolean;
  created_at: string;
}

export const MEMBER_COLORS = [
  { bg: '#fce8df', text: '#E77447', ring: '#f39268', gradient: 'from-terracota-500 to-terracota-400' },
  { bg: '#dbeef7', text: '#2A7BA0', ring: '#4a9ec9', gradient: 'from-mar-500 to-mar-400' },
  { bg: '#e8ede0', text: '#6B8E5A', ring: '#8ba675', gradient: 'from-oliva-500 to-oliva-400' },
  { bg: '#f3e8ff', text: '#9333ea', ring: '#a855f7', gradient: 'from-purple-500 to-purple-400' },
  { bg: '#fce7f3', text: '#db2777', ring: '#ec4899', gradient: 'from-pink-500 to-pink-400' },
  { bg: '#fef3c7', text: '#d97706', ring: '#f59e0b', gradient: 'from-amber-500 to-amber-400' }
];

export const TASK_ICONS: Record<string, string> = {
  compras: '🛒',
  limpieza: '✨',
  cocina: '👨‍🍳',
  basura: '🗑️',
  fregar: '🍽️',
  lavadora: '🧺',
  tender: '👔',
  planchar: '👗',
  doblar: '📦',
  aspirar: '🌪️',
  barrer: '🧹',
  mascotas: '🐕',
  jardin: '🌱',
  niños: '👶',
  facturas: '💰',
  otros: '📋'
};

export const CATEGORIES = Object.keys(TASK_ICONS);

export const FREQUENCIES = ['Una vez', 'Diario', 'Semanal', 'Mensual'];
