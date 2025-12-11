import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });
      
      gsap.from(".hero-btn", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.8
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full border-b border-vinyl-blue overflow-hidden group">
      {/* Background with blend mode */}
      <div className="absolute inset-0 bg-vinyl-blue opacity-5 z-10 pointer-events-none mix-blend-multiply"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left: Image */}
        <div className="relative h-[50vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-vinyl-blue overflow-hidden">
          <img 
            src="https://picsum.photos/seed/hero2/1200/1200" 
            alt="Featured Artist" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
             <div className="text-white font-mono text-xs uppercase border border-white/30 px-3 py-1 rounded-full backdrop-blur-md">
                Featured Release
             </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="relative flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-vinyl-paper">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vinyl-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <p className="font-mono text-vinyl-blue text-sm mb-6 tracking-widest uppercase">Just Arrived</p>
          
          <h2 ref={textRef} className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-vinyl-black mb-8">
            <span className="italic block text-vinyl-blue">Sessa's</span>
            Third Full Length,
            <span className="block mt-2">Pequena Vertigem</span>
            <span className="block mt-2 font-light">De Amor</span>
          </h2>

          <p className="font-sans text-lg text-gray-600 max-w-md mb-10 leading-relaxed">
            A stunning exploration of tropicalia infused textures and intimate songwriting. 
            Pressed on 180g limited edition clear vinyl.
          </p>

          <button className="hero-btn w-fit group flex items-center gap-3 px-8 py-3 bg-transparent border border-vinyl-blue text-vinyl-blue rounded-full hover:bg-vinyl-blue hover:text-white transition-all duration-300">
            <span className="font-mono uppercase tracking-wide text-sm">Shop Now</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;