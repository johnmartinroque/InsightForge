import React, { useState } from "react";
import ChatInput from "./ChatInput";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 flex items-end justify-end pr-24 transition-all duration-150 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/20 transition-opacity duration-150 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative m-6 w-[min(calc(100vw-3rem),1600px)] max-w-[1600px] h-[920px] transition-all duration-150 ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          <ChatInput />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl ring-2 ring-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </>
  );
}

export default ChatWidget;
