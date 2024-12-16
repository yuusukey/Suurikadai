# 注意事項

## フロントエンド環境

1. **依存パッケージのインストール**  
   `yakiniku_app` ディレクトリへ移動して、以下のコマンドを実行してください。
   npm install

2. **開発サーバーの起動**
   `yakiniku_app` ディレクトリで、
   npm start
   を実行することで、フロントエンドの開発サーバーが起動します。

## バックエンド環境
1. **仮想環境の有効化**
   `backend` ディレクトリに、仮想環境を作成します。
   python -m venv .venv

   `backend` ディレクトリにて、`venv` を有効化してください。
   source .venv/bin/activate   
   (Windowsなら .\.venv\Scripts\Activate.ps1)

2. **依存バッケージのインストール**
   `backend` ディレクトリで、以下のコマンドを実行すると `requirements.txt` に記載されたパッケージがインストールされます。
   pip install -r requirements.txt

   新規にインストールしたパッケージを `requirements.txt` に書き出す場合は、
   pip freeze > requirements.txt
   を実行してください。

## データ格納場所
   メニュー情報やその他のデータは、`backend/data` ディレクトリ内の `JSON` ファイルに格納されています。
   このファイルを編集することで、バックエンド経由でフロントエンドにも変更が反映されます。
