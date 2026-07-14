import React from "react";
import PDFViewer from "../components/PDFViewer";
import ChatInput from "../components/ChatInput";
import Dashboard from "../components/Dashboard";

function Home() {
  return (
    <div>
      {/*  <PDFViewer /> */}

      <Dashboard />

      <div>
        <ChatInput />
      </div>
    </div>
  );
}

export default Home;
