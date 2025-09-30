'use client';

import { useEffect, useState } from 'react';

export function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);

  // Générer les positions des particules une seule fois côté client
  useEffect(() => {
    setIsClient(true);
    const particleData = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10,
    }));
    setParticles(particleData);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  // Ne pas rendre les particules pendant l'hydratation
  if (!isClient) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradients statiques pendant l'hydratation */}
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" 
             style={{ left: '10%', top: '20%' }} />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
             style={{ right: '10%', bottom: '20%', animationDelay: '2s' }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
              transition: 'transform 2s ease-out',
            }}
          />
        ))}
      </div>

      {/* Gradients animés */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"
        style={{
          left: '10%',
          top: '20%',
          transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 30}px)`,
          transition: 'transform 3s ease-out',
        }}
      />
      <div 
        className="absolute w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
        style={{
          right: '10%',
          bottom: '20%',
          animationDelay: '2s',
          transform: `translate(${-mousePosition.x * 40}px, ${-mousePosition.y * 25}px)`,
          transition: 'transform 3s ease-out',
        }}
      />

      {/* Formes géométriques */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className={`absolute opacity-5 animate-spin-slow ${
              i % 2 === 0 ? 'border-2 border-blue-400' : 'bg-purple-400'
            }`}
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${20 + i * 10}%`,
              top: `${10 + i * 8}%`,
              borderRadius: i % 3 === 0 ? '50%' : '0%',
              animationDuration: `${20 + i * 5}s`,
              animationDelay: `${i * 2}s`,
              transform: `translate(${mousePosition.x * (10 + i * 5)}px, ${mousePosition.y * (5 + i * 3)}px)`,
              transition: 'transform 2.5s ease-out',
            }}
          />
        ))}
      </div>
    </div>
  );
}