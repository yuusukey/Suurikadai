import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const STATUS_MAP = {
  "Optimal": "最適解",
  "Infeasible": "解なし",
  "Unbounded": "解が無限",
  "Undefined": "未定義"
  // 必要に応じて追加
};

function ScriptRunner() {
  const [resultData, setResultData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // 制約の上限
  const MAX_TIME = 120;
  const MAX_SATIETY = 100;
  const MIN_VITAMINS = 5;
  const MAX_FAT = 40;
  const MAX_SIDE_MENU = 2;

  useEffect(() => {
    axios.get('http://localhost:8000/menu/')
      .then(response => setMenuItems(response.data))
      .catch(error => console.error('メニュー取得エラー:', error));
  }, []);

  const runScript = () => {
    axios.post('http://localhost:8000/run_script')
      .then(() => getResult())
      .catch(error => console.error('スクリプト実行エラー:', error));
  };

  const getResult = () => {
    axios.get('http://localhost:8000/get_result')
      .then(response => {
        setResultData(response.data);
      })
      .catch(error => console.error('結果取得エラー:', error));
  };

  const renderResult = () => {
    if (!resultData) return null;

    // ステータス文字列を日本語に置き換え
    const englishStatus = resultData.status || "";
    const localizedStatus = STATUS_MAP[englishStatus] || englishStatus;

    const {
      objective_value,
      elapsed_time_sec,
      chosen_items
    } = resultData;

    // 合計パラメータ計算
    let totalTime = 0;
    let totalSatiety = 0;
    let totalVitamins = 0;
    let totalFat = 0;
    let totalSideMenu = 0;
    let totalSatisfaction = 0;

    const chosenArray = Object.entries(chosen_items || {});
    chosenArray.forEach(([name, count]) => {
      const item = menuItems.find(m => m.name === name);
      if (item) {
        const cookingTimeVal = Number(item.cookingtime || 0);
        const satietyVal = Number(item.satiety || 0);
        const vitaminsVal = Number(item.vitamins || 0);
        const fatVal = Number(item.fatcontent || 0);
        const sideVal = Number(item.nutritionvalue || 0);
        const satisfactionVal = Number(item.satisfaction || 0);

        totalTime += cookingTimeVal * count;
        totalSatiety += satietyVal * count;
        totalVitamins += vitaminsVal * count;
        totalFat += fatVal * count;
        totalSideMenu += sideVal * count;
        totalSatisfaction += satisfactionVal * count;
      }
    });

    // インラインスタイルで Optimal (最適解) のとき背景を緑にするなど
    const isOptimal = (englishStatus === "Optimal");
    const statusStyle = isOptimal
      ? {
          color: "white",
          backgroundColor: "green",
          padding: "5px 10px",
          borderRadius: "5px",
          fontWeight: "bold",
          textShadow: "1px 1px 2px black"
        }
      : {
          color: "black",
          backgroundColor: "#eee",
          padding: "5px 10px",
          borderRadius: "5px"
        };

    return (
      <div>
        <p style={statusStyle}>ステータス: {localizedStatus}</p>
        <p>目的関数値: {objective_value}</p>
        <p>計算時間: {elapsed_time_sec} 秒</p>

        <h3>選ばれたアイテム</h3>
        <ul>
          {chosenArray.map(([name, count], idx) => (
            <li key={idx}>
              {name}: {count}皿
            </li>
          ))}
        </ul>

        <h3>合計パラメータ</h3>
        <p>焼き時間: {totalTime} / {MAX_TIME}</p>
        <p>満腹度: {totalSatiety} / {MAX_SATIETY}</p>
        <p>ビタミン: {totalVitamins} / {MIN_VITAMINS}以上</p>
        <p>脂質: {totalFat} / {MAX_FAT}</p>
        <p>サイドメニュー: {totalSideMenu} / {MAX_SIDE_MENU}</p>
        <p>満足度合計: {totalSatisfaction}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>メニュージェネレータ</h1>
      <p>じぇねれーたー！</p>
      <Link to="/">ホーム画面に戻る</Link>
      <p></p>
      <button onClick={runScript}>スクリプト実行</button>
      {renderResult()}
    </div>
  );
}

export default ScriptRunner;
