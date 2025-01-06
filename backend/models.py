from pydantic import BaseModel
from typing import Optional


class MenuItemCreate(BaseModel):
    name: str
    cookingtime: int
    satiety: int
    satisfaction: int
    vitamins: int
    fatcontent: int
    nutritionvalue: int


class MenuItem(MenuItemCreate):
    id: int
