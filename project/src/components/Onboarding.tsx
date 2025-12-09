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
      // 1) Comprobar si ya existe un hogar con el mismo nombre (evita duplicados al reinstalar PWA)
      const { data: existingFamily, error: searchError } = await supabase
        .from('families')
        .select('*')
        .ilike('name', familyName.trim())
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingFamily) {
        // Reutilizar hogar existente: no crear duplicado
        const { data: familyMembers, error: membersError } = await supabase
          .from('family_members')
          .select('*')
          .eq('family_id', existingFamily.id)
          .order('created_at', { ascending: true });

        if (membersError) throw membersError;

        onComplete(existingFamily, familyMembers || []);
        return;
      }

      // 2) Crear hogar nuevo si no existe
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

  // Pantalla de bienvenida
  if (step === 0) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
        {/* Blobs decorativos */}
        <div className="blob blob-mint w-72 h-72 -top-20 -left-20" />
        <div className="blob blob-lavender w-96 h-96 -bottom-32 -right-32" />
        <div className="blob blob-coral w-64 h-64 top-1/2 left-1/3 opacity-20" />

        <div className="w-full max-w-md animate-slide-up relative z-10">
          <div className="text-center mb-12">
            {/* Logo animado */}
            <div className="relative inline-block mb-8">
              <div className="text-8xl animate-float">🏠</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/5 rounded-full blur-sm" />
            </div>
            
            <h1 className="font-display text-5xl font-extrabold mb-4">
              <span className="text-gradient">Tareas</span>
              <span className="text-gray-800"> Hogar</span>
            </h1>
            
            <p className="text-gray-500 text-lg font-medium">
              Organiza tu casa.<br />
              <span className="text-mint-600">Sin dramas.</span>
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setMode('create'); setStep(1); }}
              className="card-interactive w-full text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint-400 to-mint-500 flex items-center justify-center text-2xl shadow-glow group-hover:scale-110 transition-transform">
                  ✨
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-gray-800 mb-1">
                    Crear mi hogar
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Empieza desde cero y comparte el código
                  </p>
                </div>
                <div className="text-gray-300 group-hover:text-mint-500 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </div>
            </button>

            <button
              onClick={() => { setMode('join'); setStep(1); }}
              className="card-interactive w-full text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center text-2xl shadow-glow-lavender group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-gray-800 mb-1">
                    Unirme a un hogar
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Tengo un código de mi familia o piso
                  </p>
                </div>
                <div className="text-gray-300 group-hover:text-lavender-500 group-hover:translate-x-1 transition-all">
                  →
                </div>
              </div>
            </button>
          </div>

          {/* Footer sutil */}
          <p className="text-center text-gray-400 text-sm mt-12">
            Hecho con 💚 para hogares felices
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de unirse
  if (mode === 'join' && step === 1) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
        <div className="blob blob-lavender w-80 h-80 -top-20 -right-20" />
        <div className="blob blob-mint w-64 h-64 -bottom-20 -left-20" />

        <div className="w-full max-w-md animate-slide-up relative z-10">
          <button
            onClick={() => setStep(0)}
            className="mb-8 text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium transition-colors haptic"
          >
            <span className="text-xl">←</span> Volver
          </button>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center text-4xl shadow-glow-lavender mx-auto mb-6 animate-bounce-soft">
              🔗
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">
              Unirte a tu hogar
            </h2>
            <p className="text-gray-500">
              Pide el código a alguien de tu familia
            </p>
          </div>

          <div className="glass-card-strong p-8 mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
              Código del hogar
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="input-field text-center text-2xl font-mono tracking-[0.5em] uppercase"
              maxLength={6}
              autoFocus
            />
            {error && (
              <p className="text-coral-500 text-sm mt-3 flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            onClick={handleJoin}
            disabled={!joinCode.trim() || loading}
            className="btn-lavender w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar al hogar'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de crear - paso 1: nombre
  if (mode === 'create' && step === 1) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
        <div className="blob blob-mint w-80 h-80 -top-20 -left-20" />
        <div className="blob blob-coral w-64 h-64 -bottom-20 -right-20" />

        <div className="w-full max-w-md animate-slide-up relative z-10">
          <button
            onClick={() => setStep(0)}
            className="mb-8 text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium transition-colors haptic"
          >
            <span className="text-xl">←</span> Volver
          </button>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            <div className="flex-1 h-1.5 rounded-full bg-mint-500" />
            <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
          </div>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-mint-400 to-mint-500 flex items-center justify-center text-4xl shadow-glow mx-auto mb-6 animate-bounce-soft">
              🏡
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">
              Nombra tu hogar
            </h2>
            <p className="text-gray-500">
              Elige un nombre que todos reconozcan
            </p>
          </div>

          <div className="glass-card-strong p-8 mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
              Nombre del hogar
            </label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Casa García, Piso Malasaña..."
              className="input-field text-lg"
              autoFocus
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!familyName.trim()}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de crear - paso 2: miembros
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
      <div className="blob blob-mint w-64 h-64 -top-20 -right-20" />
      <div className="blob blob-lavender w-80 h-80 -bottom-32 -left-32" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <button
          onClick={() => setStep(1)}
          className="mb-8 text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium transition-colors haptic"
        >
          <span className="text-xl">←</span> Volver
        </button>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1.5 rounded-full bg-mint-500" />
          <div className="flex-1 h-1.5 rounded-full bg-mint-500" />
        </div>

        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">
            ¿Quiénes vivís aquí?
          </h2>
          <p className="text-gray-500">
            Añade a todos los del hogar
          </p>
        </div>

        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
          {members.map((member, index) => {
            const color = MEMBER_COLORS[member.colorIndex];
            return (
              <div 
                key={index} 
                className="glass-card p-4 animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 transition-all"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {member.name ? member.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(index, e.target.value)}
                    placeholder="Nombre"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/50 border-2 border-gray-200/60 focus:border-mint-400 focus:ring-4 focus:ring-mint-100 outline-none transition-all"
                  />
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(index)}
                      className="w-10 h-10 rounded-xl text-gray-400 hover:text-coral-500 hover:bg-coral-50 transition-all haptic"
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
          className="w-full glass-card border-2 border-dashed border-gray-300/60 text-gray-500 py-4 font-semibold hover:border-mint-400 hover:text-mint-600 transition-all mb-6 disabled:opacity-50 haptic"
        >
          + Añadir persona
        </button>

        {error && (
          <p className="text-coral-500 text-center mb-4 flex items-center justify-center gap-2">
            <span>⚠️</span> {error}
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={members.filter(m => m.name.trim()).length === 0 || loading}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              ¡Empezar! <span className="text-xl">🎉</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
