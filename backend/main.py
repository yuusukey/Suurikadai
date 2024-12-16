from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

app = FastAPI()

@app.get("/menu")
def get_menu():
    with open("data/menu.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
