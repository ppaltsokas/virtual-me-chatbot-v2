import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Sparkles, X, Trash2 } from 'lucide-react';
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toastyAudioRef = useRef<HTMLAudioElement | null>(null);

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
      const result = await chatSession.sendMessageStream({ message: userText });
      
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
  }, [input, chatSession, isLoading]);

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
      const result = await chatSession.sendMessageStream({ message: prompt });
      
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
  }, [chatSession, isLoading]);

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
      
      <div className={containerClasses}>
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
            title="Clear chat"
            disabled={isLoading}
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            title="Close chat"
          >
            <X size={20} />
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleButtonClick("Pick one of your machine learning projects and walk me through it end-to-end like I'm a hiring manager. Include photos from the project and Panos' markdown cells with his insights. You can use technical terms.")}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ML Project
          </button>
          <button
            onClick={() => handleButtonClick("Pick one of your Data Science projects and walk me through it end-to-end like I'm a hiring manager. Include photos from the project and Panos' markdown cells with his insights. You can use technical terms.")}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Data Science Project
          </button>
          <button
            onClick={() => handleButtonClick("Talk to me in full detail about a project where you built or evaluated an AI agent. Explain the tools, architecture, and what you learned.")}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg border border-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            AI Projects
          </button>
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