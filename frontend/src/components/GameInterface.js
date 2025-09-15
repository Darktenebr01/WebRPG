import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import BattleSystem from './BattleSystem';
import {
  ArrowLeft,
  Sword,
  Shield,
  Crown,
  Gem,
  Coins,
  Package,
  Heart,
  Zap,
  Star,
  Settings,
  Users
} from 'lucide-react';

const GameInterface = ({ onBack }) => {
  const { user } = useAuth();
  const {
    playerEquipment,
    playerInventory,
    equippedPets,
    petInventory,
    playerStats,
    calculateTotalStats,
    equipItem,
    unequipItem
  } = useGame();

  const [activeTab, setActiveTab] = useState('equipment');
  const [showBattle, setShowBattle] = useState(false);
  const { totalAttack, totalDefense } = calculateTotalStats();

  const rarityColors = {
    COMMON: 'text-gray-400',
    RARE: 'text-blue-400',
    EPIC: 'text-purple-400',
    LEGENDARY: 'text-orange-400'
  };

  const EquipmentSlot = ({ slot, item, slotName }) => (
    <div className="bg-[#2a2a2a] border-2 border-[#404040] rounded-lg p-4 aspect-square flex flex-col items-center justify-center min-h-[100px]">
      <div className="text-xs text-gray-400 mb-2">{slotName}</div>
      {item ? (
        <div className="text-center">
          <img src={item.image} alt={item.name} className="w-12 h-12 mx-auto mb-2 rounded" />
          <div className={`text-xs font-medium ${rarityColors[item.rarity]}`}>
            {item.name}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {item.attack && `+${item.attack} ATK`}
            {item.defense && `+${item.defense} DEF`}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => unequipItem(slot)}
            className="mt-2 text-xs h-6"
          >
            Unequip
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-xs text-gray-500">Empty</div>
        </div>
      )}
    </div>
  );

  const InventoryItem = ({ item }) => (
    <div className="bg-[#2a2a2a] border border-[#404040] rounded-lg p-3 hover:bg-[#3a3a3a] transition-colors">
      <img src={item.image} alt={item.name} className="w-12 h-12 mx-auto mb-2 rounded" />
      <div className={`text-sm font-medium ${rarityColors[item.rarity]} text-center`}>
        {item.name}
      </div>
      <div className="text-xs text-gray-500 text-center mt-1">
        {item.attack && `+${item.attack} ATK`}
        {item.defense && `+${item.defense} DEF`}
      </div>
      <Button
        size="sm" 
        variant="outline"
        onClick={() => equipItem(item)}
        className="w-full mt-2 text-xs h-6"
      >
        Equip
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f10]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">Game Interface</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-medium">{playerStats.gold.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Gem className="w-4 h-4" />
              <span className="text-sm font-medium">{playerStats.gems}</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">{playerStats.stamina}/{playerStats.maxStamina}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Interface */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Player Stats */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1a1a1a] border-[#404040] p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Level {playerStats.level}</h3>
                <p className="text-gray-400">{user?.username}</p>
                {user?.isAdmin && (
                  <Badge className="bg-yellow-600 text-white mt-2">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>

              {/* XP Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-gray-400">{playerStats.experience.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${(playerStats.experience / playerStats.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Combat Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Sword className="w-4 h-4 text-red-400" />
                    <span className="text-gray-400">Attack</span>
                  </div>
                  <span className="text-white font-medium">{totalAttack}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Defense</span>
                  </div>
                  <span className="text-white font-medium">{totalDefense}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Stamina</span>
                  </div>
                  <span className="text-white font-medium">{playerStats.stamina}/{playerStats.maxStamina}</span>
                </div>
              </div>

              {/* Equipped Pets */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Active Pets</h4>
                {equippedPets.length > 0 ? (
                  <div className="space-y-2">
                    {equippedPets.map((pet) => (
                      <div key={pet.id} className="bg-[#2a2a2a] p-2 rounded border border-[#404040]">
                        <div className="flex items-center space-x-2">
                          <img src={pet.image} alt={pet.name} className="w-8 h-8 rounded" />
                          <div>
                            <div className={`text-xs font-medium ${rarityColors[pet.rarity]}`}>
                              {pet.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              +{pet.attack} ATK, +{pet.defense} DEF
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No pets equipped</p>
                )}
              </div>
            </Card>
          </div>

          {/* Equipment & Inventory */}
          <div className="lg:col-span-3">
            <Card className="bg-[#1a1a1a] border-[#404040]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-[#2a2a2a] border-b border-[#404040]">
                  <TabsTrigger value="equipment" className="flex-1">Equipment</TabsTrigger>
                  <TabsTrigger value="inventory" className="flex-1">Inventory</TabsTrigger>
                  <TabsTrigger value="pets" className="flex-1">Pets</TabsTrigger>
                  <TabsTrigger value="battle" className="flex-1">Battle</TabsTrigger>
                </TabsList>

                <TabsContent value="equipment" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Equipment</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <EquipmentSlot slot="weapon" item={playerEquipment.weapon} slotName="Weapon" />
                    <EquipmentSlot slot="helmet" item={playerEquipment.helmet} slotName="Helmet" />
                    <EquipmentSlot slot="armor" item={playerEquipment.armor} slotName="Armor" />
                    <EquipmentSlot slot="boots" item={playerEquipment.boots} slotName="Boots" />
                    <EquipmentSlot slot="gloves" item={playerEquipment.gloves} slotName="Gloves" />
                    <EquipmentSlot slot="ring1" item={playerEquipment.ring1} slotName="Ring 1" />
                    <EquipmentSlot slot="ring2" item={playerEquipment.ring2} slotName="Ring 2" />
                    <EquipmentSlot slot="amulet" item={playerEquipment.amulet} slotName="Amulet" />
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Inventory</h3>
                  {playerInventory.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {playerInventory.map((item) => (
                        <InventoryItem key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Your inventory is empty</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pets" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Pet Collection</h3>
                  {petInventory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {petInventory.map((pet) => (
                        <div key={pet.id} className="bg-[#2a2a2a] border border-[#404040] rounded-lg p-4">
                          <img src={pet.image} alt={pet.name} className="w-full h-32 object-cover rounded mb-3" />
                          <h4 className={`font-medium ${rarityColors[pet.rarity]}`}>{pet.name}</h4>
                          <p className="text-gray-400 text-sm mb-2">{pet.description}</p>
                          <div className="text-xs text-gray-500 mb-3">
                            Level {pet.level} • +{pet.attack} ATK • +{pet.defense} DEF
                          </div>
                          <Badge className={pet.isEquipped ? "bg-green-600" : "bg-gray-600"}>
                            {pet.isEquipped ? "Equipped" : "Available"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No pets in your collection</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="battle" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Battle System</h3>
                  <div className="text-center py-12">
                    <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Battle system coming soon!</p>
                    <p className="text-gray-500 text-sm">Prepare your equipment and pets for epic battles.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameInterface;