import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from models import User, UserCreate, UserLogin, UserResponse

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def user_to_response(user: User) -> UserResponse:
    """Convert User model to UserResponse"""
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
        is_admin=user.is_admin,
        level=user.level,
        experience=user.experience,
        coins=user.coins,
        gems=user.gems,
        stamina=user.stamina,
        max_stamina=user.max_stamina,
        base_attack=user.base_attack,
        base_defense=user.base_defense,
        base_magic=user.base_magic,
        base_health=user.base_health
    )

