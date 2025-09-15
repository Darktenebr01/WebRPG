from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

# User and Authentication Models
class UserRole(str, Enum):
    PLAYER = "player"
    ADMIN = "admin"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str
    role: UserRole = UserRole.PLAYER
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # Game Stats
    level: int = 1
    experience: int = 0
    coins: int = 1000
    gems: int = 10
    stamina: int = 100
    max_stamina: int = 100
    last_stamina_regen: datetime = Field(default_factory=datetime.utcnow)
    
    # Combat Stats
    base_attack: int = 100
    base_defense: int = 50
    base_magic: int = 75
    base_health: int = 1000

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: UserRole
    is_admin: bool
    level: int
    experience: int
    coins: int
    gems: int
    stamina: int
    max_stamina: int
    base_attack: int
    base_defense: int
    base_magic: int
    base_health: int

# Equipment and Items
class ItemType(str, Enum):
    WEAPON = "weapon"
    ARMOR = "armor"
    ACCESSORY = "accessory"
    CONSUMABLE = "consumable"
    MATERIAL = "material"

class ItemRarity(str, Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"

class Item(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    type: ItemType
    rarity: ItemRarity
    level_requirement: int = 1
    
    # Stats bonuses
    attack_bonus: int = 0
    defense_bonus: int = 0
    magic_bonus: int = 0
    health_bonus: int = 0
    
    # Market value
    base_price: int = 100
    sell_price: int = 50

class PlayerInventory(BaseModel):
    user_id: str
    items: Dict[str, int] = {}  # item_id -> quantity
    equipped_items: Dict[str, str] = {}  # slot -> item_id
    max_slots: int = 50

# Battle System
class MonsterType(str, Enum):
    GOBLIN = "goblin"
    ORC = "orc"
    DRAGON = "dragon"
    UNDEAD = "undead"
    ELEMENTAL = "elemental"

class Monster(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: MonsterType
    level: int
    max_health: int
    current_health: int
    attack: int
    defense: int
    magic: int
    
    # Rewards
    experience_reward: int
    coin_reward: int
    possible_drops: List[str] = []  # item_ids
    
    # Visual
    image_url: Optional[str] = None

class BattleState(str, Enum):
    WAITING = "waiting"
    ACTIVE = "active"
    COMPLETED = "completed"

class Battle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    monster: Monster
    state: BattleState = BattleState.WAITING
    players_joined: List[str] = []  # user_ids
    max_players: int = 20
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Battle progress
    total_damage_dealt: int = 0
    player_contributions: Dict[str, int] = {}  # user_id -> damage_dealt

class BattleAction(BaseModel):
    battle_id: str
    user_id: str
    damage_dealt: int
    stamina_used: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Quest System
class QuestType(str, Enum):
    KILL_MONSTERS = "kill_monsters"
    COLLECT_ITEMS = "collect_items"
    REACH_LEVEL = "reach_level"
    DAILY = "daily"
    WEEKLY = "weekly"

class QuestStatus(str, Enum):
    AVAILABLE = "available"
    ACTIVE = "active"
    COMPLETED = "completed"
    CLAIMED = "claimed"

class Quest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: QuestType
    requirements: Dict[str, Any] = {}  # flexible requirements
    rewards: Dict[str, int] = {}  # reward_type -> amount
    level_requirement: int = 1
    is_repeatable: bool = False
    duration_hours: Optional[int] = None  # for daily/weekly quests

class PlayerQuest(BaseModel):
    user_id: str
    quest_id: str
    status: QuestStatus = QuestStatus.AVAILABLE
    progress: Dict[str, int] = {}  # requirement_key -> current_value
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

# Game Events and Logs
class GameEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    event_type: str
    description: str
    data: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# API Response Models
class BattleResponse(BaseModel):
    id: str
    monster: Monster
    state: BattleState
    players_joined: int
    max_players: int
    time_left: Optional[int] = None  # seconds
    player_damage: int = 0  # current user's damage in this battle

class AttackResponse(BaseModel):
    success: bool
    damage_dealt: int
    monster_health_remaining: int
    stamina_remaining: int
    experience_gained: int = 0
    coins_gained: int = 0
    items_dropped: List[Item] = []
    battle_completed: bool = False

# Status and Health Check
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

