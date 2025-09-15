import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Heart, Users, Sword, Clock, Star } from 'lucide-react';

const EnhancedBattleCard = ({ battle, onJoinBattle, isSelected = false }) => {
  const getHPPercentage = (current, max) => {
    return (current / max) * 100;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRarityColor = (level) => {
    if (level >= 10) return 'from-orange-500 to-red-500'; // Legendary
    if (level >= 7) return 'from-purple-500 to-pink-500'; // Epic
    if (level >= 4) return 'from-blue-500 to-cyan-500'; // Rare
    return 'from-gray-500 to-gray-600'; // Common
  };

  const getRarityBorder = (level) => {
    if (level >= 10) return 'border-orange-500/50'; // Legendary
    if (level >= 7) return 'border-purple-500/50'; // Epic
    if (level >= 4) return 'border-blue-500/50'; // Rare
    return 'border-gray-500/50'; // Common
  };

  return (
    <Card className={`bg-[#1a1a1a] border-2 ${getRarityBorder(battle.monster.level)} overflow-hidden hover:scale-105 transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Monster Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={battle.monster.image} 
          alt={battle.monster.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`bg-gradient-to-r ${getRarityColor(battle.monster.level)} text-white font-bold px-3 py-1`}>
            <Star className="w-3 h-3 mr-1" />
            LV {battle.monster.level}
          </Badge>
        </div>

        {/* Time Remaining */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/60 text-white backdrop-blur-sm">
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(battle.timeLeft)}
          </Badge>
        </div>

        {/* Monster Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg mb-1">{battle.monster.name}</h3>
        </div>
      </div>

      {/* Battle Info */}
      <div className="p-4 space-y-4">
        {/* HP Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-1 text-red-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">
                {battle.monster.currentHp.toLocaleString()} / {battle.monster.maxHp.toLocaleString()} HP
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {getHPPercentage(battle.monster.currentHp, battle.monster.maxHp).toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={getHPPercentage(battle.monster.currentHp, battle.monster.maxHp)} 
            className="h-2 bg-gray-700"
          />
        </div>

        {/* Players Joined */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">Players Joined {battle.playersJoined}/{battle.maxPlayers}</span>
          </div>
          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(battle.playersJoined / battle.maxPlayers) * 100}%` }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#404040]">
          <div className="text-xs text-gray-400 mb-1">Exp & Gold Rewards up to LV 100</div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-400">+{battle.rewards.experience} EXP</span>
            <span className="text-yellow-400">+{battle.rewards.gold} Gold</span>
          </div>
        </div>

        {/* Join Button */}
        <Button 
          onClick={() => onJoinBattle(battle)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2"
        >
          <Sword className="w-4 h-4 mr-2" />
          Join the Battle
        </Button>
      </div>
    </Card>
  );
};

export default EnhancedBattleCard;

