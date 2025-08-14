import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./Index";
import { MoviesPage } from "./pages/MoviesPage";
import { TVSeriesPage } from "./pages/TVSeriesPage";
import { AnimePage } from "./pages/AnimePage";
import { ProfilePage } from "./components/ProfilePage";
import { AuthProvider } from "./contexts/AuthContext";
import BackendTest from "./components/BackendTest";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <BackendTest />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv-series" element={<TVSeriesPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
