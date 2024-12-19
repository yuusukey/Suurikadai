from pathlib import Path
from fastapi import APIRouter, HTTPException, Query
from typing import List
import json
import os

from models import MenuItem, MenuItemCreate

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "menu.json"
PRESETS_DIR = BASE_DIR / "data" / "presets"


def load_menu():
    if not DATA_PATH.exists():
        return []
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
    new_item = {
        "id": new_id,
        "name": item.name,
        "cookingtime": item.cookingtime,
        "satiety": item.satiety,
        "satisfaction": item.satisfaction,
        "vitamins": item.vitamins,
        "fatcontent": item.fatcontent,
        "nutritionvalue": item.nutritionvalue
    }
    menu.append(new_item)
    save_menu(menu)
    return new_item


@router.put("/{item_id}", response_model=MenuItem)
def update_menu_item(item_id: int, updated_item: MenuItemCreate):
    menu = load_menu()
    for m in menu:
        if m["id"] == item_id:
            m["name"] = updated_item.name
            m["cookingtime"] = updated_item.cookingtime
            m["satiety"] = updated_item.satiety
            m["satisfaction"] = updated_item.satisfaction
            m["vitamins"] = updated_item.vitamins
            m["fatcontent"] = updated_item.fatcontent
            m["nutritionvalue"] = updated_item.nutritionvalue
            save_menu(menu)
            return m
    raise HTTPException(status_code=404, detail="Item not found")


@router.delete("/delete_preset")
def delete_preset(name: str = Query(...)):
    preset_path = PRESETS_DIR / f"{name}.json"
    if not preset_path.exists():
        raise HTTPException(status_code=404, detail="指定されたプリセットは存在しません。")

    preset_path.unlink()  # ファイル削除
    return {"message": f"プリセット '{name}' を削除しました。"}


@router.delete("/{item_id}")
def delete_menu_item(item_id: int):
    menu = load_menu()
    for i, m in enumerate(menu):
        if m["id"] == item_id:
            menu.pop(i)
            save_menu(menu)
            return {"message": "Item deleted"}
    raise HTTPException(status_code=404, detail="Item not found")

# 新規追加エンドポイント：プリセット一覧取得


@router.get("/presets")
def list_presets():
    # presetsディレクトリ内の*.jsonファイルを一覧化
    if not PRESETS_DIR.exists():
        return []
    preset_files = [f.stem for f in PRESETS_DIR.glob("*.json")]
    return preset_files

# プリセット適用エンドポイント


@router.post("/apply_preset")
def apply_preset(name: str = Query(..., description="適用するプリセット名")):
    preset_path = PRESETS_DIR / f"{name}.json"
    if not preset_path.exists():
        raise HTTPException(status_code=404, detail="Preset not found")
    with open(preset_path, "r", encoding="utf-8") as f:
        preset_menu = json.load(f)
    # menu.jsonに上書き
    save_menu(preset_menu)
    return {"message": f"プリセット '{name}' が適用されました"}


@router.post("/save_preset")
def save_current_menu_as_preset(name: str):
    # 現在のmenu.jsonを読み込む
    menu = load_menu()
    if not menu:
        raise HTTPException(status_code=400, detail="現在のメニューが空です。")

    # presetsディレクトリがなければ作成
    PRESETS_DIR.mkdir(exist_ok=True)

    preset_path = PRESETS_DIR / f"{name}.json"
    # 既に同名のプリセットが存在するかチェック
    if preset_path.exists():
        raise HTTPException(status_code=400, detail="同名のプリセットがすでに存在します。")

    # 現在のメニューをプリセットとして保存
    with open(preset_path, "w", encoding="utf-8") as f:
        json.dump(menu, f, ensure_ascii=False, indent=2)

    return {"message": f"現在のメニューを'{name}'としてプリセットに保存しました。"}
