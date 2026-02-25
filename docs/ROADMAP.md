# FlowLearn - Roadmap phát triển (3 tuần)

## 📋 Thông tin dự án

| Mục | Chi tiết |
|---|---|
| **Loại** | Project cá nhân (đồ án trường) |
| **Thời gian** | 3 tuần |
| **Quy mô** | < 100 users |
| **AI hỗ trợ code** | Có (Copilot / ChatGPT) |
| **Mục tiêu** | Hoàn thành đủ tính năng cốt lõi SRS, chạy được, demo được |
| **Nâng cấp sau** | Có — thiết kế mở rộng được |

---

## 🛠️ Tech Stack

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| **Frontend** | React 18 + Vite + TypeScript | Đã setup sẵn |
| **UI** | Tailwind CSS + shadcn/ui | Đã có components |
| **State** | Zustand | Đã có `useAuthStore` |
| **Backend** | Java Spring Boot 3.x | REST API |
| **ORM** | Spring Data JPA + Hibernate | MySQL mapping |
| **Auth** | JWT (Access + Refresh Token) | Spring Security |
| **Database** | MySQL 8.x (InnoDB) | 13 bảng (xem DATABASE_DESIGN.md) |
| **AI** | Google Gemini 2.0 Flash API | Summary, Quiz, Flashcard, Feedback |
| **File Storage** | Local (dev) / Cloudflare R2 (prod) | PDF, DOCX files |
| **Text Extract** | Apache PDFBox + Apache POI | PDF/DOCX → text |
| **FE Deploy** | Vercel | Free tier |
| **BE Deploy** | Railway / Render | Free tier |
| **DB Deploy** | Railway MySQL / Aiven | Free tier |

---

## 📊 Tổng quan 3 tuần

```
Tuần 1: Frontend (tất cả trang + mock data)
Tuần 2: Backend (Spring Boot API + MySQL + File upload)
Tuần 3: AI Integration (Gemini) + Deploy + Fix bugs
```

> **Chiến lược:** FE hoàn chỉnh trước với mock data → BE API → Kết nối FE-BE → Tích hợp AI cuối cùng.
> Dùng AI (Copilot/ChatGPT) để tăng tốc code boilerplate, CRUD, và prompt engineering.

---

## 📅 TUẦN 1: Frontend (Ngày 1-7)

### Mục tiêu tuần 1
- [x] Setup routing hoàn chỉnh
- [ ] Hoàn thành tất cả trang UI
- [ ] Mock data cho mọi component
- [ ] Responsive cơ bản (desktop-first)

---

### Ngày 1-2: Auth + Layout + Landing

**Ưu tiên: Cao** | **Ước lượng: ~6-8h**

#### Tasks:
- [ ] **Landing Page** — Hero section, features, CTA
  - File: `src/pages/LandingPage.tsx` (đã có)
  - Nội dung: giới thiệu FlowLearn, nút "Bắt đầu học"
  
- [ ] **Login Page** — Form email + password
  - File: `src/pages/LoginPage.tsx` (đã có)
  - Component: `src/features/auth/components/LoginForm.tsx` (đã có)
  - Validation: email format, password min 6 ký tự
  
- [ ] **Register Page** — Form đăng ký
  - File: `src/pages/RegisterPage.tsx` (đã có)
  - Component: `src/features/auth/components/RegisterForm.tsx` (đã có)
  - Fields: username, email, password, confirm password
  
- [ ] **MainLayout** — Header + Sidebar + Content area
  - File: `src/layouts/MainLayout.tsx` (đã có)
  - Sidebar: navigation links (Overview, Library, Study)
  - Header: user avatar, notifications bell, logout

- [ ] **ProtectedRoute** — Redirect nếu chưa login
  - File: `src/layouts/ProtectedRoute.tsx` (đã có)
  - Mock: `useAuthStore` giả lập trạng thái login

- [ ] **Router setup** — Tất cả routes
  - File: `src/app/router.tsx` (đã có)

