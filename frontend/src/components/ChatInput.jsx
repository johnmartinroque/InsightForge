import React, { useState } from "react";

function ChatInput() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setStatus("Please enter your email before sending.");
      return;
    }

    if (!text.trim()) {
      setStatus("Please enter a message before sending.");
      return;
    }

    setIsSending(true);
    setStatus("");

    try {
      const response = await fetch(
        "http://localhost:5678/webhook/d53e3c7a-9be7-4851-9cc0-75f95ddcf47d",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            text: text.trim(),
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      setStatus("Message sent successfully.");
      setText("");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus(`Send failed: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="chat-email"
        >
          Your email
        </label>
        <input
          id="chat-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="chat-input"
        >
          Message
        </label>
        <div className="flex gap-2">
          <input
            id="chat-input"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your message here"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={isSending}
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}

export default ChatInput;
