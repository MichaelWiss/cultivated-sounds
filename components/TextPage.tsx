import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const TextPage: React.FC<TextPageProps> = ({ title, subtitle, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".text-animate", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [title]);

  return (
    <div ref={containerRef} className="min-h-screen bg-vinyl-paper px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 border-b border-vinyl-blue pb-8 text-animate">
            {subtitle && (
                <p className="font-mono text-xs uppercase tracking-widest text-vinyl-blue mb-4">
                    {subtitle}
                </p>
            )}
            <h1 className="font-serif text-5xl sm:text-6xl text-vinyl-black italic leading-[0.9]">
                {title}
            </h1>
        </div>

        <div className="text-animate prose prose-lg prose-headings:font-serif prose-headings:italic prose-headings:text-vinyl-blue prose-p:font-sans prose-p:text-sm prose-p:leading-relaxed prose-li:font-sans prose-li:text-sm text-gray-800">
            {children}
        </div>
      </div>
    </div>
  );
};

export default TextPage;