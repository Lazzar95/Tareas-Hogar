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
  created_by?: string;
  updated_by?: string;
}

export interface ShoppingItem {
  id: string;
  family_id: string;
  name: string;
  checked: boolean;
  created_at: string;
  created_by?: string;
  updated_by?: string;
}

// Paleta de colores moderna anti-reactante
// Diseño psicológico: colores que generan dopamina sin agresividad
export const MEMBER_COLORS = [
  // Mint - Calma + Productividad
  { bg: '#ccfbef', text: '#0d9488', ring: '#14b8a6', gradient: 'from-mint-500 to-mint-400', name: 'mint' },
  // Coral - Energía suave
  { bg: '#ffede8', text: '#ed4c2c', ring: '#ff6b4a', gradient: 'from-coral-500 to-coral-400', name: 'coral' },
  // Lavender - Creatividad + Premium
  { bg: '#f3e8ff', text: '#9333ea', ring: '#a855f7', gradient: 'from-lavender-500 to-lavender-400', name: 'lavender' },
  // Sky - Confianza + Serenidad  
  { bg: '#e0f2fe', text: '#0284c7', ring: '#0ea5e9', gradient: 'from-sky-500 to-sky-400', name: 'sky' },
  // Sunny - Optimismo
  { bg: '#fef9c3', text: '#ca8a04', ring: '#eab308', gradient: 'from-sunny-500 to-sunny-400', name: 'sunny' },
  // Rose - Calidez emocional
  { bg: '#ffe4e6', text: '#e11d48', ring: '#f43f5e', gradient: 'from-rose-500 to-rose-400', name: 'rose' }
];

// Iconos más expresivos con emojis modernos
export const TASK_ICONS: Record<string, string> = {
  compras: '🛍️',
  limpieza: '✨',
  cocina: '🍳',
  basura: '♻️',
  fregar: '🫧',
  lavadora: '🧺',
  tender: '👕',
  planchar: '✨',
  doblar: '📦',
  aspirar: '🌀',
  barrer: '🧹',
  mascotas: '🐾',
  jardin: '🌿',
  niños: '🧸',
  facturas: '💳',
  otros: '📝'
};

export const CATEGORIES = Object.keys(TASK_ICONS);

export const FREQUENCIES = ['Una vez', 'Diario', 'Semanal', 'Mensual'];
