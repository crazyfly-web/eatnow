# 今天吃什麼 — 網頁版

## 部署到 Vercel（免費）

### 步驟 1：安裝 Vercel CLI
```bash
npm install -g vercel
```

### 步驟 2：填入 Google Places API Key
打開 `index.html`，找到第一行 JavaScript：
```javascript
const GOOGLE_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';
```
把 `YOUR_GOOGLE_PLACES_API_KEY` 換成你的 Key。

### 步驟 3：部署
```bash
cd eatnow-web
vercel
```
按照提示登入 Vercel 帳號（免費註冊），完成後會給你一個網址，例如：
`https://eatnow-abc123.vercel.app`

---

## 加入手機主畫面（像 App 一樣）

**iPhone Safari：**
1. 用 Safari 開啟你的網址
2. 點底部分享按鈕 □↑
3. 選「加入主畫面」
4. 點「新增」

之後就會出現在主畫面，點開就像 App 一樣全螢幕運作！

---

## Google Places API Key 申請

1. 前往 https://console.cloud.google.com
2. 建立新專案
3. APIs & Services → Library → 搜尋「Places API (New)」→ 啟用
4. APIs & Services → Credentials → + Create Credentials → API Key
5. 建議設定 HTTP referrer 限制（只允許你的 vercel 網域）

免費額度：每月 $200 美金抵用金，每次 Nearby Search 約 $0.032，
一般個人使用完全不會超出免費額度。

---

## 功能說明

| 功能 | 說明 |
|------|------|
| 今天吃什麼 | 抓 GPS，從 500m 內的收藏店隨機抽籤 |
| 換一家 | 洗牌後循序切換，不重複 |
| 撥打電話 | 直接撥號 |
| 導航 | iPhone 開 Apple Maps，其他開 Google Maps |
| 記錄當前位置 | Google Places 搜尋附近店家，自動帶入店名電話 |
| 口袋名單 | 依距離排序，長按刪除 |
| 資料儲存 | IndexedDB（本機），不需帳號 |
