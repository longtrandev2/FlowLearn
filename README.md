Bản README này được thiết kế để biến dự án **FlowLearn** từ một bản "clone" thông thường thành một dự án cấp độ **Enterprise-ready** trong mắt các nhà tuyển dụng. Nó làm nổi bật các kỹ năng xử lý bất đồng bộ, thuật toán thông minh và tư duy hệ thống của bạn.

---

# FlowLearn — Nền Tảng SaaS Giáo Dục Tích Hợp AI 🚀

**FlowLearn** là một nền tảng SaaS giáo dục hiện đại, tận dụng sức mạnh của Generative AI để cá nhân hóa lộ trình học tập. Hệ thống không chỉ dừng lại ở việc lưu trữ tài liệu mà còn đóng vai trò là một "trợ lý học tập thông minh", tự động hóa việc tóm tắt kiến thức, xây dựng bộ nhớ dài hạn qua thuật toán SRS và cung cấp phản hồi thời gian thực qua công nghệ SSE.

---

## ✨ Tính Năng Cốt Lõi (Key Features)

### 🤖 Hệ Sinh Thái AI Thông Minh

* **Smart Document Processing**: Tự động trích xuất nội dung từ PDF, DOCX, PPTX và lưu trữ an toàn trên **AWS S3/Cloudflare R2**.
* **AI-Generated Materials**: Sử dụng **Google Gemini API** để sinh Tóm tắt, Flashcards, và Quizzes từ tài liệu gốc.
* **Real-time Streaming (SSE)**: Trải nghiệm người dùng mượt mà với kết quả phản hồi từ AI được stream trực tiếp qua **Server-Sent Events**.
* **Context-aware AI Chat**: Hệ thống RAG (Retrieval-Augmented Generation) cho phép người dùng đặt câu hỏi trực tiếp dựa trên nội dung tài liệu.

### 🧠 Thuật Toán & Gamification

* **SRS (Spaced Repetition System)**: Áp dụng thuật toán **SM-2 (SuperMemo-2)** để tối ưu hóa thời gian ôn tập Flashcards dựa trên hiệu suất ghi nhớ của người dùng.
* **Learning Analytics**: Theo dõi tiến độ học tập qua biểu đồ **Weekly Activity** và duy trì động lực với hệ thống **Day Streak**.

### 💳 SaaS & Security

* **Subscription Model**: Phân quyền người dùng (Free/Pro) tích hợp thanh toán qua **Stripe**.
* **Advanced Security**: Bảo mật với **JWT (JSON Web Token)**, xác thực Email và giới hạn truy cập (Rate Limiting) bằng **Redis**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend

* **Framework**: React 18, TypeScript, Vite.
* **Styling**: Tailwind CSS, Shadcn UI.
* **State Management**: TanStack Query (Server state), Zustand (Client state).

### Backend

* **Core**: Java 21, Spring Boot 3.x, Spring Security.
* **Data Access**: Spring Data JPA, Hibernate ORM.
* **Database & Cache**: MySQL 8.x, Redis (Caching & Rate Limiting).
* **AI**: Google Gemini API.

### Infrastructure & 3rd Party

* **Storage**: AWS S3 / Cloudflare R2 (Object Storage).
* **Payments**: Stripe API.
* **Messaging**: Gmail SMTP / Amazon SES (Auth & Notifications).
* **DevOps**: Docker, Docker Compose, GitHub Actions.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture)

FlowLearn được xây dựng theo mô hình **3-Tier Architecture** kết hợp với kiến trúc hướng sự kiện (Event-driven) cho các tác vụ nặng:

1. **Client Side**: React SPA tương tác với API qua mô hình RESTful.
2. **Server Side**: Spring Boot đóng vai trò là Orchestrator, xử lý logic nghiệp vụ và điều phối các dịch vụ AI/Storage.
3. **Async Processing**: Sử dụng `@Async` để xử lý trích xuất file và gọi AI API dưới nền, đảm bảo không gây nghẽn luồng chính.

---

## 🚀 Cài Đặt Nhanh (Quick Start)

Dự án đã được Docker hóa hoàn toàn, cho phép bạn khởi chạy toàn bộ hệ thống (MySQL, Redis, BE, FE) chỉ với một lệnh duy nhất:

```bash
# Clone dự án
git clone https://github.com/yourusername/flowlearn.git

# Khởi chạy môi trường với Docker
docker compose up -d

```

---

## 📚 Tài Liệu Kỹ Thuật (Docs)

Hệ thống tài liệu được duy trì cực kỳ chi tiết tại thư mục `docs/`:

* 🗄️ [Đặc tả Cơ sở dữ liệu (Database Schema)](https://www.google.com/search?q=./docs/3-database-schema.md): ERD, cấu trúc bảng và thuật toán SRS.
* 🔌 [Hợp đồng API (API Specs)](https://www.google.com/search?q=./docs/4-api-specs.md): Đặc tả chi tiết 50+ Endpoints kèm mã lỗi và bảo mật.
* 🤖 [Quy chuẩn AI Agent (CLAUDE.md)](https://www.google.com/search?q=./CLAUDE.md): Hướng dẫn phát triển dành cho AI/Developers.

---

## 📜 Giấy Phép (License)

Dự án được bảo lưu mọi bản quyền. Được phát triển bởi **longtrandev2**.
