import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./routes/LoginPage.jsx";
import "./styles/main.css";
import UploadPage from "./routes/UploadPage";
// import ResultsPage from "./routes/ResultsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        {/* <Route path="/results" element={<ResultsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
