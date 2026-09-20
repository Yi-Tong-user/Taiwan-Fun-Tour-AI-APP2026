# 🇹🇼 Taiwan Fun Tour AI APP 2026 (台灣玩透透 AI 智慧旅遊規劃助手)

基於 **React 19 + TypeScript + Vite + TailwindCSS v4** 與 **Node.js Express + Google Gemini GenAI SDK** 打造的現代化全方位台灣旅遊行程規劃系統。具備高互動地圖、即時 AI 行程生成、交通預估、彈性天數規劃與在地住宿推薦。

---

## 🚀 技術棧 (Tech Stack)

- **前端 (Frontend)**: React 19, TypeScript, Vite 6, TailwindCSS 4, Lucide React, Motion
- **後端 (Backend)**: Express 4, Node.js (v20+), TSX, esbuild
- **AI 引擎 (AI Intelligence)**: Google Gemini API (`@google/genai`)，具備高擬真離線備援演算法 (Curated Fallback Engine)
- **CI/CD 自動化**: GitHub Actions (GitHub Pages 自動部署 + Android APK 打包)

---

## 📦 安裝與快速啟動 (Quick Start)

### 1. 系統需求
- **Node.js**: >= 18.x 或 20.x (推薦 LTS 20)
- **npm**: >= 9.x

### 2. 環境變數設定
複製環境變數範本並填入您的金鑰：
```bash
cp .env.example .env
```
在 `.env` 中設定相關參數：
```env
# Google Gemini API Key (用於生成 AI 行程)
GEMINI_API_KEY="您的_GEMINI_API_KEY"

# Google Maps API Key (可選)
MAPS_API_KEY="您的_MAPS_API_KEY"

# 服務監聽埠號 (預設為 3000)
PORT=3000
```
> 💡 *若未設定 `GEMINI_API_KEY`，系統會自動切換為內建的高擬真行程備援規劃引擎，確保所有景點、交通與住宿功能皆可正常運行與展示。*

### 3. 安裝依賴套件
```bash
npm install
```
*(Windows PowerShell 若遇腳本執行原則受限，可執行 `npm.cmd install` 或以管理員權限設定 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`)*

### 4. 啟動開發環境
```bash
npm run dev
```
啟動後開啟瀏覽器訪問：**`http://localhost:3000`**

---

## 🛠️ 可用指令 (Scripts)

| 指令 | 說明 |
| :--- | :--- |
| `npm run dev` | 啟動開發伺服器（Express 結合 Vite 中間件，支援 API 與 SPA 即時預覽） |
| `npm run build` | 執行完整生產建置（同時編譯 Vite 前端靜態檔與 esbuild 後端伺服器） |
| `npm run build:client` | 僅編譯前端 SPA 靜態檔案（輸出至 `dist/` 目錄） |
| `npm run start` | 啟動生產環境 Node.js 伺服器（需先執行 `npm run build`） |
| `npm run preview` | 預覽前端打包後的靜態結果 |
| `npm run lint` | 執行 TypeScript 型別檢查 (`tsc --noEmit`) |
| `npm run clean` | 跨平台清理 `dist/` 與快取產物 |

---

## 🚀 GitHub Actions 自動化部署 (CI/CD)

本專案已配置完整的 GitHub Actions 工作流，位於 `.github/workflows/`：

### 1. 靜態網頁自動部署 (GitHub Pages)
檔案：`.github/workflows/deploy.yml`

#### 啟用步驟：
1. 將程式碼推送到 GitHub 儲存庫的 `main` 或 `master` 分支。
2. 前往 GitHub Repo 頁面 -> **Settings** -> **Pages**。
3. 在 **Build and deployment** 下方的 **Source** 選擇 **`GitHub Actions`**。
4. 每次 push 到主分支，GitHub Action 將自動執行型別檢查、打包前端並直接發布到專屬 GitHub Pages 網址！
5. 亦可在 **Actions** 頁籤手動觸發 `Deploy to GitHub Pages` 工作流 (workflow_dispatch)。

### 2. Android APK 自動打包 (選用)
檔案：`.github/workflows/android-build.yml`
- 推送至主分支時，自動透過 Gradle 構建 Android APK，並將安裝檔打包為 Artifacts 供下載測試。

---

## 🛡️ 版本控制規範 (.gitignore)

專案已配置完善的 `.gitignore`，已過濾並保護以下內容：
- **相依套件**: `node_modules/`, `jspm_packages/`
- **暫存與建置產物**: `dist/`, `build/`, `.cache/`, `*.log`, `*.tsbuildinfo`
- **敏感金鑰與環境變數**: `.env`, `.env.*`（特別保留 `!.env.example` 供團隊參照）
- **作業系統暫存**: `.DS_Store`, `Thumbs.db`, `Desktop.ini`
- **編輯器設定**: `.idea/`, `.vscode/*`
- **行動裝置與 Gradle 產物**: `.gradle/`, `app/build/`, `*.apk`, `local.properties`

---

## 📁 專案目錄結構

```text
Taiwan-Fun-Tour-AI-APP2026/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages 自動部署工作流
│       └── android-build.yml   # Android APK 建置工作流
├── public/                     # 靜態資源
├── src/
│   ├── components/             # React 介面元件 (地圖、抽屜、彈窗等)
│   ├── data/                   # 縣市清單、精選景點與推薦住宿資料
│   ├── utils/                  # 交通時間推算、AI 提示詞、備援規劃器
│   ├── App.tsx                 # 主應用程式畫面
│   ├── index.css               # TailwindCSS 樣式設定
│   ├── main.tsx                # React Root 入口
│   └── types.ts                # TypeScript 資料型別定義
├── .env.example                # 環境變數範例檔
├── .gitignore                  # Git 忽略清單
├── package.json                # 專案依賴與腳本設定
├── server.ts                   # Express + Vite 整合服務端 (含 Gemini API 路由)
├── tsconfig.json               # TypeScript 編譯設定
└── vite.config.ts              # Vite 構建配置 (支援相對路徑部署)
```
