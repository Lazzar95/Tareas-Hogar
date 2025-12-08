// ResponsibilityPlanner.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Check, 
  Clock, 
  User, 
  Heart, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Baby,
  Home,
  Car,
  ShoppingCart,
  Utensils,
  Shirt,
  GraduationCap,
  Stethoscope,
  X,
  Edit3,
  RotateCcw,
  Link,
  Brain,
  Copy,
  MessageCircle,
  Bell
} from 'lucide-react';

const ResponsibilityPlanner = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('dashboard');
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Yo', role: 'madre', color: 'rose', avatar: '👩‍💼', livesHere: true, contact: '' },
    { id: 2, name: 'Mi pareja', role: 'pareja', color: 'blue', avatar: '👨‍💼', livesHere: true, contact: '' },
    { id: 3, name: 'Hijo mayor', role: 'hijo', color: 'green', avatar: '🧒', age: 12, livesHere: true, contact: '' },
    { id: 4, name: 'Hijo pequeño', role: 'hijo', color: 'purple', avatar: '👶', age: 4, livesHere: true, contact: '' }
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Preparar desayuno', category: 'alimentacion', assignedTo: 1, frequency: 'diario', difficulty: 2, time: 30, completed: false, code: 'TASK-001' },
    { id: 2, name: 'Llevar niños al colegio', category: 'transporte', assignedTo: 1, frequency: 'diario', difficulty: 3, time: 45, completed: true, code: 'TASK-002' },
    { id: 3, name: 'Recoger juguetes', category: 'limpieza', assignedTo: 3, frequency: 'diario', difficulty: 1, time: 15, completed: false, code: 'TASK-003' },
    { id: 4, name: 'Hacer la compra', category: 'logistica', assignedTo: 2, frequency: 'semanal', difficulty: 3, time: 90, completed: false, code: 'TASK-004' },
    { id: 5, name: 'Preparar cena', category: 'alimentacion', assignedTo: 1, frequency: 'diario', difficulty: 3, time: 60, completed: false, code: 'TASK-005' },
    { id: 6, name: 'Lavar ropa', category: 'limpieza', assignedTo: 2, frequency: 'semanal', difficulty: 2, time: 120, completed: true, code: 'TASK-006' },
    { id: 7, name: 'Ayuda con deberes', category: 'educacion', assignedTo: 1, frequency: 'diario', difficulty: 4, time: 45, completed: false, code: 'TASK-007' },
    { id: 8, name: 'Citas médicas', category: 'salud', assignedTo: 1, frequency: 'mensual', difficulty: 4, time: 180, completed: false, code: 'TASK-008' }
  ]);
  
  // Estados para modales y formularios
  const [showAddTask, setShowAddTask] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTaskLinkModal, setShowTaskLinkModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [taskForWhatsApp, setTaskForWhatsApp] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mentalLoadData, setMentalLoadData] = useState({
    planning: 75,
    supervision: 60,
    emotional: 85,
    logistics: 70
  });
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [taskLink, setTaskLink] = useState('');
  const [taskLinkCode, setTaskLinkCode] = useState('');
  
  // Formularios
  const [newTask, setNewTask] = useState({
    name: '',
    category: '',
    assignedTo: '',
    frequency: 'diario',
    difficulty: 2,
    time: 30
  });
  
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    color: 'gray',
    avatar: '👤',
    livesHere: true,
    contact: '',
    custodyDays: []
  });
  
  // Categorías de tareas
  const categories = [
    { id: 'alimentacion', name: 'Alimentación', icon: Utensils, color: 'orange' },
    { id: 'limpieza', name: 'Limpieza', icon: Home, color: 'blue' },
    { id: 'transporte', name: 'Transporte', icon: Car, color: 'green' },
    { id: 'logistica', name: 'Logística', icon: ShoppingCart, color: 'purple' },
    { id: 'educacion', name: 'Educación', icon: GraduationCap, color: 'indigo' },
    { id: 'salud', name: 'Salud', icon: Stethoscope, color: 'red' },
    { id: 'cuidado', name: 'Cuidado Personal', icon: Baby, color: 'pink' }
  ];
  
  // Análisis de distribución de carga
  const workloadAnalysis = useMemo(() => {
    const memberWorkload = familyMembers.map(member => {
      const memberTasks = tasks.filter(task => task.assignedTo === member.id);
      const totalTime = memberTasks.reduce((sum, task) => {
        const multiplier = task.frequency === 'diario' ? 7 : task.frequency === 'semanal' ? 1 : 0.25;
        return sum + (task.time * multiplier);
      }, 0);
      
      const totalDifficulty = memberTasks.reduce((sum, task) => sum + task.difficulty, 0);
      
      return {
        ...member,
        taskCount: memberTasks.length,
        weeklyMinutes: totalTime,
        difficultyScore: totalDifficulty,
        workloadScore: totalTime + (totalDifficulty * 30)
      };
    });
    
    const maxWorkload = Math.max(...memberWorkload.map(m => m.workloadScore));
    
    return memberWorkload.map(member => ({
      ...member,
      workloadPercentage: maxWorkload > 0 ? (member.workloadScore / maxWorkload) * 100 : 0
    }));
  }, [tasks, familyMembers]);
  
  // Funciones para tareas
  const addTask = () => {
    if (!newTask.name.trim()) return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      assignedTo: parseInt(newTask.assignedTo),
      completed: false,
      code: `TASK-${String(Date.now()).slice(-6)}`
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({ name: '', category: '', assignedTo: '', frequency: 'diario', difficulty: 2, time: 30 });
    setShowAddTask(false);
  };
  
  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const reassignTask = (taskId, newAssignee) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, assignedTo: newAssignee } : task
    ));
  };
  
  // Funciones para miembros
  const addMember = () => {
    if (!newMember.name.trim()) return;
    
    const member = {
      ...newMember,
      id: Date.now()
    };
    
    setFamilyMembers(prev => [...prev, member]);
    setNewMember({ 
      name: '', 
      role: '', 
      color: 'gray', 
      avatar: '👤', 
      livesHere: true, 
      contact: '',
      custodyDays: []
    });
    setShowMemberModal(false);
  };
  
  const updateMember = () => {
    if (!currentMember || !currentMember.name.trim()) return;
    
    setFamilyMembers(prev => 
      prev.map(member => member.id === currentMember.id ? currentMember : member)
    );
    
    setCurrentMember(null);
    setShowMemberModal(false);
  };
  
  const deleteMember = (id) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
    // Reasignar tareas del miembro eliminado
    setTasks(prev => prev.map(task => 
      task.assignedTo === id ? { ...task, assignedTo: 1 } : task
    ));
  };
  
  // Funciones para enlaces de tareas
  const openWhatsAppModal = (task) => {
    setTaskForWhatsApp(task);
    setShowWhatsAppModal(true);
  };
  
  const generateTaskLink = () => {
    if (!taskForWhatsApp) return;
    
    // Generar un enlace único para la tarea
    const baseUrl = window.location.origin + window.location.pathname;
    const taskUrl = `${baseUrl}?task=${taskForWhatsApp.code}`;
    setTaskLink(taskUrl);
    setTaskLinkCode(taskForWhatsApp.code);
  };
  
  const copyToClipboard = () => {
    if (!taskLink) return;
    
    navigator.clipboard.writeText(taskLink).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };
  
  const shareViaWhatsApp = () => {
    if (!taskLink || !taskForWhatsApp) return;
    
    const assignedMember = familyMembers.find(m => m.id === taskForWhatsApp.assignedTo);
    if (!assignedMember) return;
    
    const message = `Hola ${assignedMember.name}! Te han asignado la tarea: "${taskForWhatsApp.name}". Para marcarla como completada, haz clic en este enlace: ${taskLink}`;
    const whatsappUrl = `https://wa.me/${assignedMember.contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Añadir notificación
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'whatsapp',
        message: `Tarea "${taskForWhatsApp.name}" enviada a ${assignedMember.name}`,
        timestamp: new Date(),
        read: false
      }
    ]);
  };
  
  const markTaskAsCompleted = (code) => {
    const task = tasks.find(t => t.code === code);
    if (task) {
      toggleTask(task.id);
      
      // Añadir notificación
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'completion',
          message: `Tarea "${task.name}" marcada como completada`,
          timestamp: new Date(),
          read: false
        }
      ]);
      
      alert(`Tarea "${task.name}" marcada como completada`);
      setShowTaskLinkModal(false);
    } else {
      alert('Código de tarea no válido');
    }
  };
  
  // Verificar si hay un código de tarea en la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskCode = urlParams.get('task');
    
    if (taskCode) {
      const task = tasks.find(t => t.code === taskCode);
      if (task) {
        setTaskLinkCode(taskCode);
        setShowTaskLinkModal(true);
      }
    }
  }, [tasks]);
  
  // Funciones auxiliares
  const getMemberById = (id) => familyMembers.find(m => m.id === id);
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Home;
  };
  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };
  
  // Sugerencias automáticas de redistribución
  const getRebalanceSuggestions = () => {
    const overloadedMember = workloadAnalysis.find(m => m.workloadPercentage > 80);
    const underloadedMembers = workloadAnalysis.filter(m => m.workloadPercentage < 40 && m.role !== 'hijo' || (m.role === 'hijo' && m.age >= 10));
    
    if (!overloadedMember || underloadedMembers.length === 0) return [];
    
    const overloadedTasks = tasks.filter(t => t.assignedTo === overloadedMember.id && t.difficulty <= 3);
    
    return overloadedTasks.slice(0, 2).map(task => ({
      task,
      from: overloadedMember,
      to: underloadedMembers[0],
      reason: `Reducir sobrecarga de ${overloadedMember.name}`
    }));
  };
  
  const suggestions = getRebalanceSuggestions();
  
  // Estado para completar tarea por código
  const [completionCode, setCompletionCode] = useState('');
  
  // Componente Dashboard
  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Distribución de carga */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-rose-600" />
          Distribución Actual de Tareas
        </h3>
        
        <div className="space-y-4">
          {workloadAnalysis.map(member => (
            <div key={member.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `var(--${member.color}-100)` }}>
                    {member.avatar}
                  </div>
                  <span className="font-medium text-gray-800">{member.name}</span>
                  <span className="text-sm text-gray-500">
                    {member.taskCount} tareas • {Math.round(member.weeklyMinutes / 60)}h/semana
                  </span>
                </div>
                <span className={`text-sm font-semibold ${
                  member.workloadPercentage > 80 ? 'text-red-600' :
                  member.workloadPercentage > 60 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {Math.round(member.workloadPercentage)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    member.workloadPercentage > 80 ? 'bg-red-400' :
                    member.workloadPercentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${member.workloadPercentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Alert de sobrecarga */}
        {workloadAnalysis.some(m => m.workloadPercentage > 80) && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Distribución desequilibrada detectada
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {workloadAnalysis.find(m => m.workloadPercentage > 80)?.name} tiene una carga excesiva. 
                  Es momento de redistribuir tareas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Carga Mental */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Brain className="w-6 h-6 mr-3 text-purple-600" />
          Carga Mental
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Planificación</span>
              <span className="text-sm font-medium text-gray-700">{mentalLoadData.planning}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" 
                style={{ width: `${mentalLoadData.planning}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Supervisión</span>
              <span className="text-sm font-medium text-gray-700">{mentalLoadData.supervision}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" 
                style={{ width: `${mentalLoadData.supervision}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Carga Emocional</span>
              <span className="text-sm font-medium text-gray-700">{mentalLoadData.emotional}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" 
                style={{ width: `${mentalLoadData.emotional}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Logística</span>
              <span className="text-sm font-medium text-gray-700">{mentalLoadData.logistics}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" 
                style={{ width: `${mentalLoadData.logistics}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sugerencias de redistribución */}
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-purple-600" />
            Sugerencias para Equilibrar
          </h3>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `var(--${suggestion.from.color}-100)` }}>
                        {suggestion.from.avatar}
                      </div>
                      <p className="text-xs text-gray-600">{suggestion.from.name}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-600">
                      <span>→</span>
                      <span className="text-sm font-medium">{suggestion.task.name}</span>
                      <span>→</span>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `var(--${suggestion.to.color}-100)` }}>
                        {suggestion.to.avatar}
                      </div>
                      <p className="text-xs text-gray-600">{suggestion.to.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => reassignTask(suggestion.task.id, suggestion.to.id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm"
                  >
                    Aplicar
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-12">
                  {suggestion.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tareas pendientes hoy */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-blue-600" />
          Tareas de Hoy
        </h3>
        
        <div className="space-y-3">
          {tasks.filter(t => t.frequency === 'diario').map(task => {
            const assignedMember = getMemberById(task.assignedTo);
            const CategoryIcon = getCategoryIcon(task.category);
            
            return (
              <div key={task.id} className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                
                <div className={`p-2 rounded-lg bg-${getCategoryColor(task.category)}-100`}>
                  <CategoryIcon className={`w-5 h-5 text-${getCategoryColor(task.category)}-600`} />
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {task.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {assignedMember?.avatar} {assignedMember?.name} • {task.time} min
                  </p>
                </div>
                
                <div className="flex space-x-1">
                  {[...Array(task.difficulty)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
                
                <button
                  onClick={() => openWhatsAppModal(task)}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all"
                  title="Enviar enlace para completar"
                >
                  <Link className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  
  // Componente Tareas
  const TasksTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Todas las Tareas</h3>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-orange-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Tarea</span>
        </button>
      </div>
      
      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const categoryTasks = tasks.filter(t => t.category === category.id);
          
          return (
            <div key={category.id} className={`flex items-center space-x-2 px-3 py-2 bg-${category.color}-100 text-${category.color}-700 rounded-full text-sm`}>
              <category.icon className={`w-4 h-4 text-${category.color}-600`} />
              <span>{category.name}</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {categoryTasks.length}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Lista de tareas por categoría */}
      {categories.map(category => {
        const categoryTasks = tasks.filter(t => t.category === category.id);
        if (categoryTasks.length === 0) return null;
        const CategoryIcon = category.icon;
        
        return (
          <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className={`p-2 bg-${category.color}-100 rounded-lg mr-3`}>
                <CategoryIcon className={`w-5 h-5 text-${category.color}-600`} />
              </div>
              {category.name}
            </h4>
            <div className="grid gap-3">
              {categoryTasks.map(task => {
                const assignedMember = getMemberById(task.assignedTo);
                
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3" />}
                      </button>
                      
                      <div>
                        <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {task.name}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{task.frequency}</span>
                          <span>{task.time} min</span>
                          <div className="flex space-x-1">
                            {[...Array(task.difficulty)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `var(--${assignedMember?.color}-100)` }}>
                          {assignedMember?.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{assignedMember?.name}</span>
                      </div>
                      
                      <select
                        value={task.assignedTo}
                        onChange={(e) => reassignTask(task.id, parseInt(e.target.value))}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {familyMembers.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.avatar} {member.name}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => openWhatsAppModal(task)}
                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all"
                        title="Enviar enlace para completar"
                      >
                        <Link className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
  
  // Componente Miembros
  const MembersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Miembros del Hogar</h3>
        <button
          onClick={() => setShowMemberModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Miembro</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map(member => (
          <div key={member.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `var(--${member.color}-100)` }}>
                {member.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{member.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                {member.age && <p className="text-sm text-gray-600">{member.age} años</p>}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vive en el hogar:</span>
                <span className={`text-sm font-medium ${member.livesHere ? 'text-green-600' : 'text-yellow-600'}`}>
                  {member.livesHere ? 'Sí' : 'No'}
                </span>
              </div>
              
              {member.contact && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teléfono:</span>
                  <span className="text-sm font-medium text-gray-800">{member.contact}</span>
                </div>
              )}
              
              {!member.livesHere && member.custodyDays && member.custodyDays.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Días de custodia:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.custodyDays.map((day, index) => (
                      <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tareas asignadas:</span>
                <span className="text-sm font-medium text-gray-800">
                  {tasks.filter(t => t.assignedTo === member.id).length}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setCurrentMember(member);
                  setShowMemberModal(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteMember(member.id)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Componente Notificaciones
  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Notificaciones</h3>
        <button
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Marcar todas como leídas
        </button>
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="text-gray-300 w-16 h-16 mx-auto mb-3" />
            <p className="text-gray-500">No tienes notificaciones</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`bg-white rounded-2xl shadow-lg p-4 border-l-4 ${
                notification.type === 'whatsapp' ? 'border-green-500' : 
                notification.type === 'completion' ? 'border-blue-500' : 'border-purple-500'
              } ${!notification.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  notification.type === 'whatsapp' ? 'bg-green-100 text-green-600' : 
                  notification.type === 'completion' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {notification.type === 'whatsapp' ? (
                    <Link className="w-5 h-5" />
                  ) : notification.type === 'completion' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    !
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  // Componente Completar Tarea
  const CompleteTaskTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Check className="w-6 h-6 mr-3 text-green-600" />
          Completar Tarea por Código
        </h3>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={completionCode}
            onChange={(e) => setCompletionCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Introduce el código de la tarea"
          />
          <button
            onClick={() => markTaskAsCompleted(completionCode)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Completar
          </button>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Instrucciones:</h4>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Recibirás un enlace único cuando se te asigne una tarea</li>
            <li>Haz clic en el enlace para abrir el modal de la tarea</li>
            <li>Marca la casilla de completado y haz clic en el botón</li>
            <li>La persona que te asignó la tarea recibirá una notificación</li>
          </ol>
        </div>
      </div>
    </div>
  );
  
  // Modal para enlace de tarea
  const TaskLinkModal = () => {
    const task = tasks.find(t => t.code === taskLinkCode);
    const assignedMember = getMemberById(task?.assignedTo);
    
    if (!task) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center mb-4 p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Tarea Asignada</h2>
            <button 
              onClick={() => setShowTaskLinkModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `var(--${assignedMember?.color}-100)` }}>
                {assignedMember?.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-800">{assignedMember?.name}</p>
                <p className="text-sm text-gray-600">Te ha asignado esta tarea</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{task.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{task.frequency}</span>
                <span>{task.time} min</span>
                <div className="flex space-x-1">
                  {[...Array(task.difficulty)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="taskCompleted"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="taskCompleted" className="text-gray-700">
                He completado esta tarea
              </label>
            </div>
            
            <button
              onClick={() => markTaskAsCompleted(task.code)}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
            >
              Marcar como completada
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Planificador de Corresponsabilidad
          </h1>
          <p className="text-gray-600">
            Distribuye tareas familiares de forma equilibrada. Tu bienestar también importa.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Tareas
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'members'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Miembros
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Notificaciones
              {notifications.some(n => !n.read) && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('complete')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'complete'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Completar Tarea
            </button>
          </div>
        </div>
        
        {/* Content */}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'complete' && <CompleteTaskTab />}
        
        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Nueva Tarea</h3>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la tarea</label>
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Sacar la basura"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asignar a</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar persona</option>
                    {familyMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.avatar} {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
                    <select
                      value={newTask.frequency}
                      onChange={(e) => setNewTask(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo (min)</label>
                    <input
                      type="number"
                      value={newTask.time}
                      onChange={(e) => setNewTask(prev => ({ ...prev, time: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="5"
                      max="300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificultad: {newTask.difficulty}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muy fácil</span>
                    <span>Muy difícil</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={addTask}
                  disabled={!newTask.name || !newTask.category || !newTask.assignedTo}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Tarea
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Member Modal */}
        {showMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  {currentMember ? 'Editar Miembro' : 'Agregar Miembro'}
                </h3>
                <button
                  onClick={() => {
                    setShowMemberModal(false);
                    setCurrentMember(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={currentMember ? currentMember.name : newMember.name}
                    onChange={(e) => {
                      if (currentMember) {
                        setCurrentMember({ ...currentMember, name: e.target.value });
                      } else {
                        setNewMember({ ...newMember, name: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    value={currentMember ? currentMember.role : newMember.role}
                    onChange={(e) => {
                      if (currentMember) {
                        setCurrentMember({ ...currentMember, role: e.target.value });
                      } else {
                        setNewMember({ ...newMember, role: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="madre">Madre</option>
                    <option value="padre">Padre</option>
                    <option value="pareja">Pareja</option>
                    <option value="hijo">Hijo/a</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                  <select
                    value={currentMember ? currentMember.avatar : newMember.avatar}
                    onChange={(e) => {
                      if (currentMember) {
                        setCurrentMember({ ...currentMember, avatar: e.target.value });
                      } else {
                        setNewMember({ ...newMember, avatar: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="👤">👤 Persona</option>
                    <option value="👩‍💼">👩‍💼 Mujer profesional</option>
                    <option value="👨‍💼">👨‍💼 Hombre profesional</option>
                    <option value="👩">👩 Mujer</option>
                    <option value="👨">👨 Hombre</option>
                    <option value="👧">👧 Niña</option>
                    <option value="👦">👦 Niño</option>
                    <option value="👶">👶 Bebé</option>
                    <option value="🧒">🧒 Niño/a</option>
                    <option value="👴">👴 Anciano</option>
                    <option value="👵">👵 Anciana</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    value={currentMember ? currentMember.color : newMember.color}
                    onChange={(e) => {
                      if (currentMember) {
                        setCurrentMember({ ...currentMember, color: e.target.value });
                      } else {
                        setNewMember({ ...newMember, color: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="gray">Gris</option>
                    <option value="rose">Rosa</option>
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="purple">Púrpura</option>
                    <option value="orange">Naranja</option>
                    <option value="yellow">Amarillo</option>
                    <option value="red">Rojo</option>
                    <option value="indigo">Índigo</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentMember ? currentMember.livesHere : newMember.livesHere}
                      onChange={(e) => {
                        if (currentMember) {
                          setCurrentMember({ ...currentMember, livesHere: e.target.checked });
                          if (!e.target.checked && !currentMember.custodyDays) {
                            setCurrentMember({ ...currentMember, livesHere: e.target.checked, custodyDays: [] });
                          }
                        } else {
                          setNewMember({ ...newMember, livesHere: e.target.checked });
                          if (!e.target.checked && !newMember.custodyDays) {
                            setNewMember({ ...newMember, livesHere: e.target.checked, custodyDays: [] });
                          }
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Vive en el hogar</span>
                  </label>
                </div>
                
                {!(currentMember ? currentMember.livesHere : newMember.livesHere) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Días de custodia</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                        <label key={day} className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={(currentMember ? currentMember.custodyDays : newMember.custodyDays)?.includes(day) || false}
                            onChange={(e) => {
                              const custodyDays = currentMember ? [...currentMember.custodyDays] : [...newMember.custodyDays];
                              if (e.target.checked) {
                                custodyDays.push(day);
                              } else {
                                const index = custodyDays.indexOf(day);
                                if (index > -1) {
                                  custodyDays.splice(index, 1);
                                }
                              }
                              
                              if (currentMember) {
                                setCurrentMember({ ...currentMember, custodyDays });
                              } else {
                                setNewMember({ ...newMember, custodyDays });
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono (para WhatsApp)</label>
                  <input
                    type="text"
                    value={currentMember ? currentMember.contact : newMember.contact}
                    onChange={(e) => {
                      if (currentMember) {
                        setCurrentMember({ ...currentMember, contact: e.target.value });
                      } else {
                        setNewMember({ ...newMember, contact: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={currentMember ? updateMember : addMember}
                  disabled={!(currentMember ? currentMember.name : newMember.name)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentMember ? 'Guardar Cambios' : 'Agregar Miembro'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* WhatsApp Modal */}
        {showWhatsAppModal && taskForWhatsApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Compartir Tarea</h3>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Genera un enlace único para que <strong>{getMemberById(taskForWhatsApp.assignedTo)?.name}</strong> pueda ver y marcar esta tarea como completada:
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Enlace de la tarea:</span>
                    <button
                      onClick={generateTaskLink}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Generar enlace
                    </button>
                  </div>
                  
                  {taskLink && (
                    <div className="bg-gray-100 p-3 rounded-lg mb-3">
                      <p className="text-sm break-all">{taskLink}</p>
                    </div>
                  )}
                  
                  {taskLink && (
                    <div className="flex space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedToClipboard ? '¡Copiado!' : 'Copiar enlace'}
                      </button>
                      <button
                        onClick={shareViaWhatsApp}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">¿Cómo funciona?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Genera un enlace único para esta tarea</li>
                    <li>• Comparte el enlace con la persona asignada</li>
                    <li>• Al hacer clic en el enlace, verá un modal con la tarea</li>
                    <li>• Podrá marcar la tarea como completada directamente</li>
                    <li>• Recibirás una notificación cuando la complete</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Task Link Modal */}
        {showTaskLinkModal && <TaskLinkModal />}
      </div>
    </div>
  );
};

export default ResponsibilityPlanner;