```tsx
// Routes cần có:
'/'                    → LandingPage
'/login'               → LoginPage
'/register'            → RegisterPage
'/overview'            → OverviewPage (protected)
'/library'             → LibraryPage (protected)
'/library/:datasetId'  → DatasetDetailsPage (protected)
'/study/:documentId'   → StudyPage (protected)
```

#### Deliverable:
✅ User có thể navigate: Landing → Login/Register → Overview (with mock auth)

---

### Ngày 3-4: Overview + Library (Dataset Management)

**Ưu tiên: Cao** | **Ước lượng: ~8-10h**

#### Tasks:
- [ ] **Overview Page** — Dashboard tổng quan
  - File: `src/pages/OverviewPage.tsx` (đã có)
  - Components cần:
    - `RealtimeClock.tsx` ✅ — Đồng hồ + lời chào
    - `StreakCard.tsx` ✅ — Hiển thị streak (mock: 5 ngày)
    - `StudyChart.tsx` ✅ — Chart tiến trình tuần (mock data)
    - `RecentDocuments.tsx` ✅ — 5 tài liệu gần nhất
    - `DocumentCard.tsx` ✅ — Card hiển thị 1 document

- [ ] **Library Page** — Quản lý datasets (SRS UC-02)
  - File: `src/pages/LibraryPage.tsx` (CẦN TẠO)
  - Components:
    - `DatasetCard.tsx` — Card dataset (tên, số documents, màu)
      > Đổi tên từ `FolderCard.tsx` → `DatasetCard.tsx`
    - `CreateDatasetModal.tsx` — Tạo dataset mới (tên + mô tả + màu)
      > Đổi tên từ `CreateFolderModal.tsx` → `CreateDatasetModal.tsx`
    - `EmptyLibrary.tsx` ✅ — Trạng thái rỗng
  - Mock data: 3-4 datasets với documents

- [ ] **Dataset Details Page** — Xem documents trong dataset
  - File: `src/pages/DatasetDetailsPage.tsx` (CẦN TẠO — đổi từ FolderDetailsPage)
  - Hiển thị: danh sách documents, nút upload, nút xóa
  - Component: `UploadModal.tsx` ✅ — Modal upload file (drag & drop)

#### Deliverable:
✅ Overview hiển thị mock data, Library hiển thị datasets, có thể tạo dataset + upload file (mock)

---

### Ngày 5-7: Study Page (Core Feature)

**Ưu tiên: CAO NHẤT** | **Ước lượng: ~12-15h**

> Đây là trang phức tạp nhất — nơi diễn ra toàn bộ Phase 2-4 của SRS.

#### Tasks:
- [ ] **Study Page Layout** — Tab-based navigation
  - File: `src/pages/StudyPage.tsx` (đã có)
  - Layout: Document info + 4 tabs
  
