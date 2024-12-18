from pathlib import Path
from fastapi import APIRouter, HTTPException
from typing import List
import json
import os


from models import MenuItem, MenuItemCreate

router = APIRouter()


# main.pyがbackendにあれば、parentでbackendの1つ上
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "menu.json"


def load_menu():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_menu(menu):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(menu, f, ensure_ascii=False, indent=2)


@router.get("/", response_model=List[MenuItem])
def get_menu():
    menu = load_menu()
    return menu


@router.post("/", response_model=MenuItem)
def create_menu_item(item: MenuItemCreate):
    menu = load_menu()
    new_id = max([m["id"] for m in menu]) + 1 if menu else 1
    new_item = {"id": new_id, **item.dict()}
    menu.append(new_item)
    save_menu(menu)
    return new_item


@router.put("/{item_id}", response_model=MenuItem)
def update_menu_item(item_id: int, updated_item: MenuItemCreate):
    menu = load_menu()
    for m in menu:
        if m["id"] == item_id:
            m["name"] = updated_item.name
            m["price"] = updated_item.price
            m["satisfaction"] = updated_item.satisfaction
            m["description"] = updated_item.description
            m["category"] = updated_item.category
            save_menu(menu)
            return m
    raise HTTPException(status_code=404, detail="Item not found")


@router.delete("/{item_id}")
def delete_menu_item(item_id: int):
    menu = load_menu()
    for i, m in enumerate(menu):
        if m["id"] == item_id:
            menu.pop(i)
            save_menu(menu)
            return {"message": "Item deleted"}
    raise HTTPException(status_code=404, detail="Item not found")
