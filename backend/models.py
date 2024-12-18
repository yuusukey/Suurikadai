from pydantic import BaseModel
from typing import Optional


class MenuItemBase(BaseModel):
    name: str
    price: int
    satisfaction: int = 0
    description: Optional[str] = None
    category: Optional[str] = None


class MenuItemCreate(MenuItemBase):
    pass


class MenuItem(MenuItemBase):
    id: int
