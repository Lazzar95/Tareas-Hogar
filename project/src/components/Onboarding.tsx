import { useState } from 'react';
import { supabase, generateFamilyCode } from '../lib/supabase';
import type { Family, FamilyMember } from '../types';
import { MEMBER_COLORS } from '../types';

interface OnboardingProps {
  onComplete: (family: Family, members: FamilyMember[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [familyName, setFamilyName] = useState('');
  const [members, setMembers] = useState([{ name: '', colorIndex: 0 }]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMember = () => {
    if (members.length < 6) {
      setMembers([...members, { name: '', colorIndex: members.length % MEMBER_COLORS.length }]);
    }
  };

  const updateMember = (index: number, name: string) => {
    const newMembers = [...members];
    newMembers[index].name = name;
    setMembers(newMembers);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleCreate = async () => {
    const validMembers = members.filter(m => m.name.trim());
    if (!familyName.trim() || validMembers.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const code = generateFamilyCode();

      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({ name: familyName, code })
        .select()
        .single();

      if (familyError) throw familyError;

      const memberInserts = validMembers.map((m, i) => ({
        family_id: family.id,
        name: m.name,
        color_index: i % MEMBER_COLORS.length
      }));

      const { data: createdMembers, error: membersError } = await supabase
        .from('family_members')
        .insert(memberInserts)
        .select();

      if (membersError) throw membersError;

      onComplete(family, createdMembers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data: family, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('code', joinCode.toUpperCase())
        .maybeSingle();

      if (familyError) throw familyError;
      if (!family) {
        setError('Código no válido');
        setLoading(false);
        return;
      }

      const { data: familyMembers, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_id', family.id)
        .order('created_at', { ascending: true });

      if (membersError) throw membersError;

      onComplete(family, familyMembers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-10">
            <div className="text-7xl mb-6">🏠</div>
            <h1 className="text-5xl font-bold text-gray-800 mb-3">
              Tareas Hogar
            </h1>
            <p className="text-gray-600 text-lg">
              Tu casa organizada.<br />Sin discusiones.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setMode('create'); setStep(1); }}
              className="w-full bg-white/70 backdrop-blur-sm rounded-3xl p-6 text-left border border-white/80 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                Crear mi hogar
              </h3>
              <p className="text-gray-600">
                Empieza desde cero y genera un código para compartir
              </p>
            </button>

            <button
              onClick={() => { setMode('join'); setStep(1); }}
              className="w-full bg-white/70 backdrop-blur-sm rounded-3xl p-6 text-left border border-white/80 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                Unirme a un hogar
              </h3>
              <p className="text-gray-600">
                Ya tengo un código de mi familia o piso
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join' && step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <button
            onClick={() => setStep(0)}
            className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Volver
          </button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Unirte a tu hogar
            </h2>
            <p className="text-gray-600">
              Pide el código a alguien de tu familia o piso
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-6 border border-white/80">
            <label className="block text-gray-700 font-semibold mb-3">
              Código del hogar
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none text-lg font-mono text-center uppercase transition-all"
              maxLength={6}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            onClick={handleJoin}
            disabled={!joinCode.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar al hogar'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'create' && step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <button
            onClick={() => setStep(0)}
            className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Volver
          </button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏡</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Nombra tu hogar
            </h2>
            <p className="text-gray-600">
              Elige un nombre que todos reconozcan
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-6 border border-white/80">
            <label className="block text-gray-700 font-semibold mb-3">
              Nombre del hogar
            </label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Ej: Casa García, Piso Malasaña..."
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all"
              autoFocus
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!familyName.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <button
          onClick={() => setStep(1)}
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Volver
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¿Quiénes vivís aquí?
          </h2>
          <p className="text-gray-600">
            Añade a todos (familia, pareja, compañeros...)
          </p>
        </div>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {members.map((member, index) => {
            const color = MEMBER_COLORS[member.colorIndex];
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/80">
                <div className="flex gap-3 items-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(index, e.target.value)}
                    placeholder="Nombre"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                  />
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={addMember}
          disabled={members.length >= 6}
          className="w-full bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 text-gray-600 py-4 rounded-2xl font-semibold hover:border-orange-400 hover:text-orange-600 transition-all mb-6 disabled:opacity-50"
        >
          + Añadir persona
        </button>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={members.filter(m => m.name.trim()).length === 0 || loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : '¡Empezar! 🎉'}
        </button>
      </div>
    </div>
  );
}
