import { useEffect, useState } from 'react';
import type { Family, FamilyMember } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamilyFromStorage();
  }, []);

  const loadFamilyFromStorage = async () => {
    // Cargar desde localStorage en lugar de Supabase
    const familyDataStr = localStorage.getItem('familyData');
    const membersDataStr = localStorage.getItem('membersData');
    
    if (familyDataStr && membersDataStr) {
      try {
        const familyData = JSON.parse(familyDataStr);
        const membersData = JSON.parse(membersDataStr);
        
        setFamily(familyData);
        setMembers(membersData);
      } catch (error) {
        console.error('Error loading family from localStorage:', error);
      }
    }
    setLoading(false);
  };

  const handleOnboardingComplete = async (familyData: Family, membersData: FamilyMember[]) => {
    setFamily(familyData);
    setMembers(membersData);
    
    // Guardar en localStorage
    localStorage.setItem('familyData', JSON.stringify(familyData));
    localStorage.setItem('membersData', JSON.stringify(membersData));
    localStorage.setItem('familyCode', familyData.code);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!family || members.length === 0) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard family={family} members={members} />;
}

export default App;

