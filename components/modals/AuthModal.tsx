
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CyberButton from '../ui/CyberButton';
import CyberInput from '../ui/CyberInput';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-cyber-surface border-2 border-cyber-border w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-cyber-text-dim hover:text-cyber-primary">
          <X size={24} />
        </button>
        <div className="flex border-b-2 border-cyber-border mb-4">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 font-orbitron uppercase tracking-widest ${isLogin ? 'text-cyber-primary border-b-2 border-cyber-primary' : 'text-cyber-text-dim'}`}>
            Bejelentkezés
          </button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 font-orbitron uppercase tracking-widest ${!isLogin ? 'text-cyber-primary border-b-2 border-cyber-primary' : 'text-cyber-text-dim'}`}>
            Regisztráció
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CyberInput
            label="Felhasználónév"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <CyberInput
            label="Jelszó"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <CyberButton type="submit" variant="primary" className="w-full">
            {isLogin ? 'Belépés' : 'Regisztráció'}
          </CyberButton>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
