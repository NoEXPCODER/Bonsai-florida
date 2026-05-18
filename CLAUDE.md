# Bonsai Florida — Claude Instructions

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
- `src/config/auth.ts` — owner login credentials + admin PIN (change before going live)
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

### Required Vercel Environment Variable
```
SUPABASE_SERVICE_ROLE_KEY = <from Supabase dashboard → Settings → API>
```

### Branch
All development on: `claude/bonsai-florida-website-XzS9G`
