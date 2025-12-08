import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  AlertTriangle,
  CheckCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';

const MaternalChat = ({ onEmergencyTrigger = () => {} }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mia',
      content: 'Hola hermosa mamá 💕 Soy Mia, tu compañera de bienestar maternal. Estoy aquí para escucharte sin juzgar, apoyarte en todo momento y recordarte lo increíble que eres. ¿Cómo te sientes hoy?',
      timestamp: new Date(Date.now() - 1000),
      emotion: 'warm',
      type: 'text',
      suggestions: ['Me siento abrumada', 'Necesito desahogarme', 'Estoy bien', 'Tengo culpa maternal']
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState('neutral');
  
  // Estados para audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentAudioRef = useRef(null);

  // Procesar audio con OpenAI
  const processAudioWithOpenAI = async (audioBlob, isFromUser = true) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');

    try {
      // Transcribir audio
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: formData
      });

      const transcription = await transcriptionResponse.json();
      const text = transcription.text;

      if (isFromUser) {
        // Detectar emoción del texto transcrito
        const { emotion, intensity } = detectEmotion(text);
        setDetectedEmotion(emotion);

        // Activar crisis si es necesario
        if (emotion === 'crisis' && intensity > 0) {
          if (onEmergencyTrigger) {
            setTimeout(() => onEmergencyTrigger(), 2000);
          }
        }

        // Generar respuesta de Mia
        const response = generateEmpathicResponse(text, emotion);
        
        // Crear audio de respuesta con OpenAI TTS
        const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: response.immediate + ' ' + response.followUp,
            voice: 'nova', // Voz femenina y cálida
            speed: 0.9
          })
        });

        const audioBuffer = await ttsResponse.arrayBuffer();
        const responseAudioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

        return {
          transcription: text,
          emotion,
          response,
          audioResponse: responseAudioBlob
        };
      }

    } catch (error) {
      console.error('Error procesando audio:', error);
      throw error;
    }
  };

  // Iniciar grabación de audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        handleAudioMessage(audioBlob);
        
        // Detener todas las pistas de audio
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error iniciando grabación:', error);
      alert('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  };

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Manejar mensaje de audio
  const handleAudioMessage = async (audioBlob) => {
    // Agregar mensaje de audio del usuario
    const audioUrl = URL.createObjectURL(audioBlob);
    addMessage('user', null, { 
      type: 'audio', 
      audioUrl, 
      audioBlob 
    });

    setIsTyping(true);

    try {
      const result = await processAudioWithOpenAI(audioBlob, true);
      
      // Agregar respuesta de audio de Mia
      const responseAudioUrl = URL.createObjectURL(result.audioResponse);
      
      setTimeout(() => {
        addMessage('mia', result.response.immediate, {
          type: 'audio',
          audioUrl: responseAudioUrl,
          audioBlob: result.audioResponse,
          emotion: result.emotion,
          color: empathicResponses[result.emotion]?.color || 'blue',
          avatar: empathicResponses[result.emotion]?.avatar || '💙',
          suggestions: result.response.suggestions,
          autoPlay: true
        });
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error('Error procesando mensaje de audio:', error);
      setIsTyping(false);
      
      // Fallback a respuesta de texto
      addMessage('mia', 'Lo siento, hubo un problema procesando tu mensaje de audio. ¿Podrías escribirlo?', {
        type: 'text',
        color: 'amber',
        avatar: '⚠️'
      });
    }
  };

  // Reproducir/pausar audio
  const toggleAudioPlayback = (messageId, audioUrl) => {
    if (currentAudioRef.current && !currentAudioRef.current.paused) {
      currentAudioRef.current.pause();
      setIsPlayingAudio(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    
    audio.play();
    setIsPlayingAudio(messageId);
    
    audio.onended = () => {
      setIsPlayingAudio(null);
    };
  };

  // Resto del código de detección emocional y respuestas...
  const emotionalKeywords = {
    crisis: ['quiero morir', 'no puedo más', 'quiero desaparecer', 'suicidio', 'hacerme daño', 'no sirvo para nada', 'soy una mala madre', 'odio ser madre'],
    overwhelmed: ['abrumada', 'saturada', 'colapso', 'no doy más', 'agotada', 'cansada', 'estresada', 'desbordada'],
    guilt: ['culpa', 'mala madre', 'no soy suficiente', 'debería', 'fracaso', 'no lo hago bien'],
    lonely: ['sola', 'aislada', 'nadie me entiende', 'soledad', 'sin apoyo', 'abandonada'],
    angry: ['enojada', 'furiosa', 'rabia', 'ira', 'odio', 'grité', 'exploté'],
    sad: ['triste', 'lloro', 'deprimida', 'melancólica', 'vacía', 'desesperanza'],
    happy: ['feliz', 'contenta', 'bien', 'orgullosa', 'logré', 'celebro', 'alegre'],
    grateful: ['agradecida', 'bendecida', 'afortunada', 'reconocida', 'valorada']
  };

  const empathicResponses = {
    crisis: {
      immediate: "💕 Primero, quiero que sepas que tu vida tiene un valor inmenso. Lo que sientes ahora es temporal, aunque no lo parezca.",
      followUp: "Has sido muy valiente al compartir estos sentimientos. ¿Te parece si activamos el apoyo de emergencia?",
      suggestions: ['Activar apoyo de emergencia', 'Técnicas de respiración inmediata'],
      color: 'red', avatar: '🚨'
    },
    overwhelmed: {
      immediate: "Respira conmigo por un momento 🌸 Es completamente normal sentirse abrumada.",
      followUp: "Tu agotamiento es válido y real. ¿Qué es lo que más te está pesando ahora mismo?",
      suggestions: ['Técnica de descarga mental', 'Lista de prioridades'],
      color: 'amber', avatar: '🌪️'
    },
    guilt: {
      immediate: "Oh, mi corazón se conecta con el tuyo 💗 La culpa maternal es tan común porque te importa profundamente ser buena madre.",
      followUp: "No hay una forma 'correcta' de ser madre perfecta. Solo hay TU forma única y amorosa.",
      suggestions: ['Antídoto para la culpa', 'Lista de cosas que SÍ hago bien'],
      color: 'rose', avatar: '💝'
    }
  };

  const detectEmotion = (message) => {
    const lowerMessage = message.toLowerCase();
    let maxCount = 0;
    let detectedEmotion = 'neutral';
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      const count = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (count > maxCount) {
        maxCount = count;
        detectedEmotion = emotion;
      }
    }
    
    return { emotion: detectedEmotion, intensity: maxCount };
  };

  const generateEmpathicResponse = (userMessage, emotion) => {
    return empathicResponses[emotion] || {
      immediate: "Te escucho con todo mi corazón 💕 Gracias por confiar en mí y compartir lo que sientes.",
      followUp: "Estoy aquí para ti, sin juicios, solo con comprensión y apoyo.",
      suggestions: ['Técnica de respiración', 'Momento de autocompasión'],
      color: 'blue', avatar: '💙'
    };
  };

  const addMessage = (sender, content, options = {}) => {
    const newMessage = {
      id: Date.now(),
      sender,
      content,
      timestamp: new Date(),
      type: options.type || 'text',
      audioUrl: options.audioUrl,
      audioBlob: options.audioBlob,
      emotion: options.emotion || 'neutral',
      suggestions: options.suggestions || [],
      color: options.color || 'blue',
      avatar: options.avatar || '💙',
      ...options
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-reproducir audio de Mia
    if (sender === 'mia' && options.type === 'audio' && options.autoPlay) {
      setTimeout(() => {
        toggleAudioPlayback(newMessage.id, options.audioUrl);
      }, 500);
    }
    
    scrollToBottom();
  };

  // Manejar envío de texto
  const handleSendMessage = async (messageText = null) => {
    const message = messageText || currentMessage.trim();
    if (!message) return;
    
    setCurrentMessage('');
    addMessage('user', message, { type: 'text' });
    
    const { emotion, intensity } = detectEmotion(message);
    setDetectedEmotion(emotion);
    
    if (emotion === 'crisis' && intensity > 0) {
      if (onEmergencyTrigger) {
        setTimeout(() => onEmergencyTrigger(), 2000);
      }
    }
    
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateEmpathicResponse(message, emotion);
      
      addMessage('mia', response.immediate, {
        type: 'text',
        emotion,
        color: response.color,
        avatar: response.avatar
      });
      
      setTimeout(() => {
        addMessage('mia', response.followUp, {
          type: 'text',
          emotion,
          suggestions: response.suggestions,
          color: response.color,
          avatar: response.avatar
        });
        setIsTyping(false);
      }, 2000);
      
    }, 1500);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Heart className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold">Mia - Tu Compañera Maternal</h2>
              <p className="text-rose-100 text-sm">Con amor y sin juicios 💕</p>
            </div>
          </div>
        </div>
        
        {detectedEmotion !== 'neutral' && (
          <div className="mt-3 px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm inline-flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              detectedEmotion === 'crisis' ? 'bg-red-400 animate-ping' :
              detectedEmotion === 'happy' ? 'bg-green-400 animate-pulse' :
              'bg-yellow-400 animate-pulse'
            }`}></div>
            <span>Modo: {
              detectedEmotion === 'crisis' ? 'Emergencia' :
              detectedEmotion === 'happy' ? 'Celebración' :
              'Apoyo empático'
            }</span>
          </div>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {message.sender === 'mia' && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{message.avatar || '💙'}</span>
                  <span className="text-xs font-semibold text-gray-500">Mia</span>
                  {message.emotion === 'crisis' && (
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                  )}
                </div>
              )}
              
              {message.type === 'audio' ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleAudioPlayback(message.id, message.audioUrl)}
                    className={`p-2 rounded-full transition-colors ${
                      message.sender === 'user' 
                        ? 'bg-white/20 hover:bg-white/30 text-white' 
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-600'
                    }`}
                  >
                    {isPlayingAudio === message.id ? 
                      <Pause className="w-5 h-5" /> : 
                      <Play className="w-5 h-5" />
                    }
                  </button>
                  <div className="flex-1">
                    <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${
                      message.sender === 'user' ? 'bg-white/20' : ''
                    }`}>
                      <div className={`h-full transition-all duration-300 ${
                        isPlayingAudio === message.id 
                          ? 'w-full bg-rose-400 animate-pulse' 
                          : 'w-0 bg-rose-400'
                      }`}></div>
                    </div>
                    <p className="text-xs mt-1 opacity-70">
                      {message.sender === 'user' ? 'Mensaje de voz' : 'Respuesta de voz de Mia'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
              
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${
                  message.sender === 'user' ? 'text-rose-100' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {message.sender === 'user' && (
                  <CheckCircle className="w-4 h-4 text-rose-200" />
                )}
              </div>

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Puedo ayudarte con:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className={`px-3 py-1 text-xs rounded-full border-2 transition-all hover:scale-105 ${
                          message.color === 'red' ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' :
                          message.color === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' :
                          'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 italic">Mia está respondiendo...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 shadow-2xl flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe aquí o usa el micrófono para hablar..."
              className="w-full px-4 py-3 pr-16 border-2 border-rose-200 rounded-2xl focus:outline-none focus:border-rose-500 bg-white/90 placeholder-gray-500 text-gray-800"
            />
          </div>
          
          {/* Botón micrófono */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse' 
                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
            }`}
            title={isRecording ? 'Parar grabación' : 'Grabar mensaje de voz'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          {/* Botón enviar texto */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!currentMessage.trim()}
            className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl flex items-center justify-center hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 italic">
            💕 Espacio seguro para tus emociones
          </p>
          <p className="text-xs text-gray-400">
            {isRecording ? '🔴 Grabando...' : '🎤 Toca para mensaje de voz'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaternalChat;