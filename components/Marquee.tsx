import React from 'react';

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ text, className = "", speed = 20 }) => {
  return (
    <div className={`marquee-container w-full overflow-hidden border-b border-vinyl-blue ${className}`}>
      <div className="marquee-content py-2 font-mono text-sm uppercase tracking-widest text-vinyl-blue">
        <span className="mx-4">{text}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">✦</span>
      </div>
    </div>
  );
};

export default Marquee;