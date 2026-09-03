"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Who is Emmanuel Ajibade?",
  "What projects has he built?",
  "What technologies does he use?",
  "How can I contact Emmanuel?",
];

// Simple markdown-ish renderer (bold, italic, code, links, line breaks)
function formatContent(text: string) {
  const lines = text.split("\n");

  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;

    let content = line;

    // Bold
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Inline code
    content = content.replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 rounded text-sm">$1</code>');

    return (
      <div
        key={i}
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  });
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      } else {
        toast.error(data.error || "Failed to get response");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-colors hover:bg-orange-600 sm:right-5"
        aria-label="Ask about Emmanuel"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-chat-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-50/95 shadow-2xl backdrop-blur-xl sm:inset-auto sm:bottom-20 sm:right-5 sm:h-auto sm:max-h-[min(70vh,42rem)] sm:w-80 sm:max-w-[calc(100vw-2.5rem)] sm:rounded-2xl sm:bg-transparent"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:py-3 sm:pt-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  E
                </div>
                <div>
                  <h3 id="ai-chat-title" className="text-sm font-semibold text-slate-900">Ask about Emmanuel</h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear conversation"
                    title="Clear conversation"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3m-9 0h12" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Close chat"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 sm:py-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="h-12 w-12 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">
                    Ask me anything about Emmanuel!
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    I know about his projects, skills, and background.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white/70 text-slate-800 rounded-bl-sm border border-slate-200/60"
                    }`}
                  >
                    {formatContent(msg.content)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/70 border border-slate-200/60 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-slate-500 flex items-center gap-2">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} aria-live="polite" />
            </div>

            {/* Suggestions - ONLY show when there are zero messages */}
            {messages.length === 0 && (
              <div className="flex shrink-0 gap-2 overflow-x-auto px-3 pb-3 pt-1 sm:flex-wrap sm:overflow-visible">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="min-h-10 shrink-0 rounded-full border border-slate-200 bg-white/80 px-3 text-xs transition-colors hover:border-orange-300 hover:bg-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="shrink-0 border-t border-slate-200/60 bg-white/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Emmanuel..."
                  enterKeyHint="send"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base outline-none focus:ring-2 focus:ring-orange-500 sm:py-2 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="min-h-11 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}