# 07 v1 Release Summary

## 版本

- `v1.0.0`

## 產品名稱

- `減重計劃日誌`

## 版本定位

- 本地優先的減重與運動紀錄 PWA。
- 聚焦在每日運動紀錄、完成追蹤、基本資料保存與備份。

## 已交付功能

- 新增運動紀錄。
- 編輯運動紀錄。
- 刪除單筆運動紀錄。
- 切換運動完成狀態。
- 依日期查看運動清單。
- 顯示每日總熱量、完成數、完成率。
- 提供預設運動快速填入。
- 提供首次使用引導。
- 支援匯出 JSON 備份。
- 支援匯入 JSON 備份。
- 支援清空指定日期紀錄。
- 支援 PWA manifest 與 service worker。

## 技術實作摘要

- 前端：`React + Vite + TypeScript`
- PWA：`vite-plugin-pwa`
- 本地資料：`localStorage`
- 測試：`Vitest`

## 驗證狀態

- [x] `npm test` 通過
- [x] `npm run build` 通過
- [x] preview 伺服器可正常提供首頁
- [x] `manifest.webmanifest` 可正常存取
- [x] `sw.js` 可正常存取
- [ ] 完整手動驗收仍需依 `06-manual-test-script.md` 執行

## 已知限制

- 本地資料仍使用 `localStorage`，不適合大量資料與高可靠需求。
- 匯入備份為覆蓋策略，不做合併。
- 熱量數值仍由使用者手動輸入。
- 尚未提供登入、同步、圖表、個人化推薦。

## 建議發布條件

- 完成 `06-manual-test-script.md` 的 5 組手測。
- 將 `05-release-checklist.md` 未完成項目勾選完成。
- 若手測無阻塞問題，即可視為 `v1.0.0` 可發布。
