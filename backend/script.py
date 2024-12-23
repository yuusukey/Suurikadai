import json
import os

data_dir = os.path.join('data')
results_path = os.path.join(data_dir, 'results.json')

data = [
    {
        "id": 1,
        "name": "カルビ",
        "plates": 1
    }
]

os.makedirs(data_dir, exist_ok=True)

with open(results_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"JSONファイルを {results_path} に書き込みました。")
