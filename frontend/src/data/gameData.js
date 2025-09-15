// Game data with AI-generated images

export const equipmentData = {
  weapons: [
    {
      id: 'rusty_sword',
      name: 'Rusty Shortsword',
      type: 'weapon',
      rarity: 'COMMON',
      attack: 15,
      level: 1,
      image: 'https://images.unsplash.com/photo-1664998064588-110022300318?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwUlBHJTIwZXF1aXBtZW50fGVufDB8fHx8MTc1NzkwMzAzN3ww&ixlib=rb-4.1.0&q=85',
      description: 'A dull, pitted blade stolen from some unlucky traveler.'
    },
    {
      id: 'magic_wand',
      name: 'Enchanted Wand',
      type: 'weapon',
      rarity: 'RARE',
      attack: 45,
      level: 5,
      image: 'https://images.unsplash.com/photo-1572900145365-78a95d897e80?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxmYW50YXN5JTIwd2VhcG9uc3xlbnwwfHx8fDE3NTc5MDMwNDN8MA&ixlib=rb-4.1.0&q=85',
      description: 'A mystical wand imbued with ancient magic.'
    },
    {
      id: 'legendary_blade',
      name: 'Dragonslayer Blade',
      type: 'weapon',
      rarity: 'LEGENDARY',
      attack: 120,
      level: 15,
      image: 'https://images.pexels.com/photos/31876113/pexels-photo-31876113.jpeg',
      description: 'A legendary blade forged to slay dragons.'
    }
  ],
  
  helmets: [
    {
      id: 'leather_cap',
      name: 'Leather Cap',
      type: 'helmet',
      rarity: 'COMMON',
      defense: 8,
      level: 1,
      image: 'https://images.unsplash.com/photo-1642609628537-fb6a4e67e3a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxhcm1vciUyMGhlbG1ldHxlbnwwfHx8fDE3NTc5MDMwNTR8MA&ixlib=rb-4.1.0&q=85',
      description: 'Simple leather headgear for basic protection.'
    },
    {
      id: 'bronze_helmet',
      name: 'Bronze Helmet',
      type: 'helmet',
      rarity: 'RARE',
      defense: 25,
      level: 8,
      image: 'https://images.unsplash.com/photo-1682187517559-0b4b104548d0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxhcm1vciUyMGhlbG1ldHxlbnwwfHx8fDE3NTc5MDMwNTR8MA&ixlib=rb-4.1.0&q=85',
      description: 'A well-crafted bronze helmet with chainmail.'
    },
    {
      id: 'shadow_helm',
      name: 'Shadow Helm',
      type: 'helmet',
      rarity: 'LEGENDARY',
      defense: 65,
      level: 20,
      image: 'https://images.pexels.com/photos/31350032/pexels-photo-31350032.jpeg',
      description: 'A dark helmet that strikes fear into enemies.'
    }
  ],
  
  armor: [
    {
      id: 'torn_leather',
      name: 'Torn Leather Armor',
      type: 'armor',
      rarity: 'COMMON',
      defense: 12,
      level: 1,
      image: 'https://images.pexels.com/photos/339805/pexels-photo-339805.jpeg',
      description: 'A strip of worn leather armor, reeking of goblin sweat.'
    },
    {
      id: 'chainmail',
      name: 'Steel Chainmail',
      type: 'armor',
      rarity: 'RARE',
      defense: 35,
      level: 10,
      image: 'https://images.unsplash.com/photo-1642609628537-fb6a4e67e3a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxhcm1vciUyMGhlbG1ldHxlbnwwfHx8fDE3NTc5MDMwNTR8MA&ixlib=rb-4.1.0&q=85',
      description: 'Interlocking metal rings providing solid protection.'
    }
  ],
  
  boots: [
    {
      id: 'worn_boots',
      name: 'Worn Leather Boots',
      type: 'boots',
      rarity: 'COMMON',
      defense: 5,
      level: 1,
      image: 'https://images.unsplash.com/photo-1596716148130-f95f2b735a92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxhcm1vciUyMGhlbG1ldHxlbnwwfHx8fDE3NTc5MDMwNTR8MA&ixlib=rb-4.1.0&q=85',
      description: 'A rough leather boot, smells of goblins dirty feet.'
    }
  ],
  
  gloves: [
    {
      id: 'worn_gloves',
      name: 'Worn Gloves',
      type: 'gloves',
      rarity: 'COMMON',
      defense: 3,
      level: 1,
      image: 'https://images.unsplash.com/photo-1596716148130-f95f2b735a92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxhcm1vciUyMGhlbG1ldHxlbnwwfHx8fDE3NTc5MDMwNTR8MA&ixlib=rb-4.1.0&q=85',
      description: 'Basic worn gloves for protection.'
    }
  ],
  
  rings: [
    {
      id: 'power_ring',
      name: 'Ring of Power',
      type: 'ring',
      rarity: 'RARE',
      attack: 20,
      defense: 10,
      level: 5,
      image: 'https://images.unsplash.com/photo-1596716148130-f95f2b735a92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxhcm1vciUyMGhlbG1ldHxlbnwwfHx8fDE3NTc5MDMwNTR8MA&ixlib=rb-4.1.0&q=85',
      description: 'A ring that enhances both attack and defense.'
    }
  ]
};

