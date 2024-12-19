from pydantic import BaseModel
from typing import Optional


class MenuItemCreate(BaseModel):
    name: str
    cookingtime: int
    satiety: int
    satisfaction: int
    vitamins: Optional[str] = None
    fatcontent: Optional[str] = None
    nutritionvalue: Optional[str] = None


class MenuItem(MenuItemCreate):
    id: int
