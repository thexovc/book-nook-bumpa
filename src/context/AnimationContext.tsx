import React, { createContext, useContext, useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface FlyingAnimation {
  id: string;
  coverUrl: string | null;
  startX: number;
  startY: number;
}

interface AnimationContextType {
  cartIconPosition: Position | null;
  setCartIconPosition: (pos: Position | null) => void;
  activeAnimations: FlyingAnimation[];
  triggerFlyToCart: (coverUrl: string | null, startX: number, startY: number) => void;
  removeAnimation: (id: string) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartIconPosition, setCartIconPosition] = useState<Position | null>(null);
  const [activeAnimations, setActiveAnimations] = useState<FlyingAnimation[]>([]);

  const triggerFlyToCart = useCallback((coverUrl: string | null, startX: number, startY: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setActiveAnimations((prev) => [...prev, { id, coverUrl, startX, startY }]);
  }, []);

  const removeAnimation = useCallback((id: string) => {
    setActiveAnimations((prev) => prev.filter((anim) => anim.id !== id));
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        cartIconPosition,
        setCartIconPosition,
        activeAnimations,
        triggerFlyToCart,
        removeAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
