import React from 'react';
import { useStamina } from '../contexts/StaminaContext';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Zap, Clock, Timer } from 'lucide-react';

const StaminaDisplay = ({ variant = 'full' }) => {
  const { 
    stamina, 
    maxStamina, 
    getFormattedTimeUntilRegen, 
    getTimeUntilNextRegen,
    REGEN_AMOUNT 
  } = useStamina();

  const staminaPercentage = (stamina / maxStamina) * 100;
  const isLowStamina = stamina < maxStamina * 0.2;
  const isMediumStamina = stamina < maxStamina * 0.5;

  // Compact version for headers
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Zap className={`w-4 h-4 ${isLowStamina ? 'text-red-400' : isMediumStamina ? 'text-yellow-400' : 'text-green-400'}`} />
          <span className="text-sm font-medium text-white">
            {stamina}/{maxStamina}
          </span>
        </div>
        {stamina < maxStamina && (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Timer className="w-3 h-3" />
            <span>{getFormattedTimeUntilRegen()}</span>
          </div>
        )}
      </div>
    );
  }

  // Full card version
  return (
    <Card className="bg-[#1a1a1a] border-[#404040] p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className={`w-5 h-5 ${isLowStamina ? 'text-red-400' : isMediumStamina ? 'text-yellow-400' : 'text-green-400'}`} />
            <h3 className="text-white font-semibold">Stamina</h3>
          </div>
          <Badge 
            className={`${
              isLowStamina 
                ? 'bg-red-600 text-white' 
                : isMediumStamina 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-green-600 text-white'
            }`}
          >
            {stamina}/{maxStamina}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={staminaPercentage} 
            className="h-3 bg-gray-700"
            style={{
              '--progress-background': isLowStamina 
                ? 'linear-gradient(90deg, #dc2626, #ef4444)' 
                : isMediumStamina 
                  ? 'linear-gradient(90deg, #d97706, #f59e0b)' 
                  : 'linear-gradient(90deg, #16a34a, #22c55e)'
            }}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{staminaPercentage.toFixed(1)}%</span>
            <span>{stamina < maxStamina ? 'Regenerating...' : 'Full'}</span>
          </div>
        </div>

        {/* Regeneration Info */}
        {stamina < maxStamina && (
          <div className="bg-[#2a2a2a] rounded-lg p-3 border border-[#404040]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Next Regeneration</span>
              </div>
              <span className="text-sm font-mono text-blue-400">
                {getFormattedTimeUntilRegen()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              +{REGEN_AMOUNT} stamina every 10 minutes
            </div>
          </div>
        )}

        {/* Status Messages */}
        {isLowStamina && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span className="text-red-300 text-sm">Low stamina! Consider waiting for regeneration.</span>
            </div>
          </div>
        )}

        {stamina === maxStamina && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✅</span>
              <span className="text-green-300 text-sm">Stamina is full! Ready for battle.</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StaminaDisplay;

