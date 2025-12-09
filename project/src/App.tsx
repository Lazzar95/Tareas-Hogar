import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
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
    const familyCode = localStorage.getItem('familyCode');
    if (familyCode) {
      try {
        const { data: familyData } = await supabase
          .from('families')
          .select('*')
          .eq('code', familyCode)
          .maybeSingle();

        if (familyData) {
          setFamily(familyData);
          await loadMembers(familyData.id);
        }
      } catch (error) {
        console.error('Error loading family:', error);
      }
    }
    setLoading(false);
  };

  const loadMembers = async (familyId: string) => {
    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: true });

    if (data) {
      setMembers(data);
    }
  };

  const handleOnboardingComplete = async (familyData: Family, membersData: FamilyMember[]) => {
    setFamily(familyData);
    setMembers(membersData);
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

