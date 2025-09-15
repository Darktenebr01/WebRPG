import React, { createContext, useContext, useState, useEffect } from 'react';
import { equipmentData, petData } from '../data/gameData';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [playerEquipment, setPlayerEquipment] = useState({
    weapon: null,
    helmet: null,
    armor: null,
    boots: null,
    gloves: null,
    ring1: null,
    ring2: null,
    amulet: null
  });

  const [playerInventory, setPlayerInventory] = useState([]);
  const [equippedPets, setEquippedPets] = useState([]);
  const [petInventory, setPetInventory] = useState([]);
  const [playerStats, setPlayerStats] = useState({
    level: 25,
    experience: 75640,
    nextLevelXp: 80000,
    stamina: 260,
    maxStamina: 1000,
    gold: 25219,
    gems: 532,
    statPoints: 0,
    allocatedStats: {
      attack: 100,
      defense: 80,
      maxStamina: 50
    }
  });

  // Initialize with some starting equipment
  useEffect(() => {
    const startingEquipment = {
      weapon: equipmentData.weapons[0], // Rusty sword
      armor: equipmentData.armor[0], // Torn leather armor
      boots: equipmentData.boots[0], // Worn boots
      gloves: equipmentData.gloves[0] // Worn gloves
    };

    const startingInventory = [
      equipmentData.weapons[1], // Magic wand
      equipmentData.helmets[0], // Leather cap
      equipmentData.helmets[1], // Bronze helmet
      equipmentData.rings[0] // Power ring
    ];

    const startingPets = [
      { ...petData.pets[0], isEquipped: true },
      { ...petData.pets[1], isEquipped: false }
    ];

    setPlayerEquipment(startingEquipment);
    setPlayerInventory(startingInventory);
    setEquippedPets([startingPets[0]]);
    setPetInventory(startingPets);
  }, []);

  const calculateTotalStats = () => {
    let totalAttack = playerStats.allocatedStats.attack;
    let totalDefense = playerStats.allocatedStats.defense;

    // Add equipment bonuses
    Object.values(playerEquipment).forEach(item => {
      if (item) {
        totalAttack += item.attack || 0;
        totalDefense += item.defense || 0;
      }
    });

    // Add pet bonuses
    equippedPets.forEach(pet => {
      totalAttack += pet.attack || 0;
      totalDefense += pet.defense || 0;
    });

    return { totalAttack, totalDefense };
  };

  const equipItem = (item, slot = null) => {
    const targetSlot = slot || item.type;

    // Handle rings specially (can equip 2)
    if (item.type === 'ring') {
      if (!playerEquipment.ring1) {
        setPlayerEquipment(prev => ({ ...prev, ring1: item }));
      } else if (!playerEquipment.ring2) {
        setPlayerEquipment(prev => ({ ...prev, ring2: item }));
      } else {
        // Replace ring1 if both slots are full
        setPlayerEquipment(prev => ({ ...prev, ring1: item }));
      }
    } else {
      // Unequip current item in slot if exists
      if (playerEquipment[targetSlot]) {
        setPlayerInventory(prev => [...prev, playerEquipment[targetSlot]]);
      }

      setPlayerEquipment(prev => ({ ...prev, [targetSlot]: item }));
    }

    // Remove item from inventory
    setPlayerInventory(prev => prev.filter(invItem => invItem.id !== item.id));
  };

  const unequipItem = (slot) => {
    const item = playerEquipment[slot];
    if (item) {
      setPlayerInventory(prev => [...prev, item]);
      setPlayerEquipment(prev => ({ ...prev, [slot]: null }));
    }
  };

  const addItemToInventory = (item) => {
    setPlayerInventory(prev => [...prev, item]);
  };

  const equipPet = (pet) => {
    if (equippedPets.length < 3) { // Max 3 equipped pets
      setEquippedPets(prev => [...prev, { ...pet, isEquipped: true }]);
      setPetInventory(prev =>
        prev.map(p => p.id === pet.id ? { ...p, isEquipped: true } : p)
      );
    }
  };

  const unequipPet = (petId) => {
    setEquippedPets(prev => prev.filter(p => p.id !== petId));
    setPetInventory(prev =>
      prev.map(p => p.id === petId ? { ...p, isEquipped: false } : p)
    );
  };

  const addPetToInventory = (pet) => {
    setPetInventory(prev => [...prev, { ...pet, isEquipped: false }]);
  };

  const allocateStatPoint = (statType, amount) => {
    if (playerStats.statPoints >= amount) {
      setPlayerStats(prev => ({
        ...prev,
        statPoints: prev.statPoints - amount,
        allocatedStats: {
          ...prev.allocatedStats,
          [statType]: prev.allocatedStats[statType] + amount
        }
      }));
    }
  };

  const updatePlayerResources = (updates) => {
    setPlayerStats(prev => ({ ...prev, ...updates }));
  };

  const value = {
    playerEquipment,
    playerInventory,
    equippedPets,
    petInventory,
    playerStats,
    calculateTotalStats,
    equipItem,
    unequipItem,
    addItemToInventory,
    equipPet,
    unequipPet,
    addPetToInventory,
    allocateStatPoint,
    updatePlayerResources
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};