from fastapi import APIRouter, HTTPException
import subprocess
import json
from pathlib import Path

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = BASE_DIR / "data" / "output.json"


@router.post("/run_script")
def run_script():

    result = subprocess.run(
        ["python", "path/to/script.py"], capture_output=True, text=True)

    if result.returncode != 0:

        raise HTTPException(
            status_code=500, detail=f"スクリプト実行失敗: {result.stderr}")

    if not OUTPUT_PATH.exists():
        raise HTTPException(status_code=500, detail="結果ファイルが生成されていません。")

    return {"message": "スクリプト実行完了"}


@router.get("/get_result")
def get_result():
    if not OUTPUT_PATH.exists():
        raise HTTPException(status_code=404, detail="結果ファイルが存在しません。")

    with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data
