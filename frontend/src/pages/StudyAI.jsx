import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, StopCircle, Sparkles, MessageSquare } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import Button from '../components/ui/Button';
import { getGeminiResponse } from '../lib/gemini';

const StudyAI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('study_ai_history');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        } else {
            // Initial greeting
            setMessages([{
                id: 'init',
                role: 'model',
                text: "Hi! I'm your StudySync AI assistant. I can help you summarize notes, explain complex topics, or generate practice questions. What are you studying today?"
            }]);
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('study_ai_history', JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Format history for Gemini API
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const responseText = await getGeminiResponse(userMsg.text, history);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'model',
                text: responseText
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'model',
                text: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear your chat history?")) {
            setMessages([{
                id: Date.now(),
                role: 'model',
                text: "Chat history cleared. How can I help you now?"
            }]);
            localStorage.removeItem('study_ai_history');
        }
    };

    return (
        <PageLayout
            title="Study AI"
            subtitle="Your Personal Tutor"
            action={
                <Button variant="outline" onClick={clearHistory} className="h-9 px-3 text-xs border-white/10 hover:bg-white/5 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear Chat
                </Button>
            }
        >
            <div className="h-[calc(100vh-220px)] flex flex-col bg-[#121217] border border-white/10 rounded-2xl overflow-hidden relative">

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary/10 text-white border border-primary/20 rounded-tr-sm'
                                        : 'bg-white/5 text-zinc-300 border border-white/10 rounded-tl-sm'
                                    }`}>
                                    <div className="whitespace-pre-wrap font-sans">
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-[#121217]/50 backdrop-blur-sm">
                    <form onSubmit={handleSend} className="relative flex gap-3 max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about your studies..."
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={`h-auto aspect-square rounded-xl flex items-center justify-center p-0 w-12 transition-all ${!input.trim() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                }`}
                        >
                            {loading ? <StopCircle className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </form>
                    <p className="text-center text-[10px] text-zinc-600 mt-2 font-mono">
                        Powered by Gemini AI. Responses may vary.
                    </p>
                </div>
            </div>
        </PageLayout>
    );
};

export default StudyAI;
