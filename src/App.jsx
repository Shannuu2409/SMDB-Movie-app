import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./Index";
import MoviesPage from "./pages/MoviesPage";
import TVSeriesPage from "./pages/TVSeriesPage";
import AnimePage from "./pages/AnimePage";
import { ProfilePage } from "./components/ProfilePage";
import { AuthProvider } from "./contexts/AuthContext";

// A new component to handle reading the URL query
const IndexWithSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  return <Index searchQuery={searchQuery} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Use the new component for the root path */}
            <Route path="/" element={<IndexWithSearch />} />
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