export const monsterData = {
  monsters: [
    {
      id: 'goblin_skirmisher',
      name: 'Goblin Skirmisher',
      level: 3,
      hp: 120,
      attack: 25,
      defense: 8,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      rewards: { gold: 15, experience: 25 }
    },
    {
      id: 'orc_warrior',
      name: 'Orc Warrior',
      level: 8,
      hp: 280,
      attack: 45,
      defense: 18,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      rewards: { gold: 35, experience: 65 }
    },
    {
      id: 'shadow_beast',
      name: 'Shadow Beast',
      level: 12,
      hp: 450,
      attack: 68,
      defense: 28,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      rewards: { gold: 55, experience: 95 }
    },
    {
      id: 'ancient_dragon',
      name: 'Ancient Dragon',
      level: 25,
      hp: 1200,
      attack: 150,
      defense: 85,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      rewards: { gold: 200, experience: 500 }
    }
  ]
};

export const petData = {
  pets: [
    {
      id: 'shadow_leopard',
      name: 'Shadow Leopard',
      type: 'stealth',
      rarity: 'LEGENDARY',
      attack: 500,
      defense: 250,
      level: 1,
      maxLevel: 80,
      image: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735',
      description: 'A stealthy leopard that strikes from the shadows.',
      skills: ['Shadow Strike', 'Stealth Mode', 'Critical Assault']
    },
    {
      id: 'cute_monster',
      name: 'Pocket Monster',
      type: 'companion',
      rarity: 'COMMON',
      attack: 100,
      defense: 200,
      level: 1,
      maxLevel: 30,
      image: 'https://images.unsplash.com/photo-1588422333078-44ad73367bcb',
      description: 'A friendly little companion that boosts morale.',
      skills: ['Cheerful Boost', 'Healing Touch']
    }
  ]
};

export const gateData = {
  gates: [
    {
      id: 'grakthar',
      name: 'GRAKTHAR',
      description: 'Beyond the Gate lies a world where monsters rule and humans are prey.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      waves: [
        {
          id: 1,
          name: 'Wave 1',
          requiredLevel: 1,
          monsters: ['goblin_skirmisher'],
          monstersPerInstance: 5
        },
        {
          id: 2,
          name: 'Wave 2',
          requiredLevel: 5,
          monsters: ['orc_warrior'],
          monstersPerInstance: 3
        },
        {
          id: 3,
          name: 'Wave 3',
          requiredLevel: 10,
          monsters: ['shadow_beast'],
          monstersPerInstance: 2
        },
        {
          id: 4,
          name: 'Boss Wave',
          requiredLevel: 20,
          monsters: ['ancient_dragon'],
          monstersPerInstance: 1,
          isBoss: true
        }
      ]
    }
  ]
};

export default {
  equipmentData,
  monsterData,
  petData,
  gateData
};