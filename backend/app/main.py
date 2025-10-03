from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
import mysql.connector

from .db import get_connection

# Configuración básica
SECRET_KEY = "supersecretkey"  # ⚠️ en producción usar un secreto más seguro
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()

# 🔹 Habilitar CORS para cualquier origen (más fácil)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 acepta cualquier origen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Usuario(BaseModel):
    nombre: str
    email: str
    password: str   # también guardamos contraseña

class Token(BaseModel):
    access_token: str
    token_type: str

# 🔹 Utilidades
def verificar_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def crear_password_hash(password: str):
    return pwd_context.hash(password)

def autenticar_usuario(email: str, password: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return None
    if not verificar_password(password, user["password"]):
        return None
    return user

def crear_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def verificar_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# 🔹 Rutas
@app.get("/")
def root():
    return {"message": "Backend FastAPI funcionando 🚀"}

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = autenticar_usuario(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = crear_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/usuarios")
def get_usuarios(payload: dict = Depends(verificar_token)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nombre, email FROM usuarios")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

@app.post("/usuarios")
def crear_usuario(usuario: Usuario, payload: dict = Depends(verificar_token)):
    try:
        hashed_pw = crear_password_hash(usuario.password)
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)",
            (usuario.nombre, usuario.email, hashed_pw)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Usuario creado con éxito", "usuario": usuario.email}
    except mysql.connector.errors.IntegrityError:
        raise HTTPException(status_code=400, detail=f"El email '{usuario.email}' ya está registrado.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
