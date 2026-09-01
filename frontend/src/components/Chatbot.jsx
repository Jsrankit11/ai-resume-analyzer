import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Trash2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import { useResume } from '../context/ResumeContext';

const INITIAL_SUGGESTIONS = [
  'How can I improve my resume?',
  'What skills am I missing?',
  'Is my resume ATS friendly?',
  'Which job role is best for me?',
  'Improve my project description',
  'Give me interview questions',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your JSR AI Career Coach. Ask me how to optimize your resume, bypass ATS scanners, or prepare for technical interviews!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

  const messagesEndRef = useRef(null);
  const { currentAnalysis } = useResume();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: textToSend,
        history: messages.slice(-6),
        resumeData: currentAnalysis,
      });

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Sorry, I encountered an issue processing your question. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Chat history cleared. How can I help you improve your resume today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setSuggestions(INITIAL_SUGGESTIONS);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-xl shadow-[#ff5656]/30 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Open JSR Coach"
          >
            <div className="w-6 h-6 rounded-full bg-white text-[#ff5656] flex items-center justify-center font-bold text-[10px]">
              JSR
            </div>
            <span className="font-bold text-sm font-heading hidden sm:inline">
              JSR Coach
            </span>
          </button>
        </div>
      )}

      {/* Floating Drawer / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] max-h-[85vh] sm:max-h-[600px] h-[550px] flex flex-col bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-slate-900/15 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ff5656] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                JSR
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  JSR Resume Coach
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  {currentAnalysis?.candidate?.name
                    ? `Context: ${currentAnalysis.candidate.name}'s Resume`
                    : 'AI Career & ATS Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#ff5656] text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-1">
                    JSR
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#ff5656] text-white rounded-tr-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      msg.sender === 'user' ? 'text-coral-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#ff5656] text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-1">
                  JSR
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5656] animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#ff5656] animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#ff5656] animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                disabled={loading}
                className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-coral-50 hover:text-[#ff5656] border border-slate-200 transition-colors disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask JSR Coach anything..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5656] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#ff5656] text-white hover:bg-[#ff4242] disabled:opacity-40 transition-all shadow-md shadow-[#ff5656]/20"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