```
┌─────────────────────────────────────────────────────┐
│ 📄 Document Title                    [Goal: Ôn thi] │
│ Dataset: Physics 101 | Pages: 25 | Uploaded: ...    │
├─────────────────────────────────────────────────────┤
│  [Summary]  [Flashcards]  [Quiz]  [Feedback]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  (Tab content)                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- [ ] **Learning Goal Selector** (SRS UC-03)
  - Component: `src/features/study-session/components/GoalSelector.tsx` (TẠO MỚI)
  - 5 goals: Cramming, Deep Understanding, Quick Scan, ELI5, Memorization
  - Hiển thị: icon + tên + mô tả ngắn
  - UI: Radio group hoặc card selection
  - Bắt user chọn goal trước khi xem nội dung

- [ ] **Summary Tab** (SRS UC-04)
  - Component: `src/features/study-session/components/SummaryView.tsx` (TẠO MỚI)
  - Hiển thị: nội dung tóm tắt (Markdown rendered)
  - Format tùy goal: bullet points hoặc paragraphs
  - Mock: Hardcode 1 bài summary mẫu

- [ ] **Flashcard Tab** (SRS UC-05)
  - Component: `src/features/study-session/components/FlashcardView.tsx` (TẠO MỚI)
  - UI: Card flip animation (front/back)
  - Filter bar: Core | Support | Advanced (toggle)
  - Navigation: Previous / Next / Shuffle
  - Rate: "Quên" / "Nhớ" buttons
  - Progress: 5/20 cards reviewed
  - Mock: 10 flashcards mẫu với importance levels

- [ ] **Quiz Tab** (SRS UC-06)
  - Component: `src/features/study-session/components/QuizView.tsx` (TẠO MỚI)
  - UI: Multiple choice (A/B/C/D), True/False
  - Filter: Recall | Understand | Apply (toggle)
  - Submit → Score display + review sai
  - Hien explanation cho câu sai
  - Mock: 10 câu quiz mẫu với cognitive levels

- [ ] **Feedback Tab** (SRS UC-07)
  - Component: `src/features/study-session/components/FeedbackView.tsx` (TẠO MỚI)
  - UI: Score card + weak/strong topics
  - Hiển thị: "Bạn yếu phần X, hãy đọc lại trang Y"
  - Nút: "Luyện tập bổ trợ" (mở remedial quiz)
  - Mock: Hardcode 1 feedback report mẫu

#### Deliverable:
✅ Study page hoàn chỉnh với 4 tabs, tất cả hiển thị mock data. User flow: Chọn goal → Xem summary → Flip flashcards → Làm quiz → Xem feedback

---

### 📦 Tuần 1: File Structure sau khi hoàn thành

```
src/
  pages/
    LandingPage.tsx         ← có sẵn
    LoginPage.tsx           ← có sẵn
    RegisterPage.tsx        ← có sẵn
    OverviewPage.tsx        ← có sẵn
    LibraryPage.tsx         ← TẠO MỚI
    DatasetDetailsPage.tsx  ← ĐỔI TÊN từ FolderDetailsPage
    StudyPage.tsx           ← có sẵn, VIẾT LẠI
  features/
    auth/components/        ← có sẵn
    library/components/
      DatasetCard.tsx       ← ĐỔI TÊN từ FolderCard
      CreateDatasetModal.tsx ← ĐỔI TÊN từ CreateFolderModal
      UploadModal.tsx       ← có sẵn
      EmptyLibrary.tsx      ← có sẵn
    study-session/components/
      GoalSelector.tsx      ← TẠO MỚI
      SummaryView.tsx       ← TẠO MỚI
      FlashcardView.tsx     ← TẠO MỚI
      QuizView.tsx          ← TẠO MỚI
      FeedbackView.tsx      ← TẠO MỚI
    overview/components/    ← có sẵn
  data/
    mockData.ts             ← TẠO MỚI (tất cả mock data)
```

---

## 📅 TUẦN 2: Backend + Database (Ngày 8-14)

### Mục tiêu tuần 2
- [ ] Spring Boot project setup
- [ ] MySQL schema + JPA Entities
- [ ] Auth API (JWT)
- [ ] CRUD APIs cho datasets, documents
- [ ] File upload + text extraction
- [ ] Kết nối FE → BE

---

### Ngày 8-9: Spring Boot Setup + Auth

**Ưu tiên: Cao** | **Ước lượng: ~8-10h**

#### Tasks:
- [ ] **Spring Boot Project Init**
  - Spring Initializr: Spring Web, Spring Security, Spring Data JPA, MySQL Driver, Lombok, Validation
  - Cấu trúc package:
  ```
  com.flowlearn/
    ├── config/          (SecurityConfig, CorsConfig, JwtConfig)
    ├── controller/      (AuthController, DatasetController, ...)
    ├── service/         (AuthService, DatasetService, ...)
    ├── repository/      (UserRepository, DatasetRepository, ...)
    ├── entity/          (User, Dataset, Document, ...)
    ├── dto/             (LoginRequest, RegisterRequest, ...)
    ├── security/        (JwtTokenProvider, JwtAuthFilter)
    ├── exception/       (GlobalExceptionHandler)
    └── util/            (FileUtil, TextExtractor)
  ```

- [ ] **MySQL Database Setup**
  - Tạo database: `flowlearn_db`
  - Chạy SQL tạo 13 bảng (từ DATABASE_DESIGN.md)
  - Config: `application.yml` (datasource, JPA, Hibernate)

- [ ] **JPA Entities** — 13 entities mapping 13 bảng
  - Dùng AI (Copilot) generate nhanh từ SQL schema
  - Key annotations: `@Entity`, `@Id`, `@GeneratedValue(strategy=UUID)`, `@Enumerated(STRING)`, `@JdbcTypeCode(JSON)`

- [ ] **Auth API** (US-00)
  - `POST /api/auth/register` — Đăng ký (validate email unique, hash password)
  - `POST /api/auth/login` — Đăng nhập (return JWT access + refresh token)
  - `POST /api/auth/refresh` — Refresh token
  - `GET /api/auth/me` — User info hiện tại
  - `JwtTokenProvider` — Generate / validate JWT (HS256, 24h expiry)
  - `JwtAuthFilter` — Filter cho mọi request /api/** (trừ auth endpoints)
  - `SecurityConfig` — CORS, CSRF disable, permit auth endpoints

- [ ] **Kết nối FE Auth**
  - `src/services/authService.ts` — API calls (login, register, refresh)
  - `src/store/useAuthStore.ts` — Update: lưu JWT, user info, auto refresh
  - `src/layouts/ProtectedRoute.tsx` — Check real auth state

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Interceptor: auto attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: auto refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
    }
    return Promise.reject(error);
  }
);
```

