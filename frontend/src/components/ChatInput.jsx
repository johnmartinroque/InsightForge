import React, { useState, useRef, useEffect } from "react";

function ChatInput() {
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]); // { role: 'user' | 'agent' | 'error', content: string }
  const [isSending, setIsSending] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Enter your email before sending." },
      ]);
      return;
    }

    if (!text.trim()) {
      return;
    }

    const outgoing = text.trim();
    setMessages((prev) => [...prev, { role: "user", content: outgoing }]);
    setText("");
    setIsSending(true);
    setEmailLocked(true);

    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), text: outgoing }),
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { reply: raw };
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      const replyText =
        data.reply ?? data.output ?? "The agent responded with no content.";

      setMessages((prev) => [...prev, { role: "agent", content: replyText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: error.message || "Something went wrong." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-[600px] w-full max-w-xl mx-auto flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-2 border-b border-slate-200 bg-slate-900 px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        <h1 className="text-sm font-semibold tracking-wide text-white">
          Data Analysis Assistant
        </h1>
      </header>

      <div className="border-b border-slate-200 px-4 py-2">
        <input
          type="email"
          value={email}
          disabled={emailLocked}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            Ask a question about the product data to get started.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-slate-900 text-white"
                  : message.role === "error"
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-slate-200 px-3 py-3"
      >
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask about the product data..."
          className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
