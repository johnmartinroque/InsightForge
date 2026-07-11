import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
function App() {
  return (
    <div className="text-center">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
