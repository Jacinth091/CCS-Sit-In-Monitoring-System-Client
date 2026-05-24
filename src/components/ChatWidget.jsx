import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import aiService from '../services/ai.service';
import { MessageSquare, X, Send, Plus, Sparkles, RefreshCcw } from 'lucide-react';
import './ChatWidget.css';

/**
 * ### 4. Chat Widget UI/UX Modernization
 * - **Enlarged Panel Sizing**: Enlarged the panel dimensions in ChatWidget.css 
 *   from 360px x 480px to a generous 480px x 600px, allowing long paragraphs 
 *   and structured lists to be fully visible.
 * - **Improved Typography & Readability**: Increased chat bubble font size to 13px 
 *   with a highly legible line-height of 1.6.
 * - **Dynamic List Parser**: Refactored renderMessageContent in ChatWidget.jsx 
 *   to dynamically detect lines starting with bullets (* or -) and format 
 *   them into native HTML <ul> and <li> lists.
 */

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState(null);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const fetchQuota = async () => {
    try {
      const res = await aiService.getQuotaStatus();
      if (res.status === 'success' && res.data?.chat) {
        setQuota(res.data.chat);
        if (res.data.chat.cooldown_remaining > 0) {
          setCooldownTimer(res.data.chat.cooldown_remaining);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch quota status:", err);
    }
  };

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldownTimer > 0) {
      const timer = setTimeout(() => setCooldownTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTimer]);

  useEffect(() => {
    if (isOpen && user) {
      fetchQuota();
    }
  }, [isOpen, user]);

  const messagesEndRef = useRef(null);

  // Initialize conversations
  const initChat = () => {
    if (user) {
      const name = user.role === 'admin' 
        ? (user.username || 'Admin') 
        : (user.first_name || 'Student');

      setMessages([
        {
          role: 'assistant',
          content: `Hello, ${name}! Welcome to the CCS Sit-In System. 🤖\n\nI am your AI Assistant. How can I help you today? You can ask me about lab rules, your session history, available computer software, or reservation instructions.`
        }
      ]);
    }
  };

  useEffect(() => {
    initChat();
  }, [user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!user) return null; // Only render when logged in

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Send message history (max 10 recent messages) to server
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await aiService.sendChatMessage(chatHistory);

      if (res.status === 'success' && res.data?.reply) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.data.reply
        }]);
        fetchQuota();
      } else {
        throw new Error(res.message || 'Failed to retrieve response.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Connection issue. Could not reach the AI Assistant.';
      
      // If backend sends a specific cooldown, apply it immediately
      if (err.response?.data?.retry_after_seconds) {
        setCooldownTimer(err.response.data.retry_after_seconds);
      }

      setError(msg);
      fetchQuota();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    initChat();
    setError('');
  };

  // Helper to render bold strings and bulleted/numbered lists dynamically
  const renderMessageContent = (text) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    const renderedElements = [];
    let currentList = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');

      if (isBullet) {
        // Strip bullet prefix
        const content = trimmed.substring(2);
        const parts = content.split('**');
        currentList.push(
          <li key={idx} className="chat-list-item">
            {parts.map((part, pIdx) => 
              pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
            )}
          </li>
        );
      } else {
        // Render pending list if any before processing paragraph
        if (currentList.length > 0) {
          renderedElements.push(
            <ul key={`list-${idx}`} className="chat-list">
              {currentList}
            </ul>
          );
          currentList = [];
        }

        if (trimmed) {
          const parts = line.split('**');
          renderedElements.push(
            <p key={idx} className="chat-text-line">
              {parts.map((part, pIdx) => 
                pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
              )}
            </p>
          );
        } else {
          renderedElements.push(<div key={idx} className="chat-spacer" />);
        }
      }
    });

    // Push remaining list if any
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key="list-final" className="chat-list">
          {currentList}
        </ul>
      );
    }

    return renderedElements;
  };

  return (
    <div className="chat-widget-wrapper">
      {/* ───── FLOATING COLLAPSED BUTTON ───── */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-widget-trigger ${isOpen ? 'active' : ''}`}
        title="CCS AI Assistant"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        {!isOpen && <span className="chat-widget-badge-pulse" />}
      </button>

      {/* ───── EXPANDED PANEL ───── */}
      {isOpen && (
        <div className="chat-widget-panel">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-title-area">
              <div className="chat-widget-avatar">
                <Sparkles className="h-4 w-4 text-brand-sand animate-pulse" />
              </div>
              <div>
                <h4>CCS AI Assistant</h4>
                <div className="chat-status-indicator">
                  <span className="status-dot" />
                  <span>Interactive System Guide</span>
                  {quota && (
                    <span style={{ color: '#EAD8B1', marginLeft: '6px', fontWeight: 'bold' }}>
                      ({quota.remaining}/{quota.quota} left)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="chat-widget-actions">
              <button 
                onClick={handleClear} 
                className="chat-action-btn-new" 
                title="New Conversation"
              >
                <Plus className="h-3 w-3" />
                <span>New Chat</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="chat-action-btn-close" 
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-widget-messages">
            {messages.length > 1 && (
              <div className="chat-new-convo-top-container">
                <button onClick={handleClear} className="chat-new-convo-top-btn">
                  <RefreshCcw className="h-3 w-3" />
                  <span>Start New Conversation</span>
                </button>
              </div>
            )}
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`chat-bubble-container ${m.role === 'user' ? 'user-align' : 'assistant-align'}`}
              >
                <div className={`chat-bubble ${m.role === 'user' ? 'user-style' : 'assistant-style'}`}>
                  {renderMessageContent(m.content)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble-container assistant-align">
                <div className="chat-bubble assistant-style flex items-center gap-1.5 py-3">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {error && (
              <div className="chat-bubble-container system-error-align">
                <div className="chat-error-message">
                  {error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="chat-widget-footer">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={cooldownTimer > 0 ? `Wait ${cooldownTimer}s...` : "Ask me something about the lab..."}
              disabled={isLoading || cooldownTimer > 0}
              maxLength={200}
              className={`chat-widget-input ${cooldownTimer > 0 ? 'on-cooldown' : ''}`}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || cooldownTimer > 0}
              className="chat-widget-submit"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
