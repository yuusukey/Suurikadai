from fastapi import APIRouter, HTTPException
import subprocess
import sys
from pathlib import Path
import json

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = BASE_DIR / "scripts"
RESULT_PATH = BASE_DIR / "data" / "result.json"

@router.post("/run_script")
def run_script():
    # 実行するスクリプトのパスを先に定義
    script_path = SCRIPTS_DIR / "a.py"

    # ① 同じ仮想環境の python を使いたい場合: sys.executable
    #    (FastAPIを起動している環境と同じPythonを使用)
    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True, 
        text=True
    )
    
    # ② もしくは通常の "python" コマンドを使う場合
    # result = subprocess.run(["python", str(script_path)], capture_output=True, text=True)

    print("returncode:", result.returncode)
    print("stdout:", result.stdout)
    print("stderr:", result.stderr)

    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=f"スクリプト実行失敗: {result.stderr}"
        )

    return {"message": "スクリプト実行完了"}

@router.get("/get_result")
def get_result():
    if not RESULT_PATH.exists():
        raise HTTPException(status_code=404, detail="result.json が見つかりません")
    with open(RESULT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data
