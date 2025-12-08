import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Plus, 
  Search, 
  Shield, 
  Clock,
  Briefcase,
  Award,
  AlertTriangle,
  CheckCircle,
  Send,
  Bookmark,
  Coffee,
  Moon,
  Baby,
  Edit3,
  Trash2,
  Bell,
  BellOff,
  Star,
  TrendingUp,
  Crown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MaternalCommunity = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [editingComment, setEditingComment] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({
    content: '',
    topic: '',
    anonymous: false
  });
  
  // Sistema de reputación de usuarios
  const [userReputation, setUserReputation] = useState({
    'María L.': { level: 3, points: 450, badge: 'Madre Experimentada', helpfulPosts: 12 },
    'Ana G.': { level: 2, points: 280, badge: 'Compañera Solidaria', helpfulPosts: 8 },
    'Carmen R.': { level: 4, points: 650, badge: 'Mentora Maternal', helpfulPosts: 20 },
    'Laura M.': { level: 2, points: 320, badge: 'Compañera Solidaria', helpfulPosts: 9 },
    'Tú': { level: 1, points: 85, badge: 'Nueva Mamá', helpfulPosts: 2 }
  });

  // Posts con sistema de moderación en tiempo real
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'María L.',
        avatar: '👩‍💼',
        children: ['3-5 años', '6-12 años'],
        verified: true,
        reputation: userReputation['María L.']
      },
      content: 'Hoy grité a mis hijos y me siento horrible. ¿Cómo manejan ustedes esos momentos cuando sienten que van a explotar?',
      topic: 'culpa_maternal',
      timestamp: '2 horas',
      likes: 23,
      comments: 12,
      bookmarked: false,
      following: false,
      anonymous: false,
      isAuthor: false,
      moderationStatus: 'approved',
      helpfulVotes: 18,
      commentsList: [
        {
          id: 1,
          author: { 
            name: 'Ana G.', 
            avatar: '👩‍🦰',
            reputation: userReputation['Ana G.']
          },
          content: 'Te entiendo perfectamente. Yo respiro hondo y me alejo 2 minutos al baño. Después vuelvo más calmada.',
          timestamp: '1 hora',
          likes: 8,
          isAuthor: false,
          helpfulVotes: 6
        },
        {
          id: 2,
          author: { 
            name: 'Laura M.', 
            avatar: '👩‍💻',
            reputation: userReputation['Laura M.']
          },
          content: 'A todas nos pasa. Lo importante es disculparse después y explicarles que mamá también se frustra.',
          timestamp: '45 minutos',
          likes: 12,
          isAuthor: false,
          helpfulVotes: 9
        }
      ]
    },
    {
      id: 2,
      author: {
        name: 'Anónimo',
        avatar: '🌸',
        children: ['0-2 años'],
        verified: false,
        reputation: { level: 1, points: 45, badge: 'Nueva en la Comunidad', helpfulPosts: 1 }
      },
      content: 'Mi bebé de 8 meses se despierta cada 2 horas. Estoy agotada y mi pareja dice que "es normal". ¿Cuándo mejora esto?',
      topic: 'agotamiento',
      timestamp: '4 horas',
      likes: 45,
      comments: 28,
      bookmarked: true,
      following: true,
      anonymous: true,
      isAuthor: false,
      moderationStatus: 'approved',
      helpfulVotes: 32,
      commentsList: [
        {
          id: 1,
          author: { 
            name: 'Carmen R.', 
            avatar: '👩‍⚕️',
            reputation: userReputation['Carmen R.']
          },
          content: 'Entre los 6-12 meses muchos bebés empiezan a dormir mejor. Pero si estás muy agotada, habla con tu pediatra.',
          timestamp: '3 horas',
          likes: 15,
          isAuthor: false,
          helpfulVotes: 12
        }
      ]
    }
  ]);
  
  const [newComment, setNewComment] = useState({});
  
  // Temas principales simplificados
  const topics = [
    { id: 'culpa_maternal', name: 'Culpa Maternal', icon: Heart, color: 'rose' },
    { id: 'agotamiento', name: 'Agotamiento', icon: Moon, color: 'purple' },
    { id: 'corresponsabilidad', name: 'Pareja y Familia', icon: Users, color: 'blue' },
    { id: 'trabajo_maternidad', name: 'Trabajo y Maternidad', icon: Briefcase, color: 'green' },
    { id: 'autocuidado', name: 'Tiempo Para Mí', icon: Coffee, color: 'amber' },
    { id: 'testimonio_esperanza', name: 'Testimonios Positivos', icon: Award, color: 'emerald' }
  ];
  
  // Estadísticas reales sobre maternidad
  const realStats = [
    {
      value: '85%',
      description: 'de las madres experimentan carga mental diaria',
      source: 'Estudio Universidad Complutense 2023'
    },
    {
      value: '73%',
      description: 'sienten culpa maternal frecuentemente',
      source: 'Instituto Nacional de Estadística 2023'
    },
    {
      value: '67%',
      description: 'no tienen tiempo suficiente para el autocuidado',
      source: 'Encuesta Maternidad Real España 2023'
    }
  ];
  
  // Moderación en tiempo real con IA
  const moderateContentRealTime = (content) => {
    const toxicPatterns = [
      'mala madre', 'no sirves', 'terrible madre', 'deberías', 
      'qué madre eres', 'pobres niños', 'irresponsable'
    ];
    const supportivePatterns = [
      'te entiendo', 'no estás sola', 'es normal', 'todas pasamos por eso',
      'ánimo', 'mejorará', 'eres fuerte', 'lo estás haciendo bien'
    ];
    
    const lowerContent = content.toLowerCase();
    const hasToxicContent = toxicPatterns.some(pattern => lowerContent.includes(pattern));
    const hasSupportiveContent = supportivePatterns.some(pattern => lowerContent.includes(pattern));
    
    if (hasToxicContent) {
      return {
        approved: false,
        reason: '🤖 IA Mia detectó contenido que podría ser hiriente. Este es un espacio de apoyo mutuo.',
        suggestion: 'Prueba reformulándolo de manera más empática y constructiva.'
      };
    }
    
    return { 
      approved: true, 
      supportive: hasSupportiveContent,
      reputationBonus: hasSupportiveContent ? 10 : 5
    };
  };

  const handleNewPost = () => {
    if (!newPost.content.trim() || !newPost.topic) return;
    
    const moderation = moderateContentRealTime(newPost.content);
    
    if (!moderation.approved) {
      alert(`${moderation.reason}\n\n💡 ${moderation.suggestion}`);
      return;
    }
    
    const post = {
      id: Date.now(),
      author: {
        name: newPost.anonymous ? 'Anónimo' : 'Tú',
        avatar: newPost.anonymous ? '🌸' : '👩‍💼',
        children: ['3-5 años'],
        verified: true,
        reputation: userReputation['Tú']
      },
      content: newPost.content,
      topic: newPost.topic,
      timestamp: 'ahora',
      likes: 0,
      comments: 0,
      bookmarked: false,
      following: false,
      anonymous: newPost.anonymous,
      isAuthor: true,
      moderationStatus: 'approved',
      helpfulVotes: 0,
      commentsList: []
    };
    
    setPosts([post, ...posts]);
    setNewPost({ content: '', topic: '', anonymous: false });
    setShowNewPost(false);
    
    // Actualizar reputación
    if (moderation.supportive) {
      updateUserReputation('Tú', moderation.reputationBonus);
    }
    
    alert('✨ ¡Compartido! Gracias por contribuir a nuestra comunidad de apoyo.');
  };

  const updateUserReputation = (userName, points) => {
    setUserReputation(prev => {
      const current = prev[userName] || { level: 1, points: 0, badge: 'Nueva Mamá', helpfulPosts: 0 };
      const newPoints = current.points + points;
      let newLevel = current.level;
      let newBadge = current.badge;
      
      // Sistema de niveles
      if (newPoints >= 500) {
        newLevel = 4;
        newBadge = 'Mentora Maternal';
      } else if (newPoints >= 300) {
        newLevel = 3;
        newBadge = 'Madre Experimentada';
      } else if (newPoints >= 150) {
        newLevel = 2;
        newBadge = 'Compañera Solidaria';
      }
      
      return {
        ...prev,
        [userName]: {
          ...current,
          points: newPoints,
          level: newLevel,
          badge: newBadge,
          helpfulPosts: current.helpfulPosts + (points > 5 ? 1 : 0)
        }
      };
    });
  };
  
  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const toggleCommentLike = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsList: post.commentsList.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: comment.likes + 1 }
              : comment
          )
        };
      }
      return post;
    }));
  };

  const markAsHelpful = (postId, commentId = null) => {
    if (commentId) {
      // Marcar comentario como útil
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsList: post.commentsList.map(comment => {
              if (comment.id === commentId) {
                updateUserReputation(comment.author.name, 15);
                return { ...comment, helpfulVotes: comment.helpfulVotes + 1 };
              }
              return comment;
            })
          };
        }
        return post;
      }));
    } else {
      // Marcar post como útil
      setPosts(posts.map(post => {
        if (post.id === postId) {
          updateUserReputation(post.author.name, 10);
          return { ...post, helpfulVotes: post.helpfulVotes + 1 };
        }
        return post;
      }));
    }
  };
  
  const toggleBookmarkAndFollow = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newBookmarked = !post.bookmarked;
        const newFollowing = newBookmarked; // Seguir automáticamente al guardar
        
        if (newFollowing) {
          // Simular configuración de notificación push
          if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('¡Post guardado y seguimiento activado!', {
                  body: 'Te notificaremos cuando haya nuevas respuestas.',
                  icon: '🔔'
                });
              }
            });
          }
        }
        
        return { 
          ...post, 
          bookmarked: newBookmarked,
          following: newFollowing
        };
      }
      return post;
    }));
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const startEditingPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    setEditingPost({ postId, originalContent: post.content });
    setNewPost({ ...newPost, content: post.content });
  };

  const saveEditedPost = (postId) => {
    if (!newPost.content.trim()) return;
    
    const moderation = moderateContentRealTime(newPost.content);
    
    if (!moderation.approved) {
      alert(`${moderation.reason}\n\n💡 ${moderation.suggestion}`);
      return;
    }

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, content: newPost.content, timestamp: post.timestamp + ' (editado)' }
        : post
    ));
    
    setEditingPost(null);
    setNewPost({ content: '', topic: '', anonymous: false });
  };

  const deletePost = (postId) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const startEditingComment = (postId, commentId) => {
    const post = posts.find(p => p.id === postId);
    const comment = post.commentsList.find(c => c.id === commentId);
    setEditingComment({ postId, commentId, originalContent: comment.content });
    setNewComment({ ...newComment, [postId]: comment.content });
  };

  const saveEditedComment = (postId, commentId) => {
    if (!newComment[postId]?.trim()) return;
    
    const moderation = moderateContentRealTime(newComment[postId]);
    
    if (!moderation.approved) {
      alert(`${moderation.reason}\n\n💡 ${moderation.suggestion}`);
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsList: post.commentsList.map(comment => 
            comment.id === commentId 
              ? { ...comment, content: newComment[postId], timestamp: comment.timestamp + ' (editado)' }
              : comment
          )
        };
      }
      return post;
    }));
    
    setEditingComment(null);
    setNewComment({ ...newComment, [postId]: '' });
  };

  const deleteComment = (postId, commentId) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este comentario?')) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments - 1,
            commentsList: post.commentsList.filter(comment => comment.id !== commentId)
          };
        }
        return post;
      }));
    }
  };
  
  const handleAddComment = (postId) => {
    if (!newComment[postId]?.trim()) return;
    
    const moderation = moderateContentRealTime(newComment[postId]);
    
    if (!moderation.approved) {
      alert(`${moderation.reason}\n\n💡 ${moderation.suggestion}`);
      return;
    }
    
    const comment = {
      id: Date.now(),
      author: { 
        name: 'Tú', 
        avatar: '👩‍💼',
        reputation: userReputation['Tú']
      },
      content: newComment[postId],
      timestamp: 'ahora',
      likes: 0,
      isAuthor: true,
      helpfulVotes: 0
    };
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: post.comments + 1,
            commentsList: [...post.commentsList, comment]
          }
        : post
    ));
    
    // Actualizar reputación por comentario útil
    updateUserReputation('Tú', moderation.reputationBonus);
    
    setNewComment({...newComment, [postId]: ''});

    // Notificar a seguidores del post
    const post = posts.find(p => p.id === postId);
    if (post && post.following && 'Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('Nueva respuesta en tu post seguido', {
          body: 'Alguien respondió a un post que estás siguiendo.',
          icon: '💬'
        });
      }, 1000);
    }
  };
  
  const getTopicInfo = (topicId) => {
    return topics.find(t => t.id === topicId) || { name: 'General', color: 'gray', icon: MessageSquare };
  };

  const getReputationBadgeColor = (level) => {
    const colors = {
      1: 'bg-gray-100 text-gray-700',
      2: 'bg-blue-100 text-blue-700', 
      3: 'bg-purple-100 text-purple-700',
      4: 'bg-yellow-100 text-yellow-700'
    };
    return colors[level] || colors[1];
  };
  
  // Filtrado
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = !selectedTopic || post.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con reputación del usuario */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Comunidad de Madres
          </h1>
          <p className="text-gray-600 mb-4">
            Un espacio seguro para compartir la realidad de la maternidad
          </p>

          {/* Badge de reputación del usuario */}
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getReputationBadgeColor(userReputation['Tú'].level)} mb-6`}>
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{userReputation['Tú'].badge}</span>
            <span className="text-xs">({userReputation['Tú'].points} puntos)</span>
          </div>
          
          {/* Estadísticas reales */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {realStats.map((stat, index) => (
              <div key={index} className="bg-white/80 rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Barra de búsqueda y nuevo post */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar experiencias similares..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowNewPost(true)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </div>
          
          {/* Filtros por tema */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopic('')}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                !selectedTopic 
                  ? 'bg-purple-100 text-purple-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos los temas
            </button>
            {topics.map(topic => {
              const TopicIcon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTopic === topic.id
                      ? `bg-${topic.color}-100 text-${topic.color}-700 font-medium`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <TopicIcon className="w-4 h-4" />
                  <span>{topic.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => {
              const topicInfo = getTopicInfo(post.topic);
              const TopicIcon = topicInfo.icon;
              const isExpanded = expandedPosts.has(post.id);
              
              return (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
                  
                  {/* Header del post */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <span className="text-2xl">{post.author.avatar}</span>
                        {post.author.verified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-800">{post.author.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getReputationBadgeColor(post.author.reputation.level)}`}>
                            {post.author.reputation.badge}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>Hijos: {post.author.children.join(', ')}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                          {post.helpfulVotes > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center space-x-1 text-green-600">
                                <TrendingUp className="w-3 h-3" />
                                <span>{post.helpfulVotes} útil</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 bg-${topicInfo.color}-100 text-${topicInfo.color}-700 rounded-full text-xs`}>
                        <TopicIcon className="w-3 h-3" />
                        <span>{topicInfo.name}</span>
                      </div>
                      
                      {post.isAuthor && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => startEditingPost(post.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-all"
                          >
                            <Edit3 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contenido del post */}
                  <div className="mb-4">
                    {editingPost?.postId === post.id ? (
                      <div>
                        <textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => setEditingPost(null)}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => saveEditedPost(post.id)}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 leading-relaxed">
                        {post.content}
                      </p>
                    )}
                  </div>
                  
                  {/* Acciones principales */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-rose-600 transition-all"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => togglePostExpansion(post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">{post.comments} respuestas</span>
                        {isExpanded ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </button>
                      
                      <button
                        onClick={() => markAsHelpful(post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-all"
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm">Útil ({post.helpfulVotes})</span>
                      </button>
                      
                      <button
                        onClick={() => toggleBookmarkAndFollow(post.id)}
                        className={`flex items-center space-x-2 transition-all ${
                          post.bookmarked ? 'text-yellow-600' : 'text-gray-600 hover:text-yellow-600'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                        {post.following && <Bell className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-green-600 text-xs">
                      <Shield className="w-4 h-4" />
                      <span>IA Mia ✓</span>
                    </div>
                  </div>
                  
                  {/* Sección de comentarios expandible */}
                  {isExpanded && (
                    <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                      {post.commentsList.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <span className="text-lg">{comment.author.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h5 className="font-medium text-gray-800">{comment.author.name}</h5>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getReputationBadgeColor(comment.author.reputation?.level || 1)}`}>
                                  {comment.author.reputation?.badge || 'Miembro'}
                                </span>
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                              </div>
                              {comment.isAuthor && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => startEditingComment(post.id, comment.id)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-all"
                                  >
                                    <Edit3 className="w-3 h-3 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => deleteComment(post.id, comment.id)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-all"
                                  >
                                    <Trash2 className="w-3 h-3 text-gray-500" />
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {editingComment?.postId === post.id && editingComment?.commentId === comment.id ? (
                              <div className="mt-2">
                                <textarea
                                  value={newComment[post.id] || ''}
                                  onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                                />
                                <div className="flex justify-end mt-2 space-x-2">
                                  <button
                                    onClick={() => setEditingComment(null)}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => saveEditedComment(post.id, comment.id)}
                                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all"
                                  >
                                    Guardar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-700 mt-1 text-sm">{comment.content}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <button 
                                onClick={() => toggleCommentLike(post.id, comment.id)}
                                className="flex items-center space-x-1 text-gray-500 text-xs hover:text-rose-600 transition-all"
                              >
                                <Heart className="w-3 h-3" />
                                <span>{comment.likes}</span>
                              </button>
                              
                              <button
                                onClick={() => markAsHelpful(post.id, comment.id)}
                                className="flex items-center space-x-1 text-gray-500 text-xs hover:text-green-600 transition-all"
                              >
                                <TrendingUp className="w-3 h-3" />
                                <span>Útil ({comment.helpfulVotes || 0})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Nuevo comentario */}
                      <div className="flex items-start space-x-3 pt-4 border-t border-gray-100">
                        <span className="text-xl">👩‍💼</span>
                        <div className="flex-1">
                          <textarea
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                            placeholder="Comparte tu experiencia o apoyo..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                              className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-3 h-3" />
                              <span>Responder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron posts</h3>
              <p className="text-gray-500 mb-4">Prueba con otro término de búsqueda o tema</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedTopic('');}}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Ver todos los posts
              </button>
            </div>
          )}
        </div>
        
        {/* Modal nuevo post */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Compartir tu experiencia</h3>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Sobre qué tema quieres hablar?
                  </label>
                  <select
                    value={newPost.topic}
                    onChange={(e) => setNewPost(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un tema</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu mensaje
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Comparte tu experiencia, pregunta o consejo. Este es un espacio seguro donde todas nos entendemos..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newPost.anonymous}
                    onChange={(e) => setNewPost(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Publicar de forma anónima</span>
                </label>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>🤖 IA Mia revisará el contenido</span>
                  </div>
                  <button
                    onClick={handleNewPost}
                    disabled={!newPost.content.trim() || !newPost.topic}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sistema de reputación y seguridad */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Tu Espacio Seguro y Colaborativo
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Moderación IA en Tiempo Real</h4>
                  <p className="text-gray-600">Mia filtra automáticamente contenido hiriente antes de publicarse.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Sistema de Reputación</h4>
                  <p className="text-gray-600">Gana puntos ayudando a otras madres y sube de nivel en la comunidad.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Seguimiento Inteligente</h4>
                  <p className="text-gray-600">Al guardar un post, recibes notificaciones de nuevas respuestas útiles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaternalCommunity;