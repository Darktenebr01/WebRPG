import React, { createContext, useContext, useState, useEffect } from 'react';

const StaminaContext = createContext();

export const useStamina = () => {
  const context = useContext(StaminaContext);
  if (!context) {
    throw new Error('useStamina must be used within StaminaProvider');
  }
  return context;
};

export const StaminaProvider = ({ children }) => {
  const [stamina, setStamina] = useState(260);
  const [maxStamina, setMaxStamina] = useState(260);
  const [lastRegenTime, setLastRegenTime] = useState(Date.now());
  const [nextRegenTime, setNextRegenTime] = useState(null);

  // Stamina regeneration constants
  const REGEN_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
  const REGEN_AMOUNT = 1; // Amount of stamina to regenerate

  // Initialize next regen time
  useEffect(() => {
    const savedLastRegen = localStorage.getItem('lastStaminaRegen');
    const savedStamina = localStorage.getItem('currentStamina');
    const savedMaxStamina = localStorage.getItem('maxStamina');
    
    if (savedLastRegen) {
      const lastRegen = parseInt(savedLastRegen);
      setLastRegenTime(lastRegen);
      
      // Calculate how much stamina should have regenerated
      const timePassed = Date.now() - lastRegen;
      const regenCycles = Math.floor(timePassed / REGEN_INTERVAL);
      
      if (savedStamina) {
        const currentStamina = parseInt(savedStamina);
        const maxStam = savedMaxStamina ? parseInt(savedMaxStamina) : 260;
        const newStamina = Math.min(maxStam, currentStamina + (regenCycles * REGEN_AMOUNT));
        
        setStamina(newStamina);
        setMaxStamina(maxStam);
        
        // Update last regen time to account for completed cycles
        const newLastRegen = lastRegen + (regenCycles * REGEN_INTERVAL);
        setLastRegenTime(newLastRegen);
        localStorage.setItem('lastStaminaRegen', newLastRegen.toString());
      }
    } else {
      // First time - set initial regen time
      const now = Date.now();
      setLastRegenTime(now);
      localStorage.setItem('lastStaminaRegen', now.toString());
    }
    
    if (savedStamina) {
      setStamina(parseInt(savedStamina));
    }
    
    if (savedMaxStamina) {
      setMaxStamina(parseInt(savedMaxStamina));
    }
  }, []);

  // Calculate next regeneration time
  useEffect(() => {
    const nextRegen = lastRegenTime + REGEN_INTERVAL;
    setNextRegenTime(nextRegen);
  }, [lastRegenTime]);

  // Stamina regeneration timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      
      if (stamina < maxStamina && now >= lastRegenTime + REGEN_INTERVAL) {
        const newStamina = Math.min(maxStamina, stamina + REGEN_AMOUNT);
        const newLastRegen = now;
        
        setStamina(newStamina);
        setLastRegenTime(newLastRegen);
        
        // Save to localStorage
        localStorage.setItem('currentStamina', newStamina.toString());
        localStorage.setItem('lastStaminaRegen', newLastRegen.toString());
      }
    }, 1000); // Check every second

    return () => clearInterval(timer);
  }, [stamina, maxStamina, lastRegenTime]);

  // Save stamina to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currentStamina', stamina.toString());
  }, [stamina]);

  // Save max stamina to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('maxStamina', maxStamina.toString());
  }, [maxStamina]);

  const useStaminaForAttack = (amount = 1) => {
    if (stamina >= amount) {
      const newStamina = stamina - amount;
      setStamina(newStamina);
      localStorage.setItem('currentStamina', newStamina.toString());
      return true;
    }
    return false;
  };

  const getTimeUntilNextRegen = () => {
    if (!nextRegenTime) return 0;
    const timeLeft = nextRegenTime - Date.now();
    return Math.max(0, timeLeft);
  };

  const getFormattedTimeUntilRegen = () => {
    const timeLeft = getTimeUntilNextRegen();
    const minutes = Math.floor(timeLeft / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const increaseMaxStamina = (amount) => {
    const newMaxStamina = maxStamina + amount;
    setMaxStamina(newMaxStamina);
    localStorage.setItem('maxStamina', newMaxStamina.toString());
  };

  const value = {
    stamina,
    maxStamina,
    useStaminaForAttack,
    getTimeUntilNextRegen,
    getFormattedTimeUntilRegen,
    increaseMaxStamina,
    nextRegenTime,
    REGEN_INTERVAL,
    REGEN_AMOUNT
  };

  return (
    <StaminaContext.Provider value={value}>
      {children}
    </StaminaContext.Provider>
  );
};

