# FlowLearn — Nền Tảng SaaS Giáo Dục Tích Hợp AI 🚀

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)

FlowLearn là nền tảng SaaS giáo dục tích hợp AI giúp tự động hóa quá trình tổng hợp kiến thức. Người dùng có thể upload tài liệu, hệ thống sẽ tự động trích xuất nội dung và sử dụng AI để tạo ra các bản tóm tắt, bộ thẻ ghi nhớ (Flashcard) và bài trắc nghiệm (Quiz).

---

## ✨ Tính Năng Cốt Lõi (Key Features)

- **📄 Xử lý tài liệu thông minh**: Hỗ trợ upload PDF/DOCX lên AWS S3, trích xuất văn bản dưới nền (Async).
- **🤖 AI Study Materials**: Tích hợp Google Gemini API sinh Tóm tắt, Flashcard, Quiz (Hỗ trợ Server-Sent Events - SSE stream kết quả mượt mà).
- **🧠 Spaced Repetition System (SRS)**: Thuật toán lặp lại ngắt quãng (SM-2) giúp tính toán ngày ôn tập Flashcard tối ưu dựa trên độ khó (Dễ/Khó/Quên).
- **📊 Gamification & Tracking**: Thống kê tiến độ tài liệu, biểu đồ thời gian học trong tuần (Weekly Activity), và duy trì chuỗi ngày học liên tục (Day Streak).
- **💬 Chat với tài liệu**: Trợ lý AI giải đáp thắc mắc dựa trên ngữ cảnh file đã tải lên.
- **💳 Đăng ký & Subscription**: Phân quyền Free/Pro, giới hạn Rate Limit bằng Redis, thanh toán qua Stripe.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React 18, TypeScript, Vite.
- **Styling:** Tailwind CSS, Shadcn UI.
- **State Management:** TanStack Query (Server state), Zustand (Client state).

### Backend
- **Core:** Java 21, Spring Boot 3.x, Spring Web, Spring Security (JWT).
- **Data Access:** Spring Data JPA, Hibernate ORM.
- **Database & Cache:** MySQL 8.x, Redis.
- **AI & Processing:** Google Gemini API.

---

## 📚 Hệ Thống Tài Liệu Kỹ Thuật (Docs)

Dự án được tài liệu hóa chi tiết trong thư mục `docs/` để phục vụ quá trình phát triển và bảo trì hệ thống:

* 🗄️ [Đặc tả Cơ sở dữ liệu (Database Schema)](./docs/3-database-schema.md): ERD, cấu trúc bảng MySQL và quan hệ cho các module User, SRS, Tracking.
* 🔌 [Hợp đồng API (API Specs)](./docs/4-api-specs.md): Đặc tả RESTful API giữa Frontend React và Backend Spring Boot.
* 🤖 [Luật của AI Agent (CLAUDE.md)](./CLAUDE.md): Quy chuẩn code, Naming convention và workflow làm việc dành cho AI.