import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./routes/LoginPage";
import UploadPage from "./routes/UploadPage";
import ResultsPage from "./routes/ResultsPage";
import { isAdmin } from "./services/authService";
import "./styles/main.css";

/**
 * ProtectedRoute — redirige a /login si el usuario no es admin.
 */
function ProtectedRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * App — componente raíz con las rutas de la aplicación.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
