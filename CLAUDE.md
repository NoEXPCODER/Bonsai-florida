# Bonsai Florida — Claude Instructions

## Core Rules (Karpathy's 4 — apply every session, no exceptions)

1. **Ask, don't assume.** If anything is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.
2. **Simplest solution first.** Implement the simplest thing that works. Do not add abstractions, flexibility, or cleverness that were not explicitly requested.
3. **Don't touch unrelated code.** If a file or function is not directly part of the current task, do not modify it — even if you think it could be improved. Mention it in a note at the end instead.
4. **Flag uncertainty explicitly.** If you are not confident about an approach or technical detail, say so before proceeding. Never fill gaps with plausible-sounding information.

---

## Response Style

- Never open with filler phrases ("Great question!", "Of course!", "Certainly!"). Start with the actual answer.
- Match response length to task complexity. Short question = short answer. Complex task = full detail. Never pad or restate.
- No emojis unless explicitly requested.

---

## Behavior Rules

- Only modify files, functions, and lines directly related to the current task. Flag anything else as a note — never touch it.
- Before any change that significantly alters existing content (rewriting sections, removing code, restructuring): describe what you're about to change and why. Wait for confirmation.
- Before deleting files, overwriting code, dropping DB records, or removing dependencies: list exactly what will be affected and ask for explicit confirmation.
- These require explicit in-session confirmation, no exceptions: pushing to remote, running migrations, sending external API calls, any irreversible command.
- After every coding task, end with: **Files changed** (list every file) / **What was modified** (one line per file) / **Files not touched** / **Follow-up needed**.
- For architecture decisions, complex debugging, or non-trivial features: reason through the problem step by step before writing any code. Show tradeoffs. Flag uncertainty. Then implement.

---

## Memory

- Read `MEMORY.md` at session start if it exists. Never contradict a logged decision without flagging it first.
- When I say "session end", "wrapping up", or "let's stop here": write a session summary to `MEMORY.md` — what was worked on, completed, in progress, decisions made, next priorities.
- Read `ERRORS.md` before suggesting approaches to similar problems. When an approach takes more than 2 attempts, log it there: what didn't work, what worked instead, note for next time.

---

## Tech Stack (always use these — never suggest alternatives unless asked)

- Language: TypeScript (strict)
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS 3
- Database + Storage: Supabase (project: `kezvvfocbpbyykgeohsw`)
- Package manager: npm
- Branch: `claude/bonsai-florida-website-XzS9G`

---

## 7 Bước Viết Prompt Cho Claude 4.7 Mới

### BƯỚC 1 — Xác định rõ phạm vi.
- **Claude cũ (4.6):** Tự đoán ý bạn. Tự điền phần còn thiếu.
- **Claude mới (4.7):** Làm đúng những gì bạn viết. Không suy diễn thêm.

> **PROMPT mẫu:** "Đánh dấu rủi ro trong từng điều khoản. Chấm mức độ nghiêm trọng từ 1–5. Đề xuất cách viết lại cho mỗi điều khoản có rủi ro. Trả kết quả dưới dạng bảng."

---

### BƯỚC 2 — Giới hạn độ dài.
- **Claude cũ (4.6):** Thường trả lời gần như dài như nhau.
- **Claude mới (4.7):** Tự điều chỉnh độ dài theo đầu vào. Tài liệu dài = tóm tắt dài.

> **PROMPT mẫu:** "5 gạch đầu dòng, mỗi dòng dưới 15 từ, mở đầu bằng một động từ hành động."

---

### BƯỚC 3 — Biến mọi yêu cầu thành mệnh lệnh hành động.
- **Claude cũ (4.6):** Hiểu kiểu "đừng dùng biệt ngữ" theo cảm tính.
- **Claude mới (4.7):** Đọc hướng dẫn phủ định qua sát mặt chữ.

> **PROMPT mẫu:** "Dùng ngôn ngữ đơn giản để học sinh 16 tuổi cũng đọc hiểu. Từ ngắn. Danh từ cụ thể."

---

### BƯỚC 4 — Mở đầu bằng động từ.
- **Claude cũ (4.6):** Vẫn chạy ổn với kiểu "bạn có thể giúp tôi..."
- **Claude mới (4.7):** Dễ khung với kiểu mở mềm. Ưu tiên động từ tạo đầu việc rõ ràng.

> **PROMPT mẫu:** "Vào Gmail. Tìm [liên hệ]. Soạn email phản hồi 90 từ."