#### Deliverable:
✅ User đăng ký + đăng nhập thật. JWT auth hoạt động. FE gọi BE API thành công.

---

### Ngày 10-11: CRUD APIs (Dataset + Document + Upload)

**Ưu tiên: Cao** | **Ước lượng: ~10-12h**

#### Tasks:

- [ ] **Dataset CRUD** (UC-02)
  - `POST /api/datasets` — Tạo dataset (validate tên unique per user)
  - `GET /api/datasets` — Danh sách datasets của user
  - `GET /api/datasets/{id}` — Chi tiết dataset + documents
  - `PUT /api/datasets/{id}` — Sửa tên/mô tả
  - `DELETE /api/datasets/{id}` — Xóa dataset (documents → dataset_id = NULL)

- [ ] **Document APIs** (UC-01)
  - `POST /api/documents/upload` — Upload file (multipart/form-data)
    - Validate: file type, size ≤ 30MB
    - Lưu file local (dev) / R2 (prod)
    - Tạo record documents (status = 'pending')
    - Trigger async text extraction
  - `GET /api/documents` — Danh sách documents (filter by dataset_id)
  - `GET /api/documents/{id}` — Chi tiết document + chunks
  - `PUT /api/documents/{id}/goal` — Cập nhật learning_goal (UC-03)
  - `DELETE /api/documents/{id}` — Xóa document + file + chunks

- [ ] **Text Extraction Service**
  - `TextExtractorService.java` — Extract text từ PDF/DOCX
    - PDF: Apache PDFBox (`PDDocument` → `PDFTextStripper`)
    - DOCX: Apache POI (`XWPFDocument` → `XWPFParagraph`)
    - TXT/MD: Read trực tiếp
  - Chia text thành chunks (~800 tokens, overlap 100)
  - Lưu `document_chunks` → Update `processing_status = 'ready'`
  - **Async:** Dùng `@Async` để không block upload response

```java
// TextExtractorService.java (skeleton)
@Service
public class TextExtractorService {

    @Async
    public void extractAndChunk(Document document) {
        String rawText = switch (document.getFileType()) {
            case PDF  -> extractFromPdf(document.getFilePath());
            case DOCX -> extractFromDocx(document.getFilePath());
            case TXT, MD -> readTextFile(document.getFilePath());
        };
        
        List<String> chunks = chunkText(rawText, 800, 100);
        // Save chunks to DB
        // Update document.processingStatus = READY
    }
}
```

- [ ] **Kết nối FE → BE** (replace mock data)
  - `src/services/datasetService.ts` — CRUD API calls
  - `src/services/documentService.ts` — Upload, list, delete
  - Update `LibraryPage`, `DatasetDetailsPage`, `OverviewPage` dùng real data

