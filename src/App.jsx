import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginSignupForm from "./components/LoginSignupForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import Dashboard from "./components/Dashboard.jsx";
import MoodTracker from "./components/MoodTracker";
import JournalEntry from "./components/JournalEntry";
import Settings from "./components/Settings";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  //user auth logic goes here
  let user = false;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };
  if (user) {
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
              </div>
            </nav>
          </header>
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/journal" element={<JournalEntry />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginSignupForm />
      </div>
    );
  }
}
