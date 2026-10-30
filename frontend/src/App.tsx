import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { POSPage } from "./pages/POSPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <POSPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
