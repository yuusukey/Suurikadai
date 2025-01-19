import pulp
import time
import json
from pathlib import Path


def main():
    base_dir = Path(__file__).resolve().parent.parent  # scripts/の親(=backend)
    menu_path = base_dir / "data" / "menu.json"
    result_path = base_dir / "data" / "result.json"

    # 1. menu.json からデータを読み込む
    with open(menu_path, "r", encoding="utf-8") as f:
        menu_data = json.load(f)

    # 2. paramsを作成: {名称: [焼き時間, 満腹度, 満足度, ビタミン, 脂質, サイドメニュー個数]}
    #   ※栄養価欄がサイドメニュー個数という前提
    #   例: "nutritionvalue" → サイドメニューかどうか(0 or 1) のイメージ
    params = {}
    for item in menu_data:
        name = item["name"]
        cooking_time = float(item["cookingtime"])  # 焼き時間
        satiety = float(item["satiety"])          # 満腹度
        satisfaction = float(item["satisfaction"])  # 満足度
        vitamins = float(item["vitamins"])        # ビタミン
        fat = float(item["fatcontent"])           # 脂質
        side_count = float(item["nutritionvalue"])  # サイドメニュー個数(本来は栄養価と呼んでいる欄)

        params[name] = [cooking_time, satiety,
                        satisfaction, vitamins, fat, side_count]

    # 3. PuLPモデル定義 (整数最適化)
    prob = pulp.LpProblem("Yakiniku_Optimization", pulp.LpMaximize)

    # 変数: 各メニュー x[name], Integer
    x = {
        name: pulp.LpVariable(f"x_{name}", lowBound=0, cat="Integer")
        for name in params
    }

    # 4. 目的関数: 満足度合計を最大化
    #    params[name][2] = satisfaction
    prob += pulp.lpSum(params[name][2] * x[name]
                       for name in params), "Maximize_Satisfaction"

    # 5. 制約設定
    # (1) 時間 <= 120
    prob += pulp.lpSum(params[name][0] * x[name]
                       for name in params) <= 120, "Time_Constraint"

    # (2) 満腹度 <= 100
    prob += pulp.lpSum(params[name][1] * x[name]
                       for name in params) <= 100, "Fullness_Constraint"

    # (3) ビタミン >= 20
    prob += pulp.lpSum(params[name][3] * x[name]
                       for name in params) >= 5, "Vitamin_Constraint"

    # (4) 脂質 <= 20
    prob += pulp.lpSum(params[name][4] * x[name]
                       for name in params) <= 40, "Fat_Constraint"

    # (5) サイドメニュー個数(栄養価欄) <= 2
    prob += pulp.lpSum(params[name][5] * x[name]
                       for name in params) <= 2, "SideMenu_Constraint"

    # 6. 求解
    start_time = time.time()
    solver = pulp.PULP_CBC_CMD(msg=True, timeLimit=300)
    status = prob.solve(solver)
    end_time = time.time()

    # 7. 結果をまとめる
    result_status = pulp.LpStatus[status]    # Optimal, Infeasible, etc.
    objective_value = pulp.value(prob.objective)
    chosen_items = {}

    if result_status == "Infeasible":
        # Infeasibleなら chosen_items なし
        pass
    else:
        # 変数値取得
        for name in params:
            val = x[name].varValue
            if val and val > 0:
                chosen_items[name] = int(val)  # 整数変数なのでキャスト

    # 8. result.json に出力
    result_dict = {
        "status": result_status,
        "objective_value": objective_value,
        "elapsed_time_sec": round(end_time - start_time, 2),
        "chosen_items": chosen_items
    }
    with open(result_path, "w", encoding="utf-8") as f:
        json.dump(result_dict, f, indent=2, ensure_ascii=False)

    # コンソール出力(デバッグ用)
    print(json.dumps(result_dict, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
