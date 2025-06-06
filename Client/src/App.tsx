// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { setUser, clearUser } from "./store/slices/googleUserSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. On app load, check authentication
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include", // send HTTP-Only cookie
        });
        if (!res.ok) throw new Error("Not authenticated");
        const userInfo = await res.json();
        dispatch(setUser(userInfo));
      } catch (error) {
        dispatch(clearUser());
      }
    })();
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