#### Deliverable:
✅ Upload file thật, text được extract, datasets CRUD hoạt động. FE hiển thị data từ BE.

---

### Ngày 12-14: Remaining CRUD + Study APIs

**Ưu tiên: Trung bình** | **Ước lượng: ~10-12h**

#### Tasks:

- [ ] **Study Content APIs** (chuẩn bị cho AI — tuần 3 sẽ fill data thật)
  - `GET /api/documents/{id}/summary` — Lấy summary theo goal
  - `GET /api/documents/{id}/flashcards` — Lấy flashcards (filter importance)
  - `GET /api/documents/{id}/quiz` — Lấy quiz (filter cognitive level)
  - `POST /api/quiz/{id}/submit` — Nộp quiz, chấm điểm
  - `GET /api/documents/{id}/feedback` — Lấy feedback reports

- [ ] **Flashcard Review API**
  - `PUT /api/flashcards/{id}/review` — Update review_status (forgot/remembered)

- [ ] **Progress & Streak APIs**
  - `GET /api/progress` — Tiến trình học tổng quan
  - `PUT /api/progress/{documentId}` — Update tiến trình
  - `GET /api/streaks` — Streak hiện tại
  - Logic: mỗi ngày user vào học → update streak

- [ ] **Notification API** (đơn giản)
  - `GET /api/notifications` — Danh sách thông báo
  - `PUT /api/notifications/{id}/read` — Đánh dấu đã đọc

- [ ] **FE Integration** — Kết nối các trang còn lại
  - `src/services/studyService.ts` — Summary, flashcard, quiz
  - Update `StudyPage.tsx` + sub-components

- [ ] **Seed Data** — Tạo test data
  - 1 user test
  - 2 datasets, 3-4 documents
  - Mock summaries, flashcards, quizzes (chưa cần AI thật)

#### Deliverable:
✅ Tất cả CRUD APIs hoạt động. FE kết nối BE hoàn chỉnh. Study page hiển thị data từ DB (seed data).

---

## 📅 TUẦN 3: AI Integration + Deploy + Polish (Ngày 15-21)

### Mục tiêu tuần 3
- [ ] Tích hợp Google Gemini API
- [ ] AI sinh Summary, Flashcard, Quiz từ document text
- [ ] AI feedback sau quiz
- [ ] Deploy (Vercel + Railway)
- [ ] Bug fixes + polish

---

### Ngày 15-17: AI Integration (Gemini)

**Ưu tiên: CAO NHẤT** | **Ước lượng: ~12-15h**

#### Tasks:

- [ ] **Gemini API Setup**
  - Dependency: `google-cloud-aiplatform` hoặc REST API trực tiếp
  - Config: API key trong `application.yml` (env variable)
  - Service: `GeminiAiService.java`

- [ ] **AI Summary Generation** (UC-04, Phase 2)
  - Input: document chunks + learning goal + strategy template
  - Prompt engineering: yêu cầu output format cụ thể theo goal
  - Output: Markdown text → lưu `document_summaries`
  - Endpoint trigger: `POST /api/documents/{id}/generate` (after goal selected)

```java
// Prompt template ví dụ cho "Cramming" goal
String prompt = """
    Bạn là trợ lý học tập AI. Tóm tắt nội dung dưới đây theo mục tiêu "Ôn thi cấp tốc":
    
    RULES:
    - Format: bullet points ngắn gọn
    - Chỉ giữ: định nghĩa, công thức, key concepts
    - Bỏ: ví dụ dài, lịch sử, context phụ
    - Ngôn ngữ: cùng ngôn ngữ với tài liệu gốc
    
    CONTENT:
    %s
    
    OUTPUT: JSON format
    {
        "summary": "...(markdown content)...",
        "key_topics": ["topic1", "topic2", ...],
        "format_type": "bullet_points"
    }
    """.formatted(documentText);
```

