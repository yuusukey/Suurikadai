from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from routes.menu import router as menu_router
from routes.script import router as script_router  # 追加

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

app.include_router(menu_router, prefix="/menu", tags=["menu"])
app.include_router(script_router, tags=["script"])
# もし prefix を付けたいなら app.include_router(script_router, prefix="/script", tags=["script"])
