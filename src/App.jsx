import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginSignupForm from "./components/LoginSignupForm";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import Dashboard from "./components/Dashboard.jsx";
import MoodTracker from "./components/MoodTracker";
import JournalEntry from "./components/JournalEntry";
import Settings from "./components/Settings";
import { getUserData } from "./api/api";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchUserData(storedUserId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await getUserData(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("userId");
    }
  };

  const handleLoginSuccess = (userId) => {
    localStorage.setItem("userId", userId);
    fetchUserData(userId);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginSignupForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <header className="bg-primary text-primary-foreground p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Mental Health Tracker</h1>
            <div className="flex space-x-4">
              <Link to="/" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/mood" className="hover:underline">
                Mood Tracker
              </Link>
              <Link to="/journal" className="hover:underline">
                Journal
              </Link>
              <Link to="/settings" className="hover:underline">
                Settings
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/journal" element={<JournalEntry />} />
            <Route path="/settings" element={<Settings user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
