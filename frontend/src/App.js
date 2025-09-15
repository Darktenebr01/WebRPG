import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import GameDashboard from "./components/GameDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { StaminaProvider } from "./contexts/StaminaContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="*" element={<LoginPage />} />
        ) : (
          <>
            <Route path="/" element={<GameDashboard />} />
            <Route path="/dashboard" element={<GameDashboard />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <StaminaProvider>
          <AppContent />
        </StaminaProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
