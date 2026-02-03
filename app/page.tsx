"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.reply) {
        const cleanReply = data.reply.replace(/^==/, '');
        setMessages((prev) => [...prev, { role: "assistant", content: cleanReply }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-white text-sm md:text-base">
      {/* Header - ปรับเป็นโทนสีฟ้า */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <h1 className="font-semibold text-gray-700">NONAME! WEB-CHAT</h1>
        </div>
      </header>

      
      {/* Chat Area  */}
      <div className="flex-1 overflow-y-auto p-4 md:px-20 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* 1. ไอคอน */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              msg.role === "user" ? "bg-pink-200" : "bg-blue-200 animate-bounce-slow"
            }`}>
              {msg.role === "user" 
                ? <User className="w-5 h-5 text-pink-600" /> 
                : <Bot className="w-5 h-5 text-blue-600" /> /* ไอคอน Bot ในวงกลมฟ้าดูน่ารักขึ้น */}
            </div>

            {/* 2. บับเบิลข้อความ */}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-pink-100 text-pink-800 rounded-br-none" // ฝั่งขวาสีชมพู
                  : "bg-blue-50 text-blue-800 border border-blue-100 rounded-bl-none" // ฝั่งซ้ายสีฟ้า
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 ml-10">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:pb-8 flex justify-center">
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 w-full max-w-md shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700"
          />
          {/* ปรับปุ่ม Send */}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 active:scale-90 disabled:bg-gray-200 transition-all shadow-md shadow-pink-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}