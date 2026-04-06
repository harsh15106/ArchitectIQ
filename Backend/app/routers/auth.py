from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserRegister, UserLogin, Token, RefreshRequest
from app.models.user import UserModel
from app.database import db
from app.utils.auth import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    user_doc = UserModel(email=user.email, hashed_password=hashed)
    res = await db.users.insert_one(user_doc.dict(by_alias=True, exclude_none=True))
    
    user_id = str(res.inserted_id)
    access_token = create_access_token({"sub": user_id, "email": user.email})
    refresh_token = create_refresh_token({"sub": user_id, "email": user.email})
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    user_doc = await db.users.find_one({"email": user.email})
    if not user_doc or not verify_password(user.password, user_doc["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user_id = str(user_doc["_id"])
    access_token = create_access_token({"sub": user_id, "email": user.email})
    refresh_token = create_refresh_token({"sub": user_id, "email": user.email})
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh(req: RefreshRequest):
    payload = decode_token(req.refresh_token)
    user_id = payload.get("sub")
    email = payload.get("email")
    access_token = create_access_token({"sub": user_id, "email": email})
    return {"access_token": access_token, "refresh_token": req.refresh_token, "token_type": "bearer"}