- [ ] **AI Flashcard Generation** (UC-05, Phase 2)
  - Input: document chunks + learning goal
  - Prompt: yêu cầu flashcards kèm importance_level
  - Output: JSON array → lưu `flashcard_decks` + `flashcards`

```java
// Output format yêu cầu từ Gemini
{
    "flashcards": [
        {
            "front": "Định luật II Newton là gì?",
            "back": "F = ma, lực bằng khối lượng nhân gia tốc",
            "importance_level": "core"
        },
        {
            "front": "Phân biệt khối lượng và trọng lượng?",
            "back": "Khối lượng là đại lượng vô hướng (kg), trọng lượng là lực (N = kg·m/s²)",
            "importance_level": "support"
        }
    ]
}
```

- [ ] **AI Quiz Generation** (UC-06, Phase 2)
  - Input: document chunks + learning goal + strategy template (distribution)
  - Prompt: yêu cầu quiz questions kèm cognitive_level
  - Output: JSON → lưu `quizzes` + `quiz_questions`

```java
{
    "questions": [
        {
            "question": "Đơn vị của lực là gì?",
            "type": "multiple_choice",
            "options": ["A. Joule", "B. Newton", "C. Watt", "D. Pascal"],
            "correct_answer": "B",
            "explanation": "Newton (N) là đơn vị đo lực trong hệ SI",
            "cognitive_level": "recall",
            "topic": "Định luật II Newton"
        }
    ]
}
```

- [ ] **AI Topic Extraction** (Phase 1 bổ sung)
  - Sau khi extract text → gọi Gemini xác định topics
  - Input: first 10 chunks → Output: topic names + descriptions
  - Lưu `knowledge_topics`

- [ ] **Kết nối FE** — Trigger AI generation
  - User chọn goal → Call `POST /api/documents/{id}/generate`
  - Loading state (AI đang xử lý...)
  - Hiển thị kết quả khi hoàn thành

#### Deliverable:
✅ User upload tài liệu → chọn goal → AI tự động sinh summary + flashcards + quiz. Tất cả hiển thị trên Study page.

---

### Ngày 18-19: AI Feedback + Quiz Scoring

**Ưu tiên: Cao** | **Ước lượng: ~8-10h**

#### Tasks:

- [ ] **Quiz Scoring Logic**
  - `POST /api/quiz/{id}/submit` → Nhận answers từ FE
  - Chấm điểm: so sánh selected vs correct_answer
  - Phân tích: nhóm câu sai theo topic → xác định weak topics
  - Update `user_topic_mastery`: tính mastery_score mới

- [ ] **AI Feedback Generation** (UC-07, Phase 4)
  - Input: quiz result + wrong answers + document context
  - Output: feedback report

```java
// Prompt cho feedback
String prompt = """
    Phân tích kết quả quiz của sinh viên:
    
    Score: %d/%d
    Câu sai: %s
    Nội dung tài liệu liên quan: %s
    
    Trả về JSON:
    {
        "summary": "Tóm tắt kết quả, điểm mạnh/yếu",
        "weak_topics": [
            {"topic_name": "...", "explanation": "Giải thích tại sao sai...", "page_numbers": [5, 6]}
        ],
        "strong_topics": [...],
        "study_suggestions": [
            {"message": "Đọc lại phần X...", "priority": "high"}
        ]
    }
    """;
```

- [ ] **Remedial Quiz** (UC-07 mở rộng)
  - Từ weak topics → AI tạo 3 câu quiz bổ trợ
  - Lưu quiz mới với flag `ai_generated = true`
  - FE: nút "Luyện tập bổ trợ" → mở quiz mới

- [ ] **FE Feedback Display**
  - Update `FeedbackView.tsx`: hiển thị real AI feedback
  - Highlight topics yếu bằng màu đỏ
  - "Bạn yếu phần X → Đọc lại trang Y" links
  - Nút luyện tập bổ trợ

#### Deliverable:
✅ User làm quiz → nhận feedback AI chi tiết → biết yếu phần nào → luyện tập bổ trợ.

---

### Ngày 20-21: Deploy + Polish + Bug Fixes

**Ưu tiên: Cao** | **Ước lượng: ~8-10h**

#### Tasks:

- [ ] **Deploy Frontend → Vercel**
  - Connect GitHub repo → auto deploy
  - Environment: `VITE_API_URL=https://flowlearn-api.railway.app/api`
  - Custom domain (optional)

- [ ] **Deploy Backend → Railway**
  - Dockerfile cho Spring Boot
  - Environment variables: DB_URL, JWT_SECRET, GEMINI_API_KEY
  - MySQL addon trên Railway (hoặc Aiven free tier)

```dockerfile
# Dockerfile (Spring Boot)
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- [ ] **Database Production**
  - Migration SQL cho Railway MySQL
  - Seed data cơ bản (admin user)

- [ ] **Bug Fixes & Polish**
  - Test full flow: Register → Login → Upload → Goal → Summary → Flashcard → Quiz → Feedback
  - Fix CORS issues
  - Fix error handling (toast notifications)
  - Loading states cho AI generation
  - Mobile responsive check (cơ bản)

- [ ] **Demo Preparation**
  - Chuẩn bị 1-2 tài liệu mẫu (PDF tiếng Việt)
  - Test upload + full flow trên production
  - Ghi chú demo script

#### Deliverable:
✅ App chạy trên production. Demo được full flow. Sẵn sàng nộp bài.

---

## ✅ Checklist tính năng (mapping SRS)

| # | User Story | Tính năng | Status | Tuần |
|---|---|---|---|---|
| US-00 | Login/Register | Auth JWT, form đăng ký/đăng nhập | ⬜ | 1-2 |
| US-01 | Upload tài liệu | Upload PDF/DOCX, text extraction | ⬜ | 1-2 |
| US-02 | Manage Datasets | Tạo/sửa/xóa datasets, gom documents | ⬜ | 1-2 |
| US-03 | Choose Learning Goal | 5 goals, strategy templates | ⬜ | 1, 3 |
| US-04 | Summarization | AI summary theo goal (Gemini) | ⬜ | 1, 3 |
| US-05 | Flashcards | AI flashcard + importance levels, filter | ⬜ | 1, 3 |
| US-06 | Quiz | AI quiz + cognitive levels, scoring | ⬜ | 1, 3 |
| US-07 | Feedback | AI feedback + weak topics + remedial | ⬜ | 3 |

---

## 🔮 Tính năng có thể bỏ qua (nếu thiếu thời gian)

Theo thứ tự ưu tiên cắt bỏ (cắt từ dưới lên):

1. **Remedial Quiz auto-generate** → Chỉ hiển thị gợi ý text, không tạo quiz mới
2. **Notifications** → Bỏ, user tự check
3. **Streak tracking** → Hardcode hoặc bỏ
4. **Study progress tracking** → Đơn giản hóa
5. **Topic mastery** → Chỉ hiển thị câu sai, không phân loại mastery level
6. **ELI5 + Memorization goals** → Chỉ giữ 3 goals: Cramming, Deep, Quick Scan

> **Nguyên tắc:** Giữ core flow hoạt động (Upload → Goal → Summary → Flashcard → Quiz → Feedback). Cắt bỏ tính năng phụ trợ.

---

## 🔮 Hướng mở rộng sau MVP (sau 3 tuần)

Khi có thời gian nâng cấp:
1. **Spaced Repetition (SM-2)** — Algorithm ôn tập thông minh cho flashcards
2. **AI Chat** — Hỏi đáp trực tiếp về tài liệu
3. **PDF Highlight** — Trace-back highlight vị trí trên PDF gốc
4. **OAuth** — Google/GitHub login
5. **Collaboration** — Chia sẻ datasets giữa users
6. **Real-time Notifications** — WebSocket
7. **Mobile App** — React Native
8. **Advanced Analytics** — Dashboard chi tiết hơn, export báo cáo

---

## 📎 Tham chiếu

- [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) — Schema chi tiết 13 bảng
- [SRS Document](./SrS.docx) — Software Requirements Specification đầy đủ
