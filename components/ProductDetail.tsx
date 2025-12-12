import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Product, Track } from '../types';
import { Play, Pause, SkipForward, SkipBack, Truck, Info, Disc, Volume2, X } from 'lucide-react';
import gsap from 'gsap';
import { Howl } from 'howler';
import ProductForm from './ProductForm';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // Audio State
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const requestRef = useRef<number | null>(null);

  const activeTrack = currentTrackIndex !== null && product.tracklist ? product.tracklist[currentTrackIndex] : null;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".pdp-animate-up", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
        gsap.from(".pdp-image", {
            scale: 1.05,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    }, containerRef);
    return () => ctx.revert();
  }, [product]);

  // Player Animation
  useEffect(() => {
    if (activeTrack && playerRef.current) {
      gsap.to(playerRef.current, { y: 0, duration: 0.5, ease: "power3.out" });
    } else if (playerRef.current) {
      gsap.to(playerRef.current, { y: '100%', duration: 0.5, ease: "power3.in" });
    }
  }, [activeTrack]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const updateProgress = () => {
    if (soundRef.current && soundRef.current.playing()) {
      const seek = soundRef.current.seek();
      const dur = soundRef.current.duration();
      setCurrentTime(typeof seek === 'number' ? seek : 0);
      setDuration(dur);
      setProgress((typeof seek === 'number' ? seek : 0) / dur * 100);
      requestRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const playTrack = (index: number) => {
    if (!product.tracklist) return;

    // If clicking the currently playing track, toggle pause
    if (currentTrackIndex === index && soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
      return;
    }

    // Stop previous track
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const track = product.tracklist[index];
    if (!track.audioUrl) return;

    const sound = new Howl({
      src: [track.audioUrl],
      html5: true, // Force HTML5 Audio to allow streaming large files
      volume: 0.8,
      onplay: () => {
        setIsPlaying(true);
        requestRef.current = requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        setIsPlaying(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      },
      onend: () => {
        setIsPlaying(false);
        playNext();
      },
      onload: () => {
         setDuration(sound.duration());
      }
    });

    soundRef.current = sound;
    sound.play();
    setCurrentTrackIndex(index);
  };

  const playNext = () => {
    if (currentTrackIndex !== null && product.tracklist && currentTrackIndex < product.tracklist.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  };

  const playPrev = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    }
  };

  const closePlayer = () => {
    if (soundRef.current) {
        soundRef.current.unload();
    }
    setCurrentTrackIndex(null);
    setIsPlaying(false);
  };
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!soundRef.current) return;
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      const newTime = percent * soundRef.current.duration();
      soundRef.current.seek(newTime);
      setCurrentTime(newTime);
      setProgress(percent * 100);
  };

  return (
    <div ref={containerRef} className="bg-vinyl-paper min-h-screen pb-32">
      {/* Breadcrumb / Back */}
      <div className="border-b border-vinyl-blue px-4 sm:px-8 py-4 flex items-center justify-between sticky top-[64px] sm:top-[80px] z-30 bg-vinyl-paper/95 backdrop-blur-sm">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-vinyl-blue hover:underline decoration-vinyl-blue underline-offset-4"
        >
            ← Back to Shop
        </button>
        <div className="hidden sm:flex gap-4 font-mono text-xs text-gray-400 uppercase">
             <span>Catalog #{product.catalogNumber || 'N/A'}</span>
             <span>/</span>
             <span>{product.label || 'Independent'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)]">
        
        {/* Left Column: Media (Sticky) */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-vinyl-blue relative">
            <div className="lg:sticky lg:top-[140px] h-auto lg:h-[calc(100vh-140px)] overflow-hidden flex flex-col">
                <div className="flex-1 bg-gray-100 relative group overflow-hidden border-b border-vinyl-blue">
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className={`pdp-image w-full h-full object-cover transition-transform duration-[4s] ease-in-out ${isPlaying ? 'scale-105' : 'scale-100'}`}
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="bg-vinyl-paper px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-vinyl-blue shadow-sm text-vinyl-blue">
                            View Hi-Res
                         </div>
                    </div>
                </div>
                {/* Secondary Images Strip */}
                <div className="h-32 bg-white flex overflow-x-auto divide-x divide-vinyl-blue no-scrollbar">
                     <div className="w-32 flex-shrink-0 relative cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                        <img src={product.image} className="w-full h-full object-cover grayscale" />
                     </div>
                     <div className="w-32 flex-shrink-0 relative cursor-pointer hover:opacity-80 transition-opacity bg-vinyl-black flex items-center justify-center">
                        <Disc className={`text-white ${isPlaying ? 'animate-spin-slow' : ''}`} />
                     </div>
                     <div className="w-32 flex-shrink-0 relative cursor-pointer hover:opacity-80 transition-opacity bg-vinyl-blue/10 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-vinyl-blue">Back Cover</span>
                     </div>
                </div>
            </div>
        </div>

        {/* Right Column: Details (Scrollable) */}
        <div className="lg:col-span-5 bg-vinyl-paper">
            <div className="p-6 sm:p-10 lg:p-12 flex flex-col gap-10">
                
                {/* Header Info */}
                <div className="pdp-animate-up">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 font-mono text-xs uppercase tracking-widest text-gray-500">
                        {product.label && <span className="text-vinyl-blue">Label: {product.label}</span>}
                        {product.tags && <span>File Under: {product.tags.join(' / ')}</span>}
                    </div>
                    
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-vinyl-blue leading-[0.9] mb-2">
                        <span className="block text-vinyl-black mb-2 text-2xl sm:text-3xl font-sans font-normal tracking-wide">{product.artist} —</span>
                        <span className="italic">{product.title}</span>
                    </h1>
                    
                    <div className="mt-6 flex items-center gap-4">
                        <span className="font-mono text-2xl text-vinyl-black">${product.price.toFixed(2)}</span>
                        {product.isNew && <span className="px-3 py-1 rounded-full border border-vinyl-blue text-vinyl-blue text-[10px] font-mono uppercase">New Arrival</span>}
                    </div>
                </div>

                {/* Actions / Product Form */}
                <div className="pdp-animate-up border-y border-gray-300 py-8">
                   <ProductForm product={product} />
                   
                   <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-500 uppercase tracking-wide mt-6">
                        <div className="flex items-center gap-2">
                            <Truck size={14} className="text-vinyl-blue" />
                            <span>Free shipping on US orders over $100</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={14} className="text-vinyl-blue" />
                            <span>Pickup available at Brooklyn Store (Ready in 24h)</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="pdp-animate-up prose prose-headings:font-serif prose-p:font-sans prose-p:text-sm prose-p:leading-relaxed prose-a:text-vinyl-blue text-gray-800 max-w-none">
                    <h3 className="font-serif text-2xl italic text-vinyl-blue mb-4">About the Release</h3>
                    <p>{product.description || "No description available for this release."}</p>
                </div>

                {/* Tracklist */}
                {product.tracklist && (
                    <div className="pdp-animate-up">
                         <div className="flex justify-between items-end border-b border-vinyl-blue pb-2 mb-4">
                             <h3 className="font-serif text-2xl italic text-vinyl-blue">Tracklist</h3>
                             <span className="font-mono text-[10px] uppercase text-gray-500">{product.tracklist.length} Tracks</span>
                         </div>
                         <ul className="flex flex-col">
                             {product.tracklist.map((track, i) => {
                                 const isTrackActive = currentTrackIndex === i;
                                 return (
                                     <li 
                                        key={i} 
                                        className={`group flex justify-between items-center py-3 border-b border-gray-200 hover:pl-2 transition-all cursor-pointer ${isTrackActive ? 'bg-gray-50 pl-2' : 'hover:bg-white'}`}
                                        onClick={() => playTrack(i)}
                                     >
                                         <div className="flex items-center gap-4">
                                             <span className="font-mono text-xs text-gray-400 w-6 flex justify-center">
                                                {isTrackActive && isPlaying ? (
                                                    <div className="flex items-end gap-[1px] h-3">
                                                        <div className="w-[2px] bg-vinyl-blue eq-bar"></div>
                                                        <div className="w-[2px] bg-vinyl-blue eq-bar"></div>
                                                        <div className="w-[2px] bg-vinyl-blue eq-bar"></div>
                                                    </div>
                                                ) : (
                                                    track.number
                                                )}
                                             </span>
                                             <span className={`font-sans text-sm ${isTrackActive ? 'text-vinyl-blue font-medium' : 'group-hover:text-vinyl-blue'}`}>
                                                {track.title}
                                             </span>
                                         </div>
                                         <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs text-gray-400">{track.duration}</span>
                                            <button className={`text-vinyl-blue ${isTrackActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {isTrackActive && isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                            </button>
                                         </div>
                                     </li>
                                 );
                             })}
                         </ul>
                    </div>
                )}
                
                {/* Cultivated Sounds Extras Upsell */}
                <div className="pdp-animate-up bg-[#e8e6df] p-6 border border-vinyl-blue mt-8">
                     <h4 className="font-serif text-xl italic text-vinyl-blue mb-4">Cultivated Sounds Extras</h4>
                     <div className="flex gap-4">
                        <div className="w-16 h-16 bg-white border border-gray-300 flex items-center justify-center flex-shrink-0">
                            <span className="font-mono text-[8px]">OUTER<br/>SLEEVE</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-mono text-xs font-bold uppercase mb-1">12" Outer Sleeves - Dual Pocket</p>
                            <p className="font-sans text-xs text-gray-600 mb-2">Protect your investment with our premium 3mil sleeves.</p>
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs">$1.25</span>
                                <button className="text-[10px] uppercase font-bold text-vinyl-blue underline hover:no-underline">Add</button>
                            </div>
                        </div>
                     </div>
                </div>

            </div>
        </div>
      </div>

      {/* Sticky Player Bar */}
      <div 
        ref={playerRef}
        className="fixed bottom-0 left-0 w-full z-50 bg-vinyl-blue text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] translate-y-full"
      >
        {activeTrack && (
            <div className="flex flex-col">
                {/* Progress Bar */}
                <div 
                    className="w-full h-1 bg-white/20 cursor-pointer group relative"
                    onClick={handleProgressBarClick}
                >
                    <div 
                        className="h-full bg-vinyl-red absolute top-0 left-0 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div 
                        className="h-4 w-4 bg-vinyl-red rounded-full absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${progress}%`, marginLeft: '-8px' }}
                    ></div>
                </div>

                <div className="flex items-center justify-between px-4 sm:px-8 py-4 h-20">
                    
                    {/* Left: Track Info */}
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="w-12 h-12 bg-white/10 flex-shrink-0 border border-white/20">
                            <img src={product.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden sm:block overflow-hidden">
                             <div className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">Now Playing</div>
                             <div className="font-serif italic text-lg leading-none truncate w-48">{activeTrack.title}</div>
                        </div>
                    </div>

                    {/* Center: Controls */}
                    <div className="flex items-center gap-6 justify-center w-1/3">
                        <button onClick={playPrev} className="text-white/70 hover:text-white transition-colors">
                            <SkipBack size={20} fill="currentColor" />
                        </button>
                        <button 
                            onClick={() => currentTrackIndex !== null && playTrack(currentTrackIndex)}
                            className="w-12 h-12 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-vinyl-blue transition-colors"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={playNext} className="text-white/70 hover:text-white transition-colors">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                    </div>

                    {/* Right: Time / Close */}
                    <div className="flex items-center justify-end gap-6 w-1/3">
                        <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                            <span>{formatTime(currentTime)}</span>
                            <span className="text-white/40">/</span>
                            <span className="text-white/40">{formatTime(duration || 0)}</span>
                        </div>
                        <button onClick={closePlayer} className="text-white/60 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                </div>
            </div>
        )}
      </div>

    </div>
  );
};

export default ProductDetail;