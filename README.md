# ♨ 史萊姆溫泉度假村

可愛療癒的網頁掛機遊戲：經營溫泉、撈溫泉幣、收集稀有史萊姆，幫史萊姆取名字、換裝，舉辦溫泉祭！

- 純 HTML / CSS / JavaScript，單一 `index.html`，不需要安裝任何東西
- 支援手機，可以「加到主畫面」當 App 玩（PWA），離線也能玩
- 進度自動存在瀏覽器，可在設定中匯出 / 匯入存檔碼
- 支援繁體中文 / English / 日本語（第一次開啟依瀏覽器語言自動選擇，設定中可切換）
- 新玩家會有新手教學，設定中可以重看；背景音樂與音效可分別調整音量

## 檔案說明

| 檔案 | 用途 |
|---|---|
| `index.html` | 遊戲本體 |
| `bgm.mp3` | 背景音樂 |
| `manifest.json` | PWA 設定（App 名稱、圖示） |
| `sw.js` | Service Worker（離線快取） |
| `icons/` | App 圖示（`icon.svg` 是原始檔） |
| `.nojekyll` | 讓 GitHub Pages 直接提供原始檔案 |

## 發佈到 GitHub Pages

1. 在 GitHub 建立一個新的 **Public** repository（例如 `slime-onsen`）
2. 把這個資料夾推上去：
   ```bash
   git remote add origin https://github.com/<你的帳號>/slime-onsen.git
   git push -u origin main
   ```
3. 到 repository 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main` / `(root)`，按 Save
4. 約 1～2 分鐘後，網址會是 `https://<你的帳號>.github.io/slime-onsen/`

## 更新遊戲時

修改內容後，請把 `sw.js` 最上面的 `CACHE` 版本號改掉（例如 `v2.0.0` → `v2.0.1`），
已經玩過或安裝成 App 的玩家才會拿到新版。

## 測試小技巧

- 在網址後面加 `?season=spring`、`summer`、`autumn`、`winter`、`xmas` 可以強制切換季節活動
- 直接雙擊 `index.html` 也能玩，但 PWA（安裝、離線）只在 https 網址（GitHub Pages）上有效

## 素材來源

- 背景音樂：「Japanese Calm Piano」by pianocafe_kumi（Pixabay）
  — 請依 [Pixabay 授權條款](https://pixabay.com/service/license-summary/) 使用
