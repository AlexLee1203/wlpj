# 08 Sync Architecture

## 目標

- 讓手機與電腦在登入同一帳號後，共用同一份運動紀錄。
- 將目前 `localStorage` 單機版升級為雲端同步版。

## 技術選型

- 認證：`Supabase Auth`
- 資料庫：`Supabase Postgres`
- 即時同步：`Supabase Realtime`
- 前端 SDK：`@supabase/supabase-js`

依據 Supabase 官方文件：
- Auth 使用 JWT 驗證登入狀態。
- JavaScript SDK 提供 `select / insert / update / delete`。
- Realtime 可監聽 Postgres 變更並同步到前端。

參考：
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript update](https://supabase.com/docs/reference/javascript/update)
- [Supabase Realtime Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)

## 同步版核心改動

### 現況

- 真實資料來源：`localStorage`
- 啟動時：從本地讀取
- 修改時：寫回本地

### 目標狀態

- 真實資料來源：Supabase `exercise_logs` 資料表
- 啟動時：登入後依 `user_id` 查詢資料
- 修改時：先寫入 Supabase，再更新前端狀態
- 同步時：用 Realtime 監聽 `exercise_logs` 變更

## 資料表設計

### `exercise_logs`

```sql
create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  calories_burned integer not null check (calories_burned >= 0),
  completed boolean not null default false,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 權限與 RLS

```sql
alter table public.exercise_logs enable row level security;

create policy "Users can read their own logs"
on public.exercise_logs
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own logs"
on public.exercise_logs
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own logs"
on public.exercise_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own logs"
on public.exercise_logs
for delete
to authenticated
using (auth.uid() = user_id);
```

## 前端結構調整

- `src/lib/supabase.ts`
  - 建立 Supabase client
- `src/features/logs/supabaseLogs.ts`
  - 封裝 logs CRUD 與 Realtime 訂閱
- `src/features/auth/`
  - 後續可加入登入、登出、session 管理

## 遷移策略

### 第一階段

- 保留目前 `localStorage` 版本可運作
- 新增 Supabase 骨架與資料存取層
- 不直接切斷舊流程

### 第二階段

- 加入登入 UI
- 改用雲端查詢與寫入
- 可選擇首次登入時將 `localStorage` 匯入雲端

### 第三階段

- 加入 Realtime 訂閱
- 完成手機與電腦即時同步

## 風險

- 若直接從本地切到雲端而沒有登入流程，資料歸屬會不清楚。
- 若同時做離線優先與即時同步，衝突處理會明顯變複雜。
- 若沒有做好 RLS，資料會有越權風險。

## 本輪輸出

- Supabase 環境變數範本
- Supabase client 骨架
- exercise logs repository 骨架
- 同步版 SDD 文件
