import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Sparkles, Minimize2, Eraser } from 'lucide-react';
import { createChatSession, ChatSession } from '../services/geminiService';
import { MessageSender, ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGE, API_URL } from '../constants';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

// Avatar component with circular crop and fallback icon
const AvatarPhoto: React.FC<{ size?: 'sm' | 'md'; variant?: 'header' | 'message' }> = ({ size = 'md', variant = 'message' }) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const bgClass = variant === 'header' ? 'bg-indigo-600' : 'bg-indigo-600/20';
  const iconColor = variant === 'header' ? 'text-white' : 'text-indigo-400';
  const Icon = variant === 'header' ? Sparkles : Bot;
  
  if (imageError) {
    return (
      <div className={`${sizeClasses} rounded-full ${bgClass} flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0`}>
        <Icon size={size === 'sm' ? 14 : 16} className={iconColor} />
      </div>
    );
  }
  
  return (
    <div className={`${sizeClasses} rounded-full overflow-hidden border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/30 flex-shrink-0`} style={{ aspectRatio: '1 / 1' }}>
      <img 
        src="/profile_pic2.jpg" 
        alt="Virtual Panos" 
        className="w-full h-full object-cover object-center"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, isMobile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [showToasty, setShowToasty] = useState(false);
  // Generate unique session ID for conversation memory - can be regenerated on "New chat"
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toastyAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Project lists for expandable buttons
  const mlProjects = [
    { id: 'hw1-p1', name: 'HW1 Problem 1: Wine Quality Analysis', prompt: 'Tell me about your HW1_Problem1 project analyzing wine quality with Linear Regression. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw1-p2', name: 'HW1 Problem 2: MNIST Classification', prompt: 'Tell me about your HW1_Problem2 project on MNIST classification with SGDClassifier. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw2-p1', name: 'HW2 Problem 1: Polynomial Regression', prompt: 'Tell me about your HW2_Problem1 project on Polynomial Regression and Learning Curves with sinusoidal data. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw2-p2', name: 'HW2 Problem 2: Breast Cancer Classification', prompt: 'Tell me about your HW2_Problem2 project on Breast Cancer classification with SVM. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw3-p1', name: 'HW3 Problem 1: Decision Trees & Ensembles', prompt: 'Tell me about your HW3_Problem1 project on Decision Trees, Ensemble Models, and Dimensionality Reduction with MNIST. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw3-p2', name: 'HW3 Problem 2: Ensemble Models & Semi-supervised', prompt: 'Tell me about your HW3_Problem2 project on Ensemble Models and Semi-supervised Learning with the Pima diabetes dataset. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw4-p1', name: 'HW4 Problem 1: Neural Networks', prompt: 'Tell me about your HW4_Problem1 project on Neural Networks with Fashion MNIST. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw4-p2', name: 'HW4 Problem 2: Overfitting Mitigation', prompt: 'Tell me about your HW4_Problem2 project on overfitting mitigation strategies with Neural Networks on Fashion MNIST. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw5-p1', name: 'HW5 Problem 1: Clustering', prompt: 'Tell me about your HW5_Problem1 project on Unsupervised Learning and Clustering with MNIST. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw5-p2', name: 'HW5 Problem 2: Time Series Forecasting', prompt: 'Tell me about your HW5_Problem2 project on Time Series Forecasting with Neural Networks using Sunspots data. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw6-p1', name: 'HW6 Problem 1: Autoencoders', prompt: 'Tell me about your HW6_Problem1 project on Autoencoders with Fashion MNIST. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'hw6-p2', name: 'HW6 Problem 2: GANs', prompt: 'Tell me about your HW6_Problem2 project on Generative Adversarial Networks (GANs) with Fashion MNIST. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
  ];

  const dataScienceProjects = [
    { id: 'nobel', name: 'Nobel Prizes Analysis', prompt: 'Tell me about your Nobel_Prizes_Analysis project analyzing Nobel laureates and Alfred Nobel\'s legacy. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'space', name: 'Space Missions Analysis', prompt: 'Tell me about your Space_Missions_Analysis project analyzing space race missions and launches since 1957. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'movie', name: 'Movie Budget Analysis', prompt: 'Tell me about your Movie_Budget_and_Financial_Records project analyzing film budgets and box office revenue. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'regression', name: 'Multivariable Regression', prompt: 'Tell me about your Multivariable_Regression_and_House_Valuation_Model project on Boston Housing Prices. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'handwashing', name: 'Handwashing Analysis', prompt: 'Tell me about your Handwashing_and_Deaths_at_Childbirth project analyzing Dr Semmelweis and Vienna General Hospital data. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'fatal', name: 'Fatal Force Analysis', prompt: 'Tell me about your Fatal_Force project. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'google-play', name: 'Google Play Store Analytics', prompt: 'Tell me about your Google_Play_Store_App_Analytics project. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
    { id: 'google-trends', name: 'Google Trends & Visualization', prompt: 'Tell me about your Google_Trends_and_Data_Visualisation project. Walk me through it end-to-end like I\'m a hiring manager. You can use technical terms.' },
  ];

  const aiProjects = [
    { id: 'gaia', name: 'GAIA Agent', prompt: 'Tell me about your GAIA Agent project - the multi-tool AI agent for complex question answering using LangGraph, LangChain, and multiple tools. Walk me through it end-to-end like I\'m a hiring manager. Include details about the architecture, tools, and Panos\' implementation insights. You can use technical terms.' },
    { id: 'photo-manager', name: 'AI Photo Manager', prompt: 'Tell me about your AI Photo Gallery Manager project - the local photo manager that uses AI vision models for semantic search and image management. Walk me through it end-to-end like I\'m a hiring manager. Include details about the architecture, AI providers, and Panos\' implementation insights. You can use technical terms.' },
  ];

  // Initialize chat session once
  useEffect(() => {
    const session = createChatSession();
    setChatSession(session);
    
    // Add initial greeting
    setMessages([
      {
        id: 'init',
        text: INITIAL_CHAT_MESSAGE,
        sender: MessageSender.AI,
        timestamp: new Date()
      }
    ]);

    // Initialize audio for toasty sound with reduced volume
    toastyAudioRef.current = new Audio('/toasty/toasty.mp3');
    toastyAudioRef.current.volume = 0.3; // Set volume to 30% (0.0 to 1.0)
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside to minimize
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        // Check if the click is on the chat button itself
        const chatButton = document.querySelector('.chat-button-container');
        if (chatButton && chatButton.contains(event.target as Node)) {
          return; // Don't close if clicking the chat button
        }
        // Check if the click is on a modal
        const modal = document.querySelector('.fixed.inset-0.z-50');
        if (modal && modal.contains(event.target as Node)) {
          return; // Don't close if clicking on a modal
        }
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userText,
      sender: MessageSender.User,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await chatSession.sendMessageStream({ 
        message: userText,
        sessionId: sessionId 
      });
      
      // Create placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          text: '',
          sender: MessageSender.AI,
          timestamp: new Date()
        }
      ]);

      let fullText = '';
      let messageImages: string[] = [];
      
      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        
        // Handle images if present
        if (chunk.images && chunk.images.length > 0) {
          messageImages = [...messageImages, ...chunk.images];
        }
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: fullText, images: messageImages.length > 0 ? messageImages : undefined } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "I'm sorry, I encountered an error connecting to my brain. Please try again.",
          sender: MessageSender.AI,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, chatSession, isLoading, sessionId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    // Show toasty animation and play sound
    setShowToasty(true);
    if (toastyAudioRef.current) {
      toastyAudioRef.current.volume = 0.3; // Reduced volume for toasty sound
      toastyAudioRef.current.play().catch(err => console.error("Error playing toasty sound:", err));
    }
    
    // Hide toasty after animation
    setTimeout(() => {
      setShowToasty(false);
    }, 2000);
    
    // Generate a NEW session ID for the new conversation
    // This ensures the backend creates a fresh session with the latest system prompt
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // Reset messages to just the initial greeting
    setMessages([
      {
        id: 'init',
        text: INITIAL_CHAT_MESSAGE,
        sender: MessageSender.AI,
        timestamp: new Date()
      }
    ]);
  };

  // Handle button click to send predefined prompt
  const handleButtonClick = useCallback(async (prompt: string) => {
    if (!chatSession || isLoading) return;
    
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: prompt,
      sender: MessageSender.User,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await chatSession.sendMessageStream({ 
        message: prompt,
        sessionId: sessionId 
      });
      
      // Create placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          text: '',
          sender: MessageSender.AI,
          timestamp: new Date()
        }
      ]);

      let fullText = '';
      let messageImages: string[] = [];
      
      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        
        // Handle images if present
        if (chunk.images && chunk.images.length > 0) {
          messageImages = [...messageImages, ...chunk.images];
        }
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: fullText, images: messageImages.length > 0 ? messageImages : undefined } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "I'm sorry, I encountered an error connecting to my brain. Please try again.",
          sender: MessageSender.AI,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [chatSession, isLoading, sessionId]);

  // Classes for responsiveness - dynamic width that adapts to viewport
  const containerClasses = isMobile
    ? `fixed inset-0 z-50 bg-slate-900 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`
    : `fixed right-6 bottom-6 w-[min(90vw,1200px)] max-w-[calc(100vw-3rem)] h-[700px] bg-slate-800/90 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`;

  return (
    <>
      {/* Toasty animation overlay */}
      {showToasty && (
        <div 
          className="fixed bottom-6 right-6 z-[60]"
          style={{
            animation: 'slideInRight 0.5s ease-out'
          }}
        >
          <img 
            src="/toasty/toasty.png" 
            alt="Toasty!" 
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
        </div>
      )}
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(200px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div ref={chatContainerRef} className={containerClasses}>
        {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <AvatarPhoto size="md" variant="header" />
          <div>
            <h3 className="font-semibold text-slate-100">Virtual Panos</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearChat}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-red-400"
            title="New chat (starts fresh conversation with new session)"
            disabled={isLoading}
          >
            <Eraser size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            title="Minimize chat"
          >
            <Minimize2 size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.filter(msg => msg.text.trim() !== '').map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === MessageSender.AI && (
              <div className="mt-1">
                <AvatarPhoto size="md" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed prose prose-invert prose-sm max-w-none ${
                msg.sender === MessageSender.User
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-700/50 text-slate-200 rounded-bl-none border border-slate-600/50'
              }`}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-slate-800/50 px-1.5 py-0.5 rounded text-indigo-300 text-xs font-mono">{children}</code>
                    ) : (
                      <code className="block bg-slate-900 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2">{children}</code>
                    );
                  },
                  pre: ({ children }) => <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2">{children}</pre>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 pl-3 italic my-2">{children}</blockquote>,
                  a: ({ href, children }) => <a href={href} className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
              {/* Display images if available */}
              {msg.images && msg.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.images.map((imageFilename, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-slate-600/50">
                      <img
                        src={`${API_URL}/kb/images/${imageFilename}`}
                        alt={`Graph from project documentation`}
                        className="w-full h-auto max-w-full object-contain"
                        onError={(e) => {
                          console.error(`Failed to load image: ${imageFilename}`);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === MessageSender.User && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-slate-400" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
             <div className="mt-1">
                <AvatarPhoto size="md" />
              </div>
              <div className="bg-slate-700/50 p-3 rounded-2xl rounded-bl-none flex items-center gap-1 h-10 border border-slate-600/50">
                <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Question Buttons */}
      <div className="px-4 pt-3 pb-2 border-t border-slate-700 bg-slate-800/50">
        <div className="flex flex-col gap-2">
          {/* ML Projects Button */}
          <div>
            <button
              onClick={() => setExpandedCategory(expandedCategory === 'ml' ? null : 'ml')}
              disabled={isLoading}
              className="w-full px-3 py-2 text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <span>ML Projects</span>
              <span className="text-indigo-400">{expandedCategory === 'ml' ? '▼' : '▶'}</span>
            </button>
            {expandedCategory === 'ml' && (
              <div className="mt-2 ml-4 space-y-1">
                {mlProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setExpandedCategory(null);
                      handleButtonClick(project.prompt);
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-200 rounded-md border border-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data Science Projects Button */}
          <div>
            <button
              onClick={() => setExpandedCategory(expandedCategory === 'ds' ? null : 'ds')}
              disabled={isLoading}
              className="w-full px-3 py-2 text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <span>Data Science Projects</span>
              <span className="text-emerald-400">{expandedCategory === 'ds' ? '▼' : '▶'}</span>
            </button>
            {expandedCategory === 'ds' && (
              <div className="mt-2 ml-4 space-y-1">
                {dataScienceProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setExpandedCategory(null);
                      handleButtonClick(project.prompt);
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-200 rounded-md border border-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Projects Button */}
          <div>
            <button
              onClick={() => setExpandedCategory(expandedCategory === 'ai' ? null : 'ai')}
              disabled={isLoading}
              className="w-full px-3 py-2 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <span>AI Projects</span>
              <span className="text-purple-400">{expandedCategory === 'ai' ? '▼' : '▶'}</span>
            </button>
            {expandedCategory === 'ai' && (
              <div className="mt-2 ml-4 space-y-1">
                {aiProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setExpandedCategory(null);
                      handleButtonClick(project.prompt);
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium bg-purple-600/10 hover:bg-purple-600/20 text-purple-200 rounded-md border border-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about Panos..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-full text-white transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default ChatInterface;