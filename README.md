# 減重計劃日誌

一個以 SDD 流程建立的 PWA Web App，用來記錄每日運動、消耗熱量與完成狀態。

## 目前功能

- 新增、編輯、刪除運動紀錄
- 依日期查看當日運動清單
- 計算當日總熱量、完成數、完成率
- 本地 `localStorage` 儲存
- PWA 安裝與基本離線能力
- 快速新增預設運動

## 啟動方式

```bash
npm install
npm run dev
```

開發伺服器啟動後，通常可在終端輸出的本機網址開啟。

## 驗證指令

```bash
npm test
npm run build
```

## 專案結構

```text
docs/sdd/
  01-idea.md
  02-requirements.md
  03-spec.md
  04-tasks.md

src/
  components/
  data/
  utils/
```

## SDD 文件

- [專案想法](docs/sdd/01-idea.md)
- [需求](docs/sdd/02-requirements.md)
- [技術規格](docs/sdd/03-spec.md)
- [任務拆分](docs/sdd/04-tasks.md)
- [發布清單](docs/sdd/05-release-checklist.md)
- [手動驗收腳本](docs/sdd/06-manual-test-script.md)
- [v1 發布摘要](docs/sdd/07-v1-release-summary.md)
- [同步版架構](docs/sdd/08-sync-architecture.md)
