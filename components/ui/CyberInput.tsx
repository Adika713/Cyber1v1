
import React from 'react';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const CyberInput: React.FC<CyberInputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-cyber-text-dim mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full bg-cyber-surface border-2 border-cyber-border focus:border-cyber-primary focus:ring-0 text-cyber-text placeholder-cyber-text-dim p-2 transition-colors duration-200 outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default CyberInput;
