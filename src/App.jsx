import { useState } from 'react';
import Index from './Index.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import TVSeriesPage from './pages/TVSeriesPage.jsx';
import AnimePage from './pages/AnimePage.jsx';
import { ProfilePage } from './components/ProfilePage.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSearchQuery(''); // Clear search when navigating
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setCurrentPage('search'); // Show search results
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'movies':
        return <MoviesPage />;
      case 'tv':
        return <TVSeriesPage />;
      case 'anime':
        return <AnimePage />;
      case 'profile':
        return <ProfilePage />;
      case 'search':
        return <Index searchQuery={searchQuery} />;
      default:
        return <Index />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <Navbar 
          onSearch={handleSearch} 
          onNavigate={handleNavigation}
        />
        {renderPage()}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
