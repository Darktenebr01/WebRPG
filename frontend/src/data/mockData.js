// Mock data for development and testing

export const mockPlayerData = {
  id: 'player-001',
  username: 'TestPlayer',
  level: 25,
  experience: 75640,
  nextLevelXp: 80000,
  gold: 25219,
  gems: 532,
  stamina: 260,
  maxStamina: 1000,
  stats: {
    attack: 100,
    defense: 80,
    maxStamina: 50
  },
  equipment: {
    weapon: null,
    helmet: null,
    armor: null,
    boots: null,
    gloves: null,
    ring1: null,
    ring2: null,
    amulet: null
  },
  inventory: [],
  pets: []
};

export const mockGameState = {
  currentLocation: 'town',
  inBattle: false,
  battleData: null,
  activeQuests: [],
  completedQuests: []
};

export default {
  mockPlayerData,
  mockGameState
};