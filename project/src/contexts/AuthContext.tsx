import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
  profile: {
    childrenAges: number[];
    workSituation: string;
    mentalLoadLevel: number;
    mainStressors: string[];
    supportNetwork: string;
    preferredCopingMethods: string[];
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User['profile']>) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkUser = async () => {
      try {
        const savedUser = localStorage.getItem('menteSerenaUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(checkUser, 500); // Simulate network delay
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        hasCompletedOnboarding: false,
        profile: {
          childrenAges: [],
          workSituation: '',
          mentalLoadLevel: 0,
          mainStressors: [],
          supportNetwork: '',
          preferredCopingMethods: []
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('menteSerenaUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name,
        email,
        hasCompletedOnboarding: false,
        profile: {
          childrenAges: [],
          workSituation: '',
          mentalLoadLevel: 0,
          mainStressors: [],
          supportNetwork: '',
          preferredCopingMethods: []
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('menteSerenaUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('menteSerenaUser');
  };

  const updateProfile = (profileUpdate: Partial<User['profile']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profileUpdate }
      };
      setUser(updatedUser);
      localStorage.setItem('menteSerenaUser', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem('menteSerenaUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};