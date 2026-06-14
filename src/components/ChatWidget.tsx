import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, MessageSquare, Trash2, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Message } from "../types";
import { SUGGESTED_QUESTIONS } from "../data/faq";

// Imported generated cozy-fantasy Lumo sprout avatar
// @ts-ignore
import lumoAvatar from "../assets/images/lumo_avatar_1781429929270.jpg";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("memzi_chat_log");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chat logs", e);
      }
    }
    // Default welcome message
    return [
      {
        id: "welcome",
        sender: "bot",
        text: "Hi! I’m Lumo’s helper 🌱 I can answer help desk questions about Memzi Living World, HSK lessons, Book World, World Map, pricing, and app support. Ask me anything!",
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest chat bubble on new message or typing state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Persist chat logs to client localStorage
  useEffect(() => {
    localStorage.setItem("memzi_chat_log", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || loading) return;

    setErrorMessage(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: cleanText,
      timestamp: new Date().toISOString(),
    };

    // Update state synchronously for snappy UI
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg], // Pass entire history to the backend context
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        if (!response.ok) {
          throw new Error(`Server error (${response.status}): This can happen if the backend server is reloading or if there is a temporary connection issue. Please try again soon.`);
        } else {
          throw new Error("Received an unexpected data format from the server.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "The server returned an unexpected error.");
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat communication failure:", err);
      setErrorMessage(err.message || "Could not reach the AI. Please verify your server settings.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Would you like to clear your conversation with Lumo?")) {
      const defaultState: Message[] = [
        {
          id: "welcome",
          sender: "bot",
          text: "Hi! I’m Lumo’s helper 🌱 I can answer help desk questions about Memzi Living World, HSK lessons, Book World, World Map, pricing, and app support. Ask me anything!",
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(defaultState);
      setErrorMessage(null);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="lumo-chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[90vw] sm:w-[400px] h-[550px] bg-[#faf7f2] rounded-3xl border border-memzi-teal/20 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* WIDGET HEADER */}
            <div className="bg-gradient-to-r from-memzi-teal to-memzi-forest text-white p-4 flex items-center justify-between border-b border-memzi-cream-dark/10">
              <div className="flex items-center gap-3">
                <img
                  src={lumoAvatar}
                  alt="Lumo"
                  className="w-10 h-10 rounded-full object-cover border border-[#4ADE80] shrink-0 shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white font-display">Ask Lumo</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-medium text-memzi-sprout/90 font-mono tracking-wider">Lumo's Helper • 🌱 Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    id="clear-chat-btn"
                    onClick={clearChat}
                    title="Clear Conversation"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  id="close-chat-btn"
                  onClick={() => setIsOpen(false)}
                  title="Minimize Chat"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MESSAGE HUB */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-memzi-cream/40">
              {messages.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}
                  >
                    {!isUser && (
                      <img
                        src={lumoAvatar}
                        alt="Lumo"
                        className="w-7 h-7 rounded-full object-cover border border-[#4ADE80]/40 shrink-0 select-none shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? "bg-memzi-teal text-white rounded-br-none shadow-md"
                          : "bg-white text-memzi-forest border border-memzi-cream-dark shadow-sm rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1.5 ${
                          isUser ? "text-white/60" : "text-memzi-teal/40"
                        } font-mono`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* LOADING ANSWER STATE */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <img
                    src={lumoAvatar}
                    alt="Lumo Loading"
                    className="w-7 h-7 rounded-full object-cover border border-[#4ADE80]/30 shrink-0 select-none animate-spin"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-white border text-memzi-teal/70 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 shadow-sm font-mono tracking-wide">
                    <RefreshCw size={12} className="animate-spin text-memzi-green" />
                    <span>Consulting Chinese scrolls... 📜</span>
                  </div>
                </motion.div>
              )}

              {/* ERROR STATE CONTAINER */}
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex gap-2.5 items-start">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                  <div className="text-xs space-y-1.5">
                    <p className="font-semibold">Helper Distressed</p>
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* SUGGESTION CHIPS BOX (Only shown if no user message yet or to help user) */}
            <div className="px-4 pt-2.5 pb-1 border-t border-memzi-cream-dark/50 bg-white shadow-xs">
              <div className="flex items-center gap-1 mb-2">
                <HelpCircle size={12} className="text-memzi-forest/60" />
                <span className="text-[10px] font-bold text-memzi-forest/60 font-display">Suggested Questions:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x shrink-0">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    id={`faq-chip-${question.replace(/[^a-zA-Z0-9]/g, "")}`}
                    onClick={() => handleSendMessage(question)}
                    className="bg-memzi-cream hover:bg-memzi-cream-dark transition-all border border-memzi-cream-dark/80 rounded-full px-3.5 py-1 text-xs text-memzi-forest/90 font-medium whitespace-nowrap snap-center shrink-0 cursor-pointer hover:scale-[1.01]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* CHAT INPUT AREA */}
            <div className="p-3 bg-white border-t border-memzi-cream-dark">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  id="chat-input-field"
                  value={inputValue}
                  disabled={loading}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about Memzi..."
                  className="flex-1 bg-memzi-cream px-4 py-2.5 rounded-xl text-sm border border-memzi-cream-dark focus:outline-none focus:ring-2 focus:ring-memzi-green/50 focus:border-memzi-green text-memzi-forest"
                />
                <button
                  type="submit"
                  id="submit-chat-msg-btn"
                  disabled={!inputValue.trim() || loading}
                  className="p-2.5 rounded-xl bg-memzi-green hover:bg-memzi-forest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOAT BUTTON CONSOLE */}
      <motion.button
        id="toggle-lumo-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-r from-memzi-green to-memzi-green-light hover:from-memzi-teal hover:to-memzi-green text-white font-bold py-3.5 px-6 rounded-full shadow-2xl transition-all cursor-pointer relative lg:right-0"
      >
        <span className="text-xl leading-none">🌱</span>
        <span className="font-display text-sm tracking-wide">Ask Lumo</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3 select-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </motion.button>
    </div>
  );
}
