
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import AuthModal from './modals/AuthModal';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(Math.floor(Math.random() * 200) + 50);
  const { user, logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        const newCount = prev + change;
        return newCount > 20 ? newCount : 20;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-bg font-sans flex flex-col">
      <header className="bg-cyber-surface/80 backdrop-blur-sm border-b-2 border-cyber-border sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-orbitron text-2xl font-bold text-cyber-primary tracking-widest uppercase">
                CyberMatch
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-cyber-accent">
                <Users size={20} />
                <span className="font-bold">{onlinePlayers}</span>
                <span className="hidden sm:inline">Online</span>
              </div>
              <div className="h-8 w-px bg-cyber-border"></div>
              {user ? (
                <div className="flex items-center space-x-3">
                   <div className="flex items-center gap-2 text-cyber-text">
                    <UserIcon size={20} className="text-cyber-primary"/>
                    <span className="font-semibold">{user.username}</span>
                  </div>
                  <button onClick={logout} className="p-2 rounded-md hover:bg-cyber-border transition-colors">
                    <LogOut size={20} className="text-cyber-secondary" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setAuthModalOpen(true)} className="flex items-center space-x-2 px-3 py-2 bg-cyber-primary/10 border border-cyber-primary text-cyber-primary rounded-md hover:bg-cyber-primary/20 transition-colors font-semibold">
                  <LogIn size={18} />
                  <span>Bejelentkezés / Regisztráció</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Layout;
