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
- 店名／地址搜尋使用 OpenStreetMap Nominatim。
- 新增或編輯店家時，可在 Leaflet 地圖上拖曳標記或點選店家入口，修正 GPS 或地圖資料的座標。
- 地圖圖磚由 OpenStreetMap 提供。使用附近搜尋或開啟地圖時，位置／地圖瀏覽範圍會傳送給 OpenStreetMap 服務。
- 店家資料存於瀏覽器 IndexedDB，不會同步至雲端；清除瀏覽器網站資料或更換裝置可能無法取回。

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