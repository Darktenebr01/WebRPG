import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStamina } from '../contexts/StaminaContext';
import { GameProvider } from '../contexts/GameContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import GameInterface from './GameInterface';
import StaminaDisplay from './StaminaDisplay';
import {
  Search,
  User,
  Menu,
  Coins,
  Gem,
  Sword,
  Shield,
  Zap,
  Trophy,
  Settings,
  LogOut,
  Play,
  BookOpen,
  Crown,
  Users,
  Database
} from 'lucide-react';

const GameDashboard = () => {
  const { user, logout } = useAuth();
  const { stamina, maxStamina, getFormattedTimeUntilRegen } = useStamina();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // Mock game data - use admin stats if admin user
  const gameData = {
    title: "WebRPG: Gates of Eclipse",
    description: "In the shadow between worlds... something ancient has awakened.",
    backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop",
    playerStats: {
      level: user?.level || 25,
      experience: user?.experience || 75640,
      nextLevelXp: user?.isAdmin ? 999999 : 80000,
      coins: user?.coins || 12450,
      gems: user?.gems || 89,
      power: user?.isAdmin ? 9999 : 2847,
      defense: user?.isAdmin ? 9999 : 1923,
      magic: user?.isAdmin ? 9999 : 3156
    }
  };

  const recentAchievements = [
    { id: 1, title: "Eclipse Seeker", description: "Completed first eclipse quest", reward: "500 XP" },
    { id: 2, title: "Shadow Walker", description: "Mastered stealth abilities", reward: "50 Gems" },
    { id: 3, title: "Ancient Guardian", description: "Defeated the ancient boss", reward: "1000 Coins" }
  ];

  const handleStartGame = () => {
    setShowGame(true);
  };

  const handleReadLore = () => {
    alert(`🌌 Welcome to WebRPG: Gates of Eclipse!

🌌 This is a realm on the edge of annihilation.

✨ Random magical gates appear here. Each gate links to another world. Monsters from those realms will try to invade with their armies — your task is to clear the enemy waves.

⚔️ To fight monsters, you need stamina:

💫 Hourly Refill: Every player gets 20 stamina every hour.
💎 Hourly Refill: Every player receives 1 gems every hour.

You can farm +2 stamina once per chapter. Capped at 1000 stamina / day

💎 Monsters drop items, crafting materials, and equipment that will prove very useful in your journey.

🔨 Visit the Blacksmith to craft extremely powerful equipment.

🐾 Don't forget to equip your pets and equipment — they will greatly increase your damage output!`);
  };

  if (showGame) {
    return (
      <GameProvider>
        <GameInterface onBack={() => setShowGame(false)} />
      </GameProvider>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-sm font-bold">W</div>
              </div>
              <span className="text-white text-xl font-semibold">WebRPG</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Resources */}
            <div className="flex items-center space-x-2 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-medium">{gameData.playerStats.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Gem className="w-4 h-4" />
              <span className="text-sm font-medium">{gameData.playerStats.gems}</span>
            </div>
            <StaminaDisplay variant="compact" />

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">{user?.username}</span>
              <Badge className="bg-blue-600 text-xs">Lv.{gameData.playerStats.level}</Badge>
              {user?.isAdmin && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>

            <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Hero Section */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#404040] overflow-hidden">
              {/* Background Image */}
              <div 
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${gameData.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{gameData.title}</h1>
                  <p className="text-gray-300 text-lg">{gameData.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6">
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play Game
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReadLore}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Lore
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-[#1a1a1a] border-[#404040] mt-6">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Achievements</h3>
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-[#404040]">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{achievement.title}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">{achievement.reward}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Player Level & XP */}
            <Card className="bg-[#1a1a1a] border-[#404040] p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">Level {gameData.playerStats.level}</h3>
                <p className="text-gray-400">{user?.username}</p>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">XP</span>
                  <span className="text-gray-400">{gameData.playerStats.experience.toLocaleString()} / {gameData.playerStats.nextLevelXp.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(gameData.playerStats.experience / gameData.playerStats.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Combat Stats */}
            <Card className="bg-[#1a1a1a] border-[#404040] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Power</p>
                  <p className="text-2xl font-bold text-white">{gameData.playerStats.power.toLocaleString()}</p>
                </div>
                <Sword className="w-8 h-8 text-red-400" />
              </div>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#404040] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Defense</p>
                  <p className="text-2xl font-bold text-white">{gameData.playerStats.defense.toLocaleString()}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#404040] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Magic</p>
                  <p className="text-2xl font-bold text-white">{gameData.playerStats.magic.toLocaleString()}</p>
                </div>
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </Card>

            {/* Stamina Display */}
            <StaminaDisplay />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDashboard;