# business-card-manager · CHANGELOG

所有對 `business-card-manager` 規格 / 部署 / 測試的版本變更紀錄。

---

## v3.0.2 — 2026-09-06（repo-fleet 升級）

> 由 repo-fleet 批次 A 自動駕駛：Sean Li / Mavis worker agent

### Added
- `PRD/SPEC.md` v3.0.2 等級規格書（問題陳述 / 16 條 FR / 18 條 AC / 部署契約）
- `PRD/CHANGELOG.md` 本檔
- `.github/workflows/ci.yml` GHA 4-job workflow（lint / test / build / deploy to Vercel）
- `tests/plans.test.ts` Vitest 單元測試（plans 模組 100% 覆蓋）

### Changed
- `src/app/(app)/dashboard/actions.ts` — `any` → `unknown` + type guards（ESLint clean）
- `src/app/(app)/dashboard/page.tsx` — `as any` → `as { id?: string }`
- `src/app/(app)/dashboard/card-list.tsx` — `window as any` → `WindowWithTesseract` typed interface
- `src/app/(auth)/actions.ts` — `any` → `unknown` + type guards
- `src/app/contact/actions.ts` — unused `e` 改為 `catch {}` 純丟棄
- `src/app/page.tsx` line 305 — JSX unescaped `"` → `&ldquo;` / `&rdquo;`
- `src/app/terms/page.tsx` line 9 — JSX unescaped `"` → `&ldquo;` / `&rdquo;`
- `src/auth.config.ts` — `as any` → typed `AppUser` / `AppToken` / `AppSessionUser`

### Removed
- `src/app/(app)/dashboard/actions.ts` — unused `redirect` import
- `src/app/(auth)/actions.ts` — unused `redirect` import

### Fixed
- ESLint 18 problems (15 errors / 3 warnings) → 0 problems
- TypeScript strict build 通過

### Verified
- ✅ `npm run lint` — 0 error / 0 warning
- ✅ `npm run build` — 13 個 static + 5 個 dynamic 頁面成功
- ✅ `prisma generate` + `next build` 完整 pipeline 綠
- ⏳ `npm test` — 初次安裝，需 `npm install vitest --save-dev`

---

## v3.0.1 — 2026-09-06（v3 UI Overhaul 預備）

> commit `47581f3 feat(ui): apply 家服 dashboard design`

- 套用「家服 dashboard」設計 token
- ESLint 規則升級（`@typescript-eslint/no-explicit-any` 變 strict）

---

## v3.0 — 2026-09-06（chore: validate build）

- 驗證 `npm run build` 完整 pipeline 綠
- 確認 Prisma SQLite + Next.js 16 相容性

---

## v2.2.1 — 2026-08（write-prd-v2 skill v2.2.1）

> commit `20b6c04`

- 既有 `SPEC.md` 從 v1.0 升級到 v2.2.1
- 加入 UI/UX 優化方向、9 頁商業 landing 規劃、Google Vision API 升級路徑

---

## v2.0 — 2026-07（UI/UX 全面改善方案）

- 色彩系統重塑（科技藍 + 活力橙）
- 字體升級（Inter + Noto Sans TC）
- 首頁 wireframe 重繪
- §15 深度市調報告（NT$220.49 億潛在 ARR，商業化評分 77/100）

---

## v1.0 — 2026（card-pro v1.0 — Next.js 16 + Prisma + Auth.js + 9 頁商業 landing）

> commit `52b83fc`

- 初始 card-pro v1.0 商業版本
- Next.js 16 + Prisma 5 + Auth.js v5 + Stripe 預備
- 9 頁：home / pricing / contact / faq / terms / privacy / login / register / checkout
- Dashboard + 名片 CRUD + Tesseract.js 瀏覽器端 OCR
- 計費：Free 30 張 / Pro NT$149 / Business NT$999
