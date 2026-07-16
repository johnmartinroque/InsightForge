import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import LandingScreen from "./screens/LandingScreen";
import Header from "./components/Header";
import ChatWidget from "./components/ChatWidget";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    try {
      return Boolean(localStorage.getItem("userInfo"));
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const syncAuth = () => {
      try {
        setIsAuthenticated(Boolean(localStorage.getItem("userInfo")));
      } catch {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="text-center">
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/landing" element={<LandingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      <ChatWidget />
    </div>
  );
}

export default App;
