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

- 首頁最下方顯示日期版本（YYYY.MM.DD），用來確認目前載入的網站版本。
- 每次發布正式更新時，請同步更新 `index.html` 中版本日期；日期以實際上線日為準。

## Google Maps 搜尋

- 搜尋視窗提供 Google Maps 搜尋連結，可把店名與目前位置傳到 Google Maps 查看同名分店；此連結不需要 API 金鑰，也不會把 Google Maps 候選資料帶回 EatNow。
- 若改成在 EatNow 內顯示 Google Places 搜尋結果，應透過 Cloudflare Pages Function 呼叫 Places API，將金鑰存為伺服器端 Secret，並設定 API 限制、配額與預算告警。
- Places API 有資料保存與地圖呈現規範；目前 EatNow 將店家資料存在 IndexedDB 並用 Leaflet/OpenStreetMap 顯示，因此不能直接長期保存 Google 回傳的地址／座標或把它顯示在 OSM 地圖上。Place ID 可保存，完整整合前需設計符合規範的資料流程。

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