from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import random

# Import our models and auth utilities
from models import *
from auth import hash_password, verify_password, create_access_token, verify_token, user_to_response

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="WebRPG API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_data = await db.users.find_one({"id": user_id})
    if user_data is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_data)

# Authentication Routes
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password
    )
    
    # Insert into database
    await db.users.insert_one(user.dict())
    
    return user_to_response(user)

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    # Find user by email
    user_data = await db.users.find_one({"email": login_data.email})
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_data)
    
    # Verify password
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_to_response(user)
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)

# Battle System Routes
@api_router.get("/battles", response_model=List[BattleResponse])
async def get_active_battles(current_user: User = Depends(get_current_user)):
    # Get active battles
    battles_data = await db.battles.find({"state": {"$in": ["waiting", "active"]}}).to_list(100)
    
    battle_responses = []
    for battle_data in battles_data:
        battle = Battle(**battle_data)
        
        # Calculate time left (battles last 1 hour)
        time_left = None
        if battle.start_time:
            elapsed = datetime.utcnow() - battle.start_time
            time_left = max(0, 3600 - int(elapsed.total_seconds()))
        
        # Get user's damage in this battle
        player_damage = battle.player_contributions.get(current_user.id, 0)
        
        battle_responses.append(BattleResponse(
            id=battle.id,
            monster=battle.monster,
            state=battle.state,
            players_joined=len(battle.players_joined),
            max_players=battle.max_players,
            time_left=time_left,
            player_damage=player_damage
        ))
    
    return battle_responses

@api_router.post("/battles/{battle_id}/join")
async def join_battle(battle_id: str, current_user: User = Depends(get_current_user)):
    # Find battle
    battle_data = await db.battles.find_one({"id": battle_id})
    if not battle_data:
        raise HTTPException(status_code=404, detail="Battle not found")
    
    battle = Battle(**battle_data)
    
    # Check if battle is joinable
    if battle.state not in ["waiting", "active"]:
        raise HTTPException(status_code=400, detail="Battle is not joinable")
    
    if len(battle.players_joined) >= battle.max_players:
        raise HTTPException(status_code=400, detail="Battle is full")
    
    # Add user to battle if not already joined
    if current_user.id not in battle.players_joined:
        await db.battles.update_one(
            {"id": battle_id},
            {"$addToSet": {"players_joined": current_user.id}}
        )
        
        # Start battle if this is the first player
        if len(battle.players_joined) == 0:
            await db.battles.update_one(
                {"id": battle_id},
                {"$set": {"state": "active", "start_time": datetime.utcnow()}}
            )
    
    return {"message": "Joined battle successfully"}

@api_router.post("/battles/{battle_id}/attack", response_model=AttackResponse)
async def attack_monster(battle_id: str, current_user: User = Depends(get_current_user)):
    # Check stamina
    if current_user.stamina < 1:
        raise HTTPException(status_code=400, detail="Not enough stamina")
    
    # Find battle
    battle_data = await db.battles.find_one({"id": battle_id})
    if not battle_data:
        raise HTTPException(status_code=404, detail="Battle not found")
    
    battle = Battle(**battle_data)
    
    # Check if battle is active
    if battle.state != "active":
        raise HTTPException(status_code=400, detail="Battle is not active")
    
    # Check if user is in battle
    if current_user.id not in battle.players_joined:
        raise HTTPException(status_code=400, detail="You are not in this battle")
    
    # Calculate damage (base attack + random factor)
    base_damage = current_user.base_attack
    damage_dealt = random.randint(int(base_damage * 0.8), int(base_damage * 1.2))
    
    # Apply damage to monster
    new_monster_health = max(0, battle.monster.current_health - damage_dealt)
    total_damage = battle.total_damage_dealt + damage_dealt
    
    # Update player contribution
    player_contributions = battle.player_contributions.copy()
    player_contributions[current_user.id] = player_contributions.get(current_user.id, 0) + damage_dealt
    
    # Update battle
    await db.battles.update_one(
        {"id": battle_id},
        {
            "$set": {
                "monster.current_health": new_monster_health,
                "total_damage_dealt": total_damage,
                "player_contributions": player_contributions
            }
        }
    )
    
    # Update user stamina
    new_stamina = current_user.stamina - 1
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"stamina": new_stamina}}
    )
    
    # Check if monster is defeated
    battle_completed = new_monster_health <= 0
    experience_gained = 0
    coins_gained = 0
    items_dropped = []
    
    if battle_completed:
        # Mark battle as completed
        await db.battles.update_one(
            {"id": battle_id},
            {"$set": {"state": "completed", "end_time": datetime.utcnow()}}
        )
        
        # Calculate rewards based on contribution
        contribution_percentage = damage_dealt / max(1, battle.monster.max_health)
        experience_gained = int(battle.monster.experience_reward * contribution_percentage)
        coins_gained = int(battle.monster.coin_reward * contribution_percentage)
        
        # Update user stats
        new_experience = current_user.experience + experience_gained
        new_coins = current_user.coins + coins_gained
        
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$set": {
                    "experience": new_experience,
                    "coins": new_coins
                }
            }
        )
    
    return AttackResponse(
        success=True,
        damage_dealt=damage_dealt,
        monster_health_remaining=new_monster_health,
        stamina_remaining=new_stamina,
        experience_gained=experience_gained,
        coins_gained=coins_gained,
        items_dropped=items_dropped,
        battle_completed=battle_completed
    )

# Create a new battle (for testing/admin)
@api_router.post("/battles/create")
async def create_battle(current_user: User = Depends(get_current_user)):
    # Create a random monster
    monster_types = ["Goblin Skirmisher", "Orc Warrior", "Shadow Beast", "Fire Elemental", "Ice Dragon"]
    monster_name = random.choice(monster_types)
    
    monster = Monster(
        name=monster_name,
        type=MonsterType.GOBLIN,  # Default for now
        level=random.randint(1, 10),
        max_health=random.randint(500000, 2000000),
        current_health=0,  # Will be set to max_health
        attack=random.randint(100, 500),
        defense=random.randint(50, 200),
        magic=random.randint(75, 300),
        experience_reward=random.randint(100, 500),
        coin_reward=random.randint(50, 200),
        image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
    )
    monster.current_health = monster.max_health
    
    battle = Battle(
        monster=monster,
        state=BattleState.WAITING
    )
    
    await db.battles.insert_one(battle.dict())
    
    return {"message": "Battle created successfully", "battle_id": battle.id}

# Status check routes (existing)
@api_router.get("/")
async def root():
    return {"message": "WebRPG API is running"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

