import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Map, BarChart3, Menu, X, Route } from 'lucide-react';
import { useState } from 'react';
import classNames from 'classnames';

const Layout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/persone', label: 'Persone', icon: <Users size={20} /> },
    { path: '/tragitti', label: 'Tragitti', icon: <Map size={20} /> },
    { path: '/percorsi', label: 'Percorsi', icon: <Route size={20} /> },
    { path: '/report', label: 'Report', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xl">ITFV</span>
            <span className="hidden md:inline-block text-xl">Rimborsi Chilometrici</span>
          </div>
          <button 
            className="md:hidden p-2" 
            onClick={toggleMenu}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  "flex items-center space-x-1 py-2 px-3 rounded-md transition-colors",
                  {
                    "bg-teal-600 text-white": isActive(item.path),
                    "hover:bg-teal-600/60": !isActive(item.path)
                  }
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-14 right-0 left-0 z-50 transition-all">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  "flex items-center space-x-3 py-3 px-4 rounded-md transition-colors",
                  {
                    "bg-teal-100 text-teal-800": isActive(item.path),
                    "hover:bg-gray-100": !isActive(item.path)
                  }
                )}
                onClick={closeMenu}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Istituto Veneto di Terapia Familiare</p>
          <p className="mt-1">Via della Quercia 2/B, Treviso</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;