import pulp
import pulp
import time

# function --------------------------------------------------------------------


def generate_yakiniku_optimization_model():
    # MIP model ---------------------------------------------------------------
    prob = pulp.LpProblem("Yakiniku_Optimization", pulp.LpMaximize)

    # Variables ---------------------------------------------------------------
    # 食材ごとの皿数変数を辞書形式で定義
    food_items = [
        "カルビ", "ロース", "鶏もも", "豚バラ", "ピーマン", "玉ねぎ", "焼き芋", "アイスクリーム", "プリン"
    ]
    x = {item: pulp.LpVariable(f"x_{item}", lowBound=0, cat='Integer')
         for item in food_items}

    # Parameters --------------------------------------------------------------
    # 焼く時間（分/皿）、満腹度、満足度、ビタミン、脂質、サイドメニュー
    params = {
        "カルビ": [2, 20, 50, 2, 15, 0],
        "ロース": [3, 18, 40, 3, 12, 0],
        "鶏もも": [5, 15, 30, 5, 8, 0],
        "豚バラ": [5, 25, 45, 1, 18, 0],
        "ピーマン": [2, 5, 5, 8, 0, 00],
        "玉ねぎ": [1, 6, 12, 6, 0, 0],
        "焼き芋": [7, 10, 0, 4, 2, 1],
        "アイスクリーム": [0, 8, 20, 0, 10, 1],
        "プリン": [0, 12, 15, 0, 8, 1],
    }

    # Objective function ------------------------------------------------------
    # 満足度を最大化
    prob += pulp.lpSum(params[item][2] * x[item]
                       for item in food_items), "Maximize_Satisfaction"

    # Constraints -------------------------------------------------------------
    # 時間制約（120分以内）
    prob += pulp.lpSum(params[item][0] * x[item]
                       for item in food_items if params[item][0] > 0) <= 120, "Time_Constraint"

    # 満腹度制約（100ポイント以内）
    prob += pulp.lpSum(params[item][1] * x[item]
                       for item in food_items) <= 100, "Fullness_Constraint"

    # ビタミン摂取量（20mg以上）
    prob += pulp.lpSum(params[item][3] * x[item]
                       for item in food_items if params[item][3] > 0) >= 20, "Vitamin_Constraint"

    # 脂質摂取量（20g以下）
    prob += pulp.lpSum(params[item][4] * x[item]
                       for item in food_items) <= 20, "Fat_Constraint"

    # 栄養価摂取量（50g以上）
    prob += pulp.lpSum(params[item][5] * x[item]
                       for item in food_items) <= 2, "Nutrition_Constraint"

    return prob, food_items, x


def solve_mip(prob, msg=True, timeLimit=0):
    solver = pulp.PULP_CBC_CMD(msg, timeLimit)
    status = prob.solve(solver)
    return status


def display_result(prob, status, elapsed_time, food_items, x):
    print("=" * 50)
    print("RESULT".center(50, " "))
    print("=" * 50)

    if status == pulp.LpStatusOptimal:
        print("最適解が見つかりました．")
        print("-" * 50)
        print("Optimal Solution:")
        EPS = 1.0e-6  # 表示する変数値の閾値
        for item in food_items:
            if x[item].value() >= EPS:
                print(f"  {item} = {x[item].value():g}皿")  # 各変数の最適解を食品名で表示
        print("-" * 50)
        print(f"Objective Value: {pulp.value(prob.objective):g}")  # 目的関数の値
        print(f"Elapsed time: {elapsed_time:.2f} sec")  # 経過時間を表示
    else:
        print("最適解が見つかりませんでした．")
    print("=" * 50)

# main ------------------------------------------------------------------------


def main():
    # 最適化モデルの生成
    prob, food_items, x = generate_yakiniku_optimization_model()

    # モデルの内容を表示（オプション）
    print(prob)

    # 最適化の実行
    start_time = time.time()  # 開始時間
    status = solve_mip(prob, msg=True, timeLimit=300)
    end_time = time.time()  # 終了時間

    # 結果の表示
    display_result(prob, status, end_time - start_time, food_items, x)


main()
