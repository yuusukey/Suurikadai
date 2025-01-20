# 注意事項

## フロントエンド環境

1. **依存パッケージのインストール**

   `yakiniku_app` ディレクトリへ移動して、以下のコマンドを実行してください。
   
   npm install

3. **開発サーバーの起動**

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
   
3. **依存バッケージのインストール**
   
   `backend` ディレクトリで、以下のコマンドを実行すると `requirements.txt` に記載されたパッケージがインストールされます。
   
   pip install -r requirements.txt
   
   先日実行した際に、uvicornのバージョンエラーが発生したため、エラーが発生した場合は適切なバージョンを導入してください。
   
   例
   
   PuLP==2.9.0　→　Pulp
   
   ==〇.〇.〇の部分を削除することで、適切な依存関係のパッケージがインストールされます。

5. **サーバーの立ち上げ**

   下記コマンドを実行することにより、サーバーが立ち上がります。
   
   uvicorn main:app --reload
   
8. **パッケージの追加**

   新規にパッケージをインストールする場合、 `requirements.txt` に書き出すため下記コマンド
   
   pip freeze > requirements.txt
   
   を実行してください。

## データ格納場所
   メニュー情報やその他のデータは、`backend/data` ディレクトリ内の `JSON` ファイルに格納されています。
   
   このファイルを編集することで、バックエンド経由でフロントエンドにも変更が反映されます。
