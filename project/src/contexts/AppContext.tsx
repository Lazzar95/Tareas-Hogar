import React, { createContext, useContext, useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  triggers: string[];
  gratitude?: string;
}

export interface MentalLoadEntry {
  date: string;
  level: number;
  factors: string[];
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  category: string;
  completed: boolean;
  dueDate?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
}

interface AppState {
  mentalLoadHistory: MentalLoadEntry[];
  journalEntries: JournalEntry[];
  tasks: Task[];
  communityPosts: CommunityPost[];
  userPreferences: {
    dailyReminders: boolean;
    emergencyContacts: string[];
    preferredExercises: string[];
    notificationTime: string;
  };
  dailyStats: {
    mood: string;
    energyLevel: number;
    gratitude: string[];
    achievements: string[];
  };
}

interface AppContextType {
  state: AppState;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  addMentalLoadEntry: (entry: MentalLoadEntry) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  updateUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
  updateDailyStats: (stats: Partial<AppState['dailyStats']>) => void;
  getCurrentMentalLoad: () => number;
  getWeeklyMoodTrend: () => string[];
  getTasksByCategory: (category: string) => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('menteSerenaAppState');
    return saved ? JSON.parse(saved) : {
      mentalLoadHistory: [],
      journalEntries: [],
      tasks: [],
      communityPosts: [
        {
          id: '1',
          author: 'Carmen M.',
          content: 'Hoy conseguí pedirle a mi pareja que se encargue de las cenas esta semana. Al principio me sentí culpable, pero ver lo bien que lo hace me tranquiliza. 💪',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          replies: 3,
          category: 'corresponsabilidad'
        },
        {
          id: '2',
          author: 'Ana L.',
          content: 'Recordatorio: No tienes que ser perfecta para ser una buena madre. Hoy me permití descansar mientras mi hijo veía una película. Y está bien. ❤️',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 18,
          replies: 7,
          category: 'autocompasion'
        }
      ],
      userPreferences: {
        dailyReminders: true,
        emergencyContacts: [],
        preferredExercises: [],
        notificationTime: '09:00'
      },
      dailyStats: {
        mood: '',
        energyLevel: 5,
        gratitude: [],
        achievements: []
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('menteSerenaAppState', JSON.stringify(state));
  }, [state]);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setState(prev => ({
      ...prev,
      journalEntries: [newEntry, ...prev.journalEntries]
    }));
  };

  const addMentalLoadEntry = (entry: MentalLoadEntry) => {
    setState(prev => ({
      ...prev,
      mentalLoadHistory: [entry, ...prev.mentalLoadHistory.slice(0, 29)]
    }));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
  };

  const toggleTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const updateUserPreferences = (preferences: Partial<AppState['userPreferences']>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences }
    }));
  };

  const updateDailyStats = (stats: Partial<AppState['dailyStats']>) => {
    setState(prev => ({
      ...prev,
      dailyStats: { ...prev.dailyStats, ...stats }
    }));
  };

  const getCurrentMentalLoad = () => {
    const recent = state.mentalLoadHistory[0];
    return recent ? recent.level : 5;
  };

  const getWeeklyMoodTrend = () => {
    return state.journalEntries
      .slice(0, 7)
      .map(entry => entry.mood)
      .filter(Boolean);
  };

  const getTasksByCategory = (category: string) => {
    return state.tasks.filter(task => task.category === category);
  };

  return (
    <AppContext.Provider value={{
      state,
      addJournalEntry,
      addMentalLoadEntry,
      addTask,
      toggleTask,
      updateUserPreferences,
      updateDailyStats,
      getCurrentMentalLoad,
      getWeeklyMoodTrend,
      getTasksByCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};