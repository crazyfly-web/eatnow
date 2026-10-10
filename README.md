# 今天吃什麼

EatNow 是一個手機優先的單頁餐廳口袋名單。正式網站：https://eatnow.pages.dev

## 專案結構

- `index.html`：頁面、樣式與應用程式邏輯。
- `manifest.json`：加入手機主畫面的 PWA 資訊。
- `_redirects`：Cloudflare Pages 路徑設定。

不需要建置工具或 Google API 金鑰；Cloudflare Pages 的建置指令留空，輸出目錄設為專案根目錄。

## 定位與店家搜尋

- 瀏覽器定位只用來計算附近距離與尋找附近店家。
- 附近店家由 OpenStreetMap Overpass 查詢，包含點、建物面與範圍資料，再按距離排列。
- 店名／地址搜尋使用 OpenStreetMap Nominatim：預設以目前位置限制在直線 25 公里內，並可改為全台搜尋；沒有定位時可輸入縣市或鄉鎮。
- 搜尋結果顯示完整地址與距離，附近範圍內無結果時可一鍵改為全台搜尋。
- 新增或編輯店家時，可在 Leaflet 地圖上拖曳標記或點選店家入口，修正 GPS 或地圖資料的座標。
- 地圖圖磚由 OpenStreetMap 提供。使用附近搜尋或開啟地圖時，位置／地圖瀏覽範圍會傳送給 OpenStreetMap 服務。
- 店家資料存於瀏覽器 IndexedDB，不會同步至雲端；清除瀏覽器網站資料或更換裝置可能無法取回。

## 版本識別

- 首頁最下方顯示日期版本（YYYY.MM.DD-rN）；日期以實際上線日為準，同一天的後續發布遞增 rN。
- 每次發布正式更新時，請同步更新 `index.html` 中的版本標記。

## Google Maps 搜尋與口袋清單

- 搜尋店名時，網站以 Google Places API (New) Text Search 顯示候選分店；搜尋只送出店名及使用者自行輸入的地區，不讀取或傳送瀏覽器 GPS。
- 按「加入清單」即可將正確分店加入本機口袋名單。IndexedDB 只保存 Google Place ID 和使用者自己的收藏設定；店名、地址與座標透過 Place Details 即時取得並留在記憶體，不寫入持久儲存。
- Google Maps 來源的店家顯示 Google Maps attribution 與 Google Maps 連結，不會放到 OpenStreetMap 圖層上。
- Google Places API 金鑰必須設為 Cloudflare Pages 的 Secret，變數名稱為 `GOOGLE_MAPS_API_KEY`；不得寫入 GitHub、HTML 或前端 JavaScript。需要啟用 Places API (New) 與 Google Cloud Billing。搜尋與店家資訊查詢會使用 Google Maps Platform 用量；在啟用前先查看目前價格、API 配額，並設定預算告警。
- 本機開發可在 `.dev.vars` 加入 `GOOGLE_MAPS_API_KEY=...`（此檔必須被 Git 忽略）。

## 主要功能

| 功能 | 說明 |
|---|---|
| 今天吃什麼 | 從口袋名單中抽選 500 公尺或 1 公里內的店家 |
| 換一家 | 在符合條件的店家間切換 |
| 店家搜尋 | 依店名或地址搜尋，再確認或微調座標 |
| 記錄當前位置 | 查詢附近店家，也可手動輸入 |
| 導航與電話 | 開啟地圖導航或撥打店家電話 |
| 口袋名單 | 依距離排序；資料保存在本機 IndexedDB |

## 本機檢查

直接以瀏覽器開啟 `index.html` 即可檢視版面；定位功能需在 HTTPS 網站或 localhost 使用。