
import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

const CyberButton: React.FC<CyberButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseClasses = "px-6 py-2 font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base";
  
  const variantClasses = {
    primary: 'bg-cyber-primary text-cyber-bg hover:shadow-cyber-glow-primary focus:ring-cyber-primary',
    secondary: 'bg-cyber-secondary text-cyber-bg hover:shadow-cyber-glow-secondary focus:ring-cyber-secondary',
    ghost: 'bg-transparent border-2 border-cyber-border text-cyber-text-dim hover:border-cyber-primary hover:text-cyber-primary',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default CyberButton;
