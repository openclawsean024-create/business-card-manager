# 名片王 - Business Card Manager

## 當前狀態：✅ 已上線（2026-03-26 全面更新）

**網站網址：** https://business-card-manager-bice.vercel.app
**GitHub Pages：** https://openclawsean024-create.github.io/business-card-manager/

## 最新更新 (2026-03-26)
- 🐛 修復：GitHub Pages 與 Vercel 版本同步（兩邊現在完全一致）
- 🐛 修復：圖片上傳壓縮機制 — 新增自動壓縮（最大 800px寬 / JPEG 70%）+ localStorage 容量錯誤處理
- 💡 優化：上傳後顯示圖片大小變化提示
- 💡 優化：localStorage 滿時顯示友善提示

## 功能列表

| 功能 | 狀態 |
|------|------|
| 用戶註冊/登入 | ✅ |
| 名片 CRUD | ✅ |
| AI 名片辨識 (OCR) | ✅ |
| 圖片上傳自動壓縮 | ✅（最大 800px + JPEG 70%，自動避免 localStorage 爆滿） |
| QR Code 分享 | ✅ |
| vCard 匯入匯出 | ✅ |
| 搜尋功能 | ✅ |
| 分類管理 | ✅ |
| 資料存在瀏覽器 (LocalStorage) | ✅ |

## 使用說明

### 1. 註冊帳號
- 打开网站后，点击「註冊」
- 设定帳號和密碼
- 註冊完成后登入

### 2. 新增名片
- 點擊右下角「+」按鈕
- 可選擇：
  - 手動輸入
  - 掃描名片（使用相機拍照辨識）
  - 上傳名片圖片

### 3. 掃描名片
- 點擊相機按鈕 📷
- 對準名片拍照
- 系統會自動辨識文字並填入

### 4. 分享名片
- 點擊名片上的「編輯」
- 點擊分享按鈕
- 可以生成 QR Code 或下載 vCard

---

## 技術細節

- 前端：原生 HTML/CSS/JS
- OCR：Google Vision API (雲端 AI 辨識，95% 準確率，支援繁體中文/英文/日文)
- 儲存：LocalStorage (瀏覽器本地)
- 部署：Vercel + Google Vision API
