import React, { useEffect, useState } from 'react';
import styles from './FloatingAnimations.module.css';

const FloatingAnimations = () => {
  const [animations, setAnimations] = useState([]);

  // Game controllers and card symbols only
  const gameIcons = ['🎮', '🕹️']; // دراعات الألعاب فقط
  const cardSymbols = ['🃏', '♠️', '♥️', '♦️', '♣️']; // رموز الكوتشينة البسيطة فقط

  useEffect(() => {
    const createAnimation = () => {
      const isCard = Math.random() > 0.5;
      const symbol = isCard 
        ? cardSymbols[Math.floor(Math.random() * cardSymbols.length)]
        : gameIcons[Math.floor(Math.random() * gameIcons.length)];
      
             const animation = {
         id: Date.now() + Math.random(),
         symbol,
         isCard,
         startX: Math.random() * window.innerWidth,
         startY: window.innerHeight + 50,
         duration: 8000 + Math.random() * 4000, // 8-12 seconds
         delay: Math.random() * 2000, // 0-2 seconds delay
         size: 15 + Math.random() * 20, // 15-35px (أصغر)
         rotation: Math.random() * 360,
         opacity: 0.3 + Math.random() * 0.2, // 0.3-0.5 (شفافية أكثر)
       };

      setAnimations(prev => [...prev, animation]);

      // Remove animation after it completes
      setTimeout(() => {
        setAnimations(prev => prev.filter(anim => anim.id !== animation.id));
      }, animation.duration + animation.delay + 1000);
    };

    // Create initial animations
    for (let i = 0; i < 5; i++) {
      setTimeout(createAnimation, i * 1000);
    }

    // Continue creating animations
    const interval = setInterval(createAnimation, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.floatingContainer}>
      {animations.map(animation => (
        <div
          key={animation.id}
          className={`${styles.floatingElement} ${animation.isCard ? styles.cardSymbol : styles.gameIcon}`}
          style={{
            left: animation.startX,
            top: animation.startY,
            fontSize: animation.size,
            opacity: animation.opacity,
            transform: `rotate(${animation.rotation}deg)`,
            animationDuration: `${animation.duration}ms`,
            animationDelay: `${animation.delay}ms`,
          }}
        >
          {animation.symbol}
        </div>
      ))}
    </div>
  );
};

export default FloatingAnimations;
