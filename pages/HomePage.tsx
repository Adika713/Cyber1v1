
import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { games } = useGame();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-widest text-cyber-primary">
          Válaszd ki az arénádat
        </h1>
        <p className="mt-4 text-lg text-cyber-text-dim max-w-2xl mx-auto">
          Válassz egy játékot a rendelkezésre álló szobák megtekintéséhez, vagy hozz létre sajátot. Hívd ki az ellenfeleket és bizonyítsd rátermettséged.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map(game => (
          <Link 
            to={`/lobby/${game.id}`} 
            key={game.id} 
            className="group bg-cyber-surface border-2 border-cyber-border p-6 flex flex-col hover:border-cyber-primary hover:scale-105 transition-all duration-300"
          >
            <div className="h-40 mb-4 overflow-hidden">
                <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h2 className="font-orbitron text-2xl font-bold text-cyber-primary uppercase">{game.name}</h2>
            <p className="text-cyber-text-dim flex-grow mt-2 mb-4">{game.description}</p>
            <div className="flex items-center justify-end text-cyber-accent font-bold group-hover:text-cyber-primary transition-colors">
              <span>Szobák megtekintése</span>
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