---

### BƯỚC 5 — Chủ động gọi công cụ.
- **Claude cũ (4.6):** Gọi công cụ liên tục.
- **Claude mới (4.7):** Gọi ít công cụ hơn. Suy luận nhiều hơn giữa các lần gọi.

> **Để ép dùng công cụ:** "Hãy tìm kiếm web thật kỹ. Kiểm chứng mọi thông tin bằng ít nhất 2 nguồn."

---

### BƯỚC 6 — Thiết lập lại giọng điệu.
- **Claude cũ (4.6):** Ấm áp. Kiểu "Câu hỏi rất hay!". Nhiều emoji.
- **Claude mới (4.7):** Trực diện. Ít xác nhận cảm xúc. Gần như không dùng emoji.

> Muốn lấy lại sự ấm áp, hãy dùng 2–3 câu mô tả giọng bạn muốn và yêu cầu Claude bắt đúng nhịp văn phong đó.

---

### BƯỚC 7 — Thêm câu: "vượt lên trên mức cơ bản".
- **Claude cũ (4.6):** Tự vượt khỏi yêu cầu tối thiểu.
- **Claude mới (4.7):** Sẽ dừng ở mức tối thiểu nếu bạn không nói rõ.

> Hãy chèn nguyên văn câu này vào prompt sáng tạo: "Hãy vượt lên trên mức cơ bản. Trình bày chỉn chu như một sản phẩm thực sự giao cho khách hàng."

---

## Project Overview

This is the **Bonsai Florida** website — a tropical bonsai nursery in Palm Beach, Florida.

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 3
- Supabase (database + storage)

### Key Files
- `src/config/contact.ts` — all phone, email, social URLs (edit here to update site-wide)
- `src/config/auth.ts` — owner login credentials for Vietnamese mode only
- `src/lib/admin-auth.ts` — server-only staff admin PIN helper
- `src/messages/en.ts` / `src/messages/vi.ts` — all site text in English and Vietnamese
- `src/lib/session.ts` — staff session helpers (httpOnly cookie, SHA-256 hashing)
- `src/lib/supabase.ts` — public Supabase client (anon key)
- `src/lib/supabase-server.ts` — server-only Supabase client (service role key)

### Important Routes
| Route | Description |
|---|---|
| `/` | Public homepage |
| `/admin` | Staff inventory management (PIN protected) |
| `/admin/devices` | View & revoke remembered devices |
| `/tree/[tree_code]` | Public tree page + staff edit if logged in |

### Required Vercel Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL = https://kezvvfocbpbyykgeohsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <Supabase anon key>
SUPABASE_SERVICE_ROLE_KEY = <from Supabase dashboard → Settings → API>
ADMIN_PIN = <staff/admin PIN>
```

`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PIN` / `STAFF_ADMIN_PIN` are server-only secrets. Never prefix them with `NEXT_PUBLIC_`, never import them into client components, and never log their values.

### Branch
All development on: `claude/bonsai-florida-website-XzS9G`

### Supabase Project
- Project ref: `kezvvfocbpbyykgeohsw`
- URL: `https://kezvvfocbpbyykgeohsw.supabase.co`
- Tables: `bonsai_trees`, `tree_species`, `staff_sessions`, `site_settings`
- Storage bucket: `bonsai-trees` (public)

---

## Context Limit Handoff Rule

**RULE: When context is getting long (>80% full) or you are near credit limit, immediately output a handoff summary before stopping.**

Format the summary exactly like this so any AI (Codex, Claude, Cursor, etc.) can pick up seamlessly:

```
## BONSAI FLORIDA — HANDOFF SUMMARY

### What's built
[bullet list of completed features]

### Current task
[what was being worked on right now, step by step]

### Files changed (not yet committed)
[list any uncommitted changes]

### Blocked on / next step
[exactly what needs to happen next]

### Key credentials & config
- Branch: claude/bonsai-florida-website-XzS9G
- Supabase project: kezvvfocbpbyykgeohsw
- Vercel: bonsai-florida-git-claude-bon-9b4d8a-nathanvan10-1791s-projects.vercel.app
- Admin PIN: set server-side as ADMIN_PIN or STAFF_ADMIN_PIN
- Owner login: thanhvan / bonsai2026
- SUPABASE_SERVICE_ROLE_KEY → must be set in Vercel env vars
```

Always commit and push all changes before the summary so the next session starts from a clean state.
