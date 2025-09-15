import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { useStamina } from '../contexts/StaminaContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  Sword,
  Zap,
  Users,
  Trophy,
  Heart,
  Coins,
  Star,
  Crown,
  Shield
} from 'lucide-react';

const BattleSystem = ({ onBack }) => {
  const { user } = useAuth();
  const { playerStats, calculateTotalStats } = useGame();
  const { stamina, maxStamina, useStaminaForAttack } = useStamina();
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [battleState, setBattleState] = useState('selection'); // 'selection', 'lobby', 'combat'
  const [userJoinedBattle, setUserJoinedBattle] = useState(false);
  const [battleTimer, setBattleTimer] = useState(0);
  const [playerDamage, setPlayerDamage] = useState(0);

  const { totalAttack } = calculateTotalStats();

  // Mock battle data - in real app this would come from backend
  const [battles, setBattles] = useState([
    {
      id: 1,
      monster: {
        name: 'Goblin Skirmisher',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
        maxHp: 1000000,
        currentHp: 859656,
        level: 3
      },
      playersJoined: 2,
      maxPlayers: 20,
      rewards: { experience: 125, gold: 50 },
      timeLeft: 3600
    },
    {
      id: 2,
      monster: {
        name: 'Goblin Skirmisher',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
        maxHp: 1000000,
        currentHp: 865865,
        level: 3
      },
      playersJoined: 3,
      maxPlayers: 20,
      rewards: { experience: 125, gold: 50 },
      timeLeft: 3400
    },
    {
      id: 3,
      monster: {
        name: 'Goblin Skirmisher',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
        maxHp: 1000000,
        currentHp: 672254,
        level: 3
      },
      playersJoined: 4,
      maxPlayers: 20,
      rewards: { experience: 125, gold: 50 },
      timeLeft: 2800
    },
    {
      id: 4,
      monster: {
        name: 'Goblin Skirmisher',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
        maxHp: 1000000,
        currentHp: 817385,
        level: 3
      },
      playersJoined: 2,
      maxPlayers: 20,
      rewards: { experience: 125, gold: 50 },
      timeLeft: 4200
    },
    {
      id: 5,
      monster: {
        name: 'Goblin Slinger',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=250&fit=crop',
        maxHp: 1000000,
        currentHp: 330685,
        level: 5
      },
      playersJoined: 4,
      maxPlayers: 20,
      rewards: { experience: 175, gold: 75 },
      timeLeft: 1800
    },
    {
      id: 6,
      monster: {
        name: 'Goblin Warrior',
        image: 'https://images.unsplash.com/photo-1596730041954-4b4bbfba1d62?w=400&h=250&fit=crop',
        maxHp: 1000000,
        currentHp: 773241,
        level: 6
      },
      playersJoined: 1,
      maxPlayers: 20,
      rewards: { experience: 200, gold: 100 },
      timeLeft: 5400
    }
  ]);

  // Mock leaderboard data
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, username: 'Oltimus', damage: 1250000, avatar: '👑' },
    { rank: 2, username: 'Mr.Martin1988', damage: 890000, avatar: '⚔️' },
    { rank: 3, username: 'blackjeal', damage: 650000, avatar: '🛡️' },
    { rank: 4, username: 'd36', damage: 420000, avatar: '⚡' },
    { rank: 5, username: 'Nickfrey', damage: 380000, avatar: '🔥' }
  ]);

  const skills = [
    { name: 'Slash', damage: totalAttack * 1.0, staminaCost: 0, cooldown: 0 },
    { name: 'Power Slash', damage: totalAttack * 2.5, staminaCost: 10, cooldown: 3 },
    { name: 'Critical Strike', damage: totalAttack * 3.0, staminaCost: 15, cooldown: 5 },
    { name: 'Devastating Blow', damage: totalAttack * 4.0, staminaCost: 25, cooldown: 10 }
  ];

  // Simulate battle progression
  useEffect(() => {
    if (battleState === 'combat' && selectedBattle) {
      const interval = setInterval(() => {
        setBattleTimer(prev => prev + 1);
        
        // Simulate other players' damage
        setBattles(prevBattles => 
          prevBattles.map(battle => 
            battle.id === selectedBattle.id 
              ? { 
                  ...battle, 
                  monster: { 
                    ...battle.monster, 
                    currentHp: Math.max(0, battle.monster.currentHp - Math.random() * 5000)
                  }
                }
              : battle
          )
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [battleState, selectedBattle]);

  const handleJoinBattle = (battle) => {
    setSelectedBattle(battle);
    setBattleState('lobby');
  };

  const handleStartBattle = () => {
    setUserJoinedBattle(true);
    setBattleState('combat');
    setBattleTimer(0);
    setPlayerDamage(0);
  };

  const handleSkillAttack = (skill) => {
    if (skill.staminaCost > 0 && !useStaminaForAttack(skill.staminaCost)) {
      alert('Not enough stamina!');
      return;
    }

    const damage = Math.floor(skill.damage + (Math.random() * skill.damage * 0.3));
    setPlayerDamage(prev => prev + damage);

    // Update battle HP
    setBattles(prevBattles => 
      prevBattles.map(battle => 
        battle.id === selectedBattle.id 
          ? { 
              ...battle, 
              monster: { 
                ...battle.monster, 
                currentHp: Math.max(0, battle.monster.currentHp - damage)
              }
            }
          : battle
      )
    );

    // Update selected battle
    setSelectedBattle(prev => ({
      ...prev,
      monster: {
        ...prev.monster,
        currentHp: Math.max(0, prev.monster.currentHp - damage)
      }
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHPPercentage = (current, max) => {
    return (current / max) * 100;
  };

  if (battleState === 'combat' && selectedBattle) {
    return (
      <div className="min-h-screen bg-[#0f0f10] relative overflow-hidden">
        {/* Battle Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${selectedBattle.monster.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black/60" />

        {/* Header */}
        <header className="relative z-10 bg-black/50 border-b border-green-500/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setBattleState('lobby')} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Sword className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">{selectedBattle.monster.name}</span>
            </div>
            <div className="text-green-400 font-mono">
              {formatTime(battleTimer)}
            </div>
          </div>
        </header>

        {/* Battle Interface */}
        <main className="relative z-10 container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Monster Info */}
            <div className="lg:col-span-2">
              <Card className="bg-black/60 border-green-500/30 p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedBattle.monster.name}</h2>
                  
                  {/* HP Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-red-400 flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {selectedBattle.monster.currentHp.toLocaleString()} / {selectedBattle.monster.maxHp.toLocaleString()} HP
                      </span>
                    </div>
                    <Progress 
                      value={getHPPercentage(selectedBattle.monster.currentHp, selectedBattle.monster.maxHp)} 
                      className="h-6 bg-gray-700"
                    />
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <div>Exp & Gold Rewards up to LV 100</div>
                    <div className="text-yellow-400">Your Damage: {playerDamage.toLocaleString()} DMG</div>
                    {stamina < maxStamina * 0.2 && (
                      <div className="text-orange-400 flex items-center justify-center">
                        <span className="mr-2">⚠️</span>
                        Low stamina! Extra damage won't increase your EXP share.
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-8">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Choose a Skill to Attack:
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <Button
                        key={index}
                        onClick={() => handleSkillAttack(skill)}
                        disabled={stamina < skill.staminaCost}
                        className={`p-4 text-left ${
                          skill.staminaCost === 0 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        } ${stamina < skill.staminaCost ? 'opacity-50' : ''}`}
                      >
                        <div className="font-medium">{skill.name}</div>
                        {skill.staminaCost > 0 && (
                          <div className="text-sm opacity-75">({skill.staminaCost} STAMINA)</div>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Leaderboard */}
            <div>
              <Card className="bg-black/60 border-green-500/30 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Attackers Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-yellow-400 font-bold">#{player.rank}</div>
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                          {player.avatar}
                        </div>
                        <div className="text-white">{player.username}</div>
                        {player.username === user?.username && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {player.damage.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {/* Current player if not in top 5 */}
                  {playerDamage > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-800/30 rounded-lg border border-blue-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-400 font-bold">#?</div>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">
                          👤
                        </div>
                        <div className="text-white">{user?.username}</div>
                        <Badge className="bg-blue-600">You</Badge>
                      </div>
                      <div className="text-blue-400 text-sm font-medium">
                        {playerDamage.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (battleState === 'lobby' && selectedBattle) {
    return (
      <div className="min-h-screen bg-[#0f0f10] relative overflow-hidden">
        {/* Battle Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${selectedBattle.monster.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-black/80" />

        {/* Header */}
        <header className="relative z-10 bg-black/50 border-b border-green-500/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setBattleState('selection')} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Sword className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">{selectedBattle.monster.name}</span>
            </div>
          </div>
        </header>

        {/* Battle Lobby */}
        <main className="relative z-10 container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-black/60 border-green-500/30 p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-6">{selectedBattle.monster.name}</h2>
                  
                  {/* HP Bar */}
                  <div className="mb-8">
                    <div className="text-red-400 text-xl mb-4 flex items-center justify-center">
                      <Heart className="w-6 h-6 mr-2" />
                      {selectedBattle.monster.currentHp.toLocaleString()} / {selectedBattle.monster.maxHp.toLocaleString()} HP
                    </div>
                    <Progress 
                      value={getHPPercentage(selectedBattle.monster.currentHp, selectedBattle.monster.maxHp)} 
                      className="h-8 bg-gray-700"
                    />
                  </div>

                  <div className="space-y-4 text-gray-300 mb-8">
                    <div className="text-lg">Exp & Gold Rewards up to LV 100</div>
                    {!userJoinedBattle && (
                      <div className="text-gray-400 text-lg">You haven't joined this battle yet.</div>
                    )}
                  </div>

                  {!userJoinedBattle && (
                    <Button 
                      onClick={handleStartBattle}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                    >
                      <Sword className="w-5 h-5 mr-2" />
                      Join the Battle
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Leaderboard */}
            <div>
              <Card className="bg-black/60 border-green-500/30 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Attackers Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.slice(0, 4).map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-yellow-400 font-bold">#{player.rank}</div>
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                          {player.avatar}
                        </div>
                        <div className="text-white">{player.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Battle Selection Screen
  return (
    <div className="min-h-screen bg-[#0f0f10]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Battle Arena</h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-green-400">
              <Heart className="w-4 h-4" />
              <span>{playerStats.stamina}/{playerStats.maxStamina}</span>
            </div>
            <Badge className="bg-blue-600">
              <Sword className="w-3 h-3 mr-1" />
              {totalAttack} ATK
            </Badge>
          </div>
        </div>
      </header>

      {/* Battle Grid */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Active Battles</h2>
          <p className="text-gray-400">Choose a battle to join and earn rewards!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {battles.map((battle) => (
            <Card key={battle.id} className="bg-[#1a1a1a] border-[#404040] overflow-hidden hover:border-green-500/50 transition-colors">
              <div className="aspect-[4/3] relative">
                <img 
                  src={battle.monster.image} 
                  alt={battle.monster.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-2">{battle.monster.name}</h3>
                </div>
              </div>
              
              <div className="p-4">
                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">
                      <Heart className="w-3 h-3 inline mr-1" />
                      {battle.monster.currentHp.toLocaleString()} / {battle.monster.maxHp.toLocaleString()} HP
                    </span>
                  </div>
                  <Progress 
                    value={getHPPercentage(battle.monster.currentHp, battle.monster.maxHp)} 
                    className="h-2 bg-gray-700"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Players Joined {battle.playersJoined}/{battle.maxPlayers}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleJoinBattle(battle)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Join the Battle
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BattleSystem;