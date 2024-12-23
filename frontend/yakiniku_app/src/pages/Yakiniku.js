import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ScriptRunner() {
  const [resultData, setResultData] = useState(null);

  const runScript = () => {
    axios.post('http://localhost:8000/run_script')
      .then(response => {
        console.log(response.data.message);
        // スクリプト実行が完了したら結果取得
        getResult();
      })
      .catch(error => {
        console.error('スクリプト実行エラー:', error);
        alert('スクリプト実行に失敗しました');
      });
  };

  const getResult = () => {
    axios.get('http://localhost:8000/get_result')
      .then(response => {
        console.log('結果取得:', response.data);
        setResultData(response.data);
      })
      .catch(error => {
        console.error('結果取得エラー:', error);
        alert('結果取得に失敗しました');
      });
  };

  return (
    <div>
     <div>
        <h1>メニュージェネレータ</h1>
        <p>じぇねれーたー！</p>
        <Link to="/">ホーム画面に戻る</Link>
      </div>
      <button onClick={runScript}>スクリプト実行</button>
      {resultData && (
        <div>
          <h2>実行結果</h2>
          <pre>{JSON.stringify(resultData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ScriptRunner;