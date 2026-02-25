# FlowLearn - Thiết kế Database & Kiến trúc lưu trữ

## 📋 Tổng quan

FlowLearn là nền tảng học tập hỗ trợ AI thông qua upload tài liệu, xây dựng theo **flow học tập có mục tiêu** (goal-driven study flow).

**Giá trị cốt lõi (từ SRS):** Không chỉ tóm tắt nội dung, mà xây dựng **quy trình học có cấu trúc**, thích ứng theo mục tiêu của người học.

**4 Phase theo SRS:**
1. **Preparation** — Upload tài liệu → Trích xuất text
2. **Goal-Driven Generation** — Chọn mục tiêu → AI sinh Summary/Quiz/Flashcard phù hợp
3. **Learning Session** — Học flashcard, đọc summary, lọc theo level
4. **Assessment & Remediation** — Làm quiz → Feedback → Highlight lỗi sai → Luyện tập bổ trợ

**Hệ thống cần xử lý:**
- Quản lý user, xác thực (US-00)
- Upload & lưu trữ tài liệu theo datasets (US-01, US-02)
- Chọn mục tiêu học tập (US-03)
- Tóm tắt tài liệu theo mục tiêu (US-04)
- Flashcard phân loại theo mức quan trọng (US-05)
- Quiz phân loại theo mức nhận thức (US-06)
- Feedback phân tích điểm yếu & gợi ý khắc phục (US-07)

---

## 🗄️ Lựa chọn Database: MySQL 8.x (InnoDB)

### Tại sao MySQL?

| Tiêu chí | MySQL 8.x |
|---|---|
| Quan hệ phức tạp (User → Dataset → Document → Chunks) | ✅ InnoDB + FK |
| JSON cho dữ liệu linh hoạt | ✅ Native JSON (MySQL 8.x) |
| Full-text search | ✅ FULLTEXT index (InnoDB) |
| Transaction | ✅ ACID (InnoDB) |
| ORM support | ✅ Spring Data JPA / Hibernate |
| Chi phí | ✅ Free, nhiều hosting |
| Dễ vận hành | ✅ Phổ biến nhất, tài liệu nhiều |

> **Lưu ý:** Dự án **không sử dụng RAG** (Retrieval Augmented Generation). AI nhận nội dung tài liệu trực tiếp qua prompt context. Với context window lớn của Gemini 2.0 Flash (1M tokens), đủ xử lý hầu hết tài liệu học tập.

---

## 📊 Chi tiết Schema

### 1. USERS — Quản lý người dùng

```sql
CREATE TABLE users (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username        VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(500),
    role            ENUM('student', 'admin') DEFAULT 'student',
    is_verified     TINYINT(1) DEFAULT 0,

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Ghi chú:**
- `password_hash`: Hash bằng bcrypt, KHÔNG lưu plaintext
- `CHAR(36)`: Lưu UUID dạng string chuẩn
- Tương ứng **US-00** (Login/Register)

---

### 2. DATASETS — Tổ chức tài liệu (SRS: "Manage Dataset" UC-02)

> **Đổi tên từ "folders" → "datasets"** theo SRS. Mục đích: gom nhóm tài liệu tránh phân mảnh.

```sql
CREATE TABLE datasets (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    color           VARCHAR(7) DEFAULT '#6C63FF',

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_datasets_user_id (user_id),
    CONSTRAINT fk_datasets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_dataset_name_per_user UNIQUE (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Mapping SRS:**
- UC-02: Tạo dataset mới, validate tên trùng
- US-02: "group my learning materials into datasets"
- Tài liệu không có dataset → gán vào dataset mặc định

---

### 3. DOCUMENTS — Tài liệu upload (UC-01, UC-03)

```sql
CREATE TABLE documents (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    dataset_id      CHAR(36),
    user_id         CHAR(36) NOT NULL,

    title           VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type       ENUM('pdf', 'docx', 'txt', 'md') NOT NULL,
    file_url        VARCHAR(1000) NOT NULL,
    file_size       BIGINT NOT NULL,
    total_pages     INT DEFAULT 0,

    -- Trạng thái xử lý
    processing_status ENUM('pending', 'processing', 'ready', 'failed') DEFAULT 'pending',

    -- Mục tiêu học tập (UC-03) — NULL = chưa chọn goal
    learning_goal   ENUM('cramming', 'deep_understanding', 'quick_scan', 'eli5', 'memorization') DEFAULT NULL,
    -- cramming         = Ôn thi (summary ngắn, flashcard Core, quiz Recall)
    -- deep_understanding = Hiểu sâu (summary paragraphs, quiz Apply)
    -- quick_scan       = Lướt nhanh (bullet points, chỉ ý chính)
    -- eli5             = Giải thích đơn giản (ngôn ngữ dễ hiểu)
    -- memorization     = Ghi nhớ (flashcard nhiều, spaced repetition)

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_documents_user_id (user_id),
    INDEX idx_documents_dataset_id (dataset_id),
    INDEX idx_documents_status (processing_status),
    FULLTEXT INDEX idx_documents_search (title),

    CONSTRAINT fk_documents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_documents_dataset FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Mapping SRS:**
- UC-01: Upload file, validate định dạng + kích thước (max 30MB)
- UC-03: `learning_goal` — chọn 1 trong 5 mục tiêu, ảnh hưởng toàn bộ nội dung AI sinh ra
- US-04: Nếu `learning_goal IS NULL` → bắt user chọn trước khi xem summary/quiz

**Quy tắc nghiệp vụ (từ SRS):**
- File hỗ trợ: PDF, DOCX, TXT, MD
- Kích thước tối đa: 30MB
- Upload thời gian < 5 giây cho file 10MB
- Cần scan malware trước khi lưu (phase production)

---

### 4. DOCUMENT_CHUNKS — Nội dung trích xuất (Phase 1: Preparation)

> Không sử dụng vector embedding. Chunks lưu text thuần + metadata vị trí để hỗ trợ trace-back.

```sql
CREATE TABLE document_chunks (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    document_id     CHAR(36) NOT NULL,

    chunk_index     INT NOT NULL,
    content         TEXT NOT NULL,

    page_number     INT,
    position_metadata JSON DEFAULT NULL,
    -- Metadata vị trí (SRS: OCR trả về tọa độ, dùng cho highlight trace-back)
    -- VD: {"x": 100, "y": 200, "width": 400, "height": 50}

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_chunks_document (document_id),
    INDEX idx_chunks_order (document_id, chunk_index),
    FULLTEXT INDEX idx_chunks_content (content),

    CONSTRAINT fk_chunks_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Flow xử lý (SRS Phase 1: Preparation):**
1. User upload file → Validate (định dạng, kích thước)
2. Lưu file lên Object Storage
3. Backend gửi file sang Text Extractor (PDFBox/Apache POI)
4. Nhận về: **raw text** + **position metadata** (tọa độ đoạn văn)
5. Chia text thành chunks (~500-1000 tokens)
6. Lưu chunks vào DB
7. Update `documents.processing_status = 'ready'`
8. Thông báo "Tài liệu đã sẵn sàng để học"

**⚠️ MVP (3 tuần):** Bỏ qua `position_metadata`. Chỉ extract text thuần. Thêm position tracking sau nếu cần trace-back.

---

### 5. DOCUMENT_SUMMARIES — Tóm tắt theo mục tiêu (UC-04)

> **Bảng mới theo SRS.** Mỗi document có thể có nhiều bản summary ứng với learning goal khác nhau.

```sql
CREATE TABLE document_summaries (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    document_id     CHAR(36) NOT NULL,
    user_id         CHAR(36) NOT NULL,

    learning_goal   ENUM('cramming', 'deep_understanding', 'quick_scan', 'eli5', 'memorization') NOT NULL,

    content         LONGTEXT NOT NULL,
    format_type     ENUM('bullet_points', 'paragraphs', 'mindmap') DEFAULT 'bullet_points',
    -- bullet_points = Ôn thi, Lướt nhanh (gạch đầu dòng, ngắn gọn)
    -- paragraphs   = Hiểu sâu, ELI5 (đoạn văn phân tích / đơn giản)
    -- mindmap      = Tùy chọn nâng cao (sau MVP)

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_summary_doc (document_id),
    INDEX idx_summary_user_goal (user_id, document_id, learning_goal),

    CONSTRAINT fk_summary_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_summary_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_summary_per_goal UNIQUE (user_id, document_id, learning_goal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Mapping SRS (UC-04):**
- Goal "Ôn thi" → `format_type = 'bullet_points'`, chỉ giữ định nghĩa + công thức
- Goal "Hiểu sâu" → `format_type = 'paragraphs'`, phân tích nguyên lý chi tiết
- Goal "Lướt nhanh" → `format_type = 'bullet_points'`, chỉ ý chính
- Goal "ELI5" → `format_type = 'paragraphs'`, ngôn ngữ đơn giản
- Goal "Ghi nhớ" → `format_type = 'bullet_points'`, key terms + definitions

---

### 6. FLASHCARD_DECKS & FLASHCARDS — Flashcard theo mức quan trọng (UC-05)

```sql
CREATE TABLE flashcard_decks (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    document_id     CHAR(36),

    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    ai_generated    TINYINT(1) DEFAULT 0,
    card_count      INT DEFAULT 0,

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_decks_user (user_id),
    INDEX idx_decks_doc (document_id),

    CONSTRAINT fk_decks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_decks_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE flashcards (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    deck_id         CHAR(36) NOT NULL,

    front_content   TEXT NOT NULL,
    back_content    TEXT NOT NULL,

    -- ⭐ MỨC QUAN TRỌNG theo SRS (US-05)
    importance_level ENUM('core', 'support', 'advanced') DEFAULT 'core',
    -- core     = Must-know, kiến thức nền tảng (ưu tiên hiển thị trước)
    -- support  = Good-to-know, hỗ trợ hiểu sâu
    -- advanced = Optional, nâng cao cho ai muốn tìm hiểu thêm

    -- Trạng thái ôn tập
    review_status   ENUM('not_reviewed', 'forgot', 'remembered') DEFAULT 'not_reviewed',
    review_count    INT DEFAULT 0,
    last_reviewed_at DATETIME,

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_flashcards_deck (deck_id),
    INDEX idx_flashcards_importance (deck_id, importance_level),

    CONSTRAINT fk_flashcards_deck FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Mapping SRS (UC-05):**
- AI sinh flashcard kèm `importance_level` (Core/Support/Advanced)
- Default filter theo learning goal:
  - Ôn thi → chỉ hiện **Core**
  - Hiểu sâu → hiện **Core + Support**
  - Ghi nhớ → hiện **tất cả**
- User có thể thay đổi filter thủ công (thêm Advanced)
- User flip card → rate: Quên (`forgot`) / Nhớ (`remembered`)

**⚠️ MVP:** Bỏ spaced repetition (SM-2 algorithm). Chỉ cần forgot/remembered đơn giản. Thêm SR sau khi có thời gian.

---

### 7. QUIZZES — Bài kiểm tra theo mức nhận thức (UC-06)

```sql
CREATE TABLE quizzes (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    document_id     CHAR(36),

    title           VARCHAR(255) NOT NULL,
    ai_generated    TINYINT(1) DEFAULT 0,
    question_count  INT DEFAULT 0,

    learning_goal   ENUM('cramming', 'deep_understanding', 'quick_scan', 'eli5', 'memorization') DEFAULT NULL,

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_quiz_user (user_id),
    INDEX idx_quiz_doc (document_id),

    CONSTRAINT fk_quiz_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
CREATE TABLE quiz_questions (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quiz_id         CHAR(36) NOT NULL,

    question        TEXT NOT NULL,
    question_type   ENUM('multiple_choice', 'true_false') DEFAULT 'multiple_choice',
    options         JSON NOT NULL,
    correct_answer  VARCHAR(500) NOT NULL,
    explanation     TEXT,
    order_index     INT NOT NULL DEFAULT 0,

    -- ⭐ MỨC NHẬN THỨC theo SRS (US-06)
    cognitive_level ENUM('recall', 'understand', 'apply') DEFAULT 'recall',
    -- recall    = Nhớ lại (định nghĩa, khái niệm)
    -- understand = Hiểu (phân tích, so sánh)
    -- apply     = Vận dụng (tình huống, áp dụng)

    topic_id        CHAR(36),

    INDEX idx_quiz_q_quiz (quiz_id),
    INDEX idx_quiz_q_level (quiz_id, cognitive_level),
    INDEX idx_quiz_q_topic (topic_id),

    CONSTRAINT fk_quiz_q_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_q_topic FOREIGN KEY (topic_id) REFERENCES knowledge_topics(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
CREATE TABLE quiz_attempts (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quiz_id         CHAR(36) NOT NULL,
    user_id         CHAR(36) NOT NULL,

    score           INT NOT NULL,
    total_questions INT NOT NULL,
    answers         JSON NOT NULL,
    -- [{"question_id": "...", "selected": "B", "is_correct": false, "topic_id": "..."}, ...]
    time_spent_sec  INT,

    completed_at    DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attempts_quiz (quiz_id),
    INDEX idx_attempts_user (user_id),

    CONSTRAINT fk_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Mapping SRS (UC-06):**
- Phân bổ cognitive_level theo learning goal:
  - Ôn thi → 80% Recall, 20% Understand
  - Hiểu sâu → 30% Recall, 40% Understand, 30% Apply
  - Lướt nhanh → 100% Recall
  - ELI5 → 60% Recall, 40% Understand
  - Ghi nhớ → 90% Recall, 10% Understand
- User có thể filter theo cognitive_level
- Chấm điểm xong → hiện explanation cho câu sai

---

### 8. KNOWLEDGE_TOPICS — Chủ đề kiến thức

```sql
CREATE TABLE knowledge_topics (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    document_id     CHAR(36) NOT NULL,

    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    parent_topic_id CHAR(36),

    chunk_ids       JSON DEFAULT (JSON_ARRAY()),
    display_order   INT DEFAULT 0,

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_topics_document (document_id),
    INDEX idx_topics_parent (parent_topic_id),

    CONSTRAINT fk_topics_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_topics_parent FOREIGN KEY (parent_topic_id) REFERENCES knowledge_topics(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Flow:** Sau khi extract text → AI phân loại chunks thành topics → Gắn topics vào quiz questions + flashcards → Khi user sai → biết yếu topic nào.

---

### 9. USER_TOPIC_MASTERY — Mức nắm vững theo chủ đề

```sql
CREATE TABLE user_topic_mastery (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    topic_id        CHAR(36) NOT NULL,

    mastery_score   INT DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,

    mastery_level   ENUM('not_started', 'weak', 'developing', 'proficient', 'mastered') DEFAULT 'not_started',

    last_tested_at  DATETIME,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_mastery_user_topic (user_id, topic_id),
    INDEX idx_mastery_user (user_id),
    INDEX idx_mastery_weak (user_id, mastery_score),

    CONSTRAINT fk_mastery_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_mastery_topic FOREIGN KEY (topic_id) REFERENCES knowledge_topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Phân loại mastery_level:**
- 0 → `not_started` | 1-39 → `weak` | 40-69 → `developing` | 70-89 → `proficient` | 90-100 → `mastered`

---

### 10. AI_FEEDBACK_REPORTS — Phản hồi thông minh (UC-07, Phase 4)

> Đây là bảng cốt lõi của **Phase 4: Assessment & Remediation** trong SRS.

```sql
CREATE TABLE ai_feedback_reports (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    quiz_attempt_id CHAR(36),
    document_id     CHAR(36),

    overall_score   INT,
    summary         TEXT NOT NULL,

    -- Phân tích điểm yếu (SRS: "Bạn yếu phần Định luật II Newton")
    weak_topics     JSON DEFAULT (JSON_ARRAY()),
    -- [{"topic_id":"...","topic_name":"...","score":25,"wrong_count":3,"explanation":"..."}]

    strong_topics   JSON DEFAULT (JSON_ARRAY()),

    -- Gợi ý khắc phục (SRS UC-07: trace-back + remedial practice)
    study_suggestions JSON DEFAULT (JSON_ARRAY()),
    -- [{"type":"review_material","message":"Đọc lại phần 2.3...","page_numbers":[5,6],"priority":"high"},
    --  {"type":"remedial_quiz","message":"Làm 3 câu hỏi bổ trợ...","priority":"high"}]

    -- SRS: Highlight vị trí trong PDF gốc (MVP: chỉ lưu page numbers)
    highlight_positions JSON DEFAULT (JSON_ARRAY()),
    -- [{"page":5,"positions":[{"x":100,"y":200,"w":400,"h":50}],"note":"Smart note"}]

    -- Bài luyện tập bổ trợ tự động (SRS UC-07: "Remedial Practice")
    generated_practice_quiz_id CHAR(36),

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_feedback_user (user_id, created_at DESC),
    INDEX idx_feedback_quiz (quiz_attempt_id),

    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_attempt FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE SET NULL,
    CONSTRAINT fk_feedback_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL,
    CONSTRAINT fk_feedback_practice FOREIGN KEY (generated_practice_quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Mapping SRS (UC-07, Phase 4):**
1. User nộp quiz → Backend chấm điểm, xác định **đơn vị kiến thức yếu**
2. Truy vết vị trí gốc trong PDF (`highlight_positions`)
3. Gửi context lỗi sai cho AI → AI trả về **Smart Note** + gợi ý
4. Tạo **Remedial Practice** (3 câu hỏi xoay quanh phần sai)
5. Frontend highlight vùng text trên PDF gốc kèm smart note

**⚠️ MVP (3 tuần):** Bỏ qua highlight PDF trực tiếp. Chỉ hiển thị page numbers + giải thích. Highlight làm sau.

---

### 11. STUDY_PROGRESS — Tiến trình học

```sql
CREATE TABLE study_progress (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    document_id     CHAR(36) NOT NULL,

    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    last_page       INT DEFAULT 0,

    last_studied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_progress_user_doc (user_id, document_id),
    INDEX idx_progress_user (user_id),

    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_doc FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 12. STREAKS — Chuỗi ngày học liên tục

```sql
CREATE TABLE streaks (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL UNIQUE,

    current_streak  INT DEFAULT 0,
    longest_streak  INT DEFAULT 0,
    last_activity_date DATE,

    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_streaks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 13. NOTIFICATIONS — Thông báo

```sql
CREATE TABLE notifications (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,

    type            ENUM('document_ready', 'quiz_available', 'feedback_ready', 'streak_reminder') NOT NULL,
    title           VARCHAR(255) NOT NULL,
    message         TEXT,
    is_read         TINYINT(1) DEFAULT 0,
    action_url      VARCHAR(500),

    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notif_user (user_id, is_read, created_at DESC),

    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📊 Tổng quan quan hệ giữa các bảng

```
users
  ├── datasets (1:N)
  │     └── documents (1:N)
  │           ├── document_chunks (1:N)
  │           ├── document_summaries (1:N, per goal)
  │           ├── knowledge_topics (1:N)
  │           ├── flashcard_decks (1:N)
  │           │     └── flashcards (1:N)
  │           └── quizzes (1:N)
  │                 ├── quiz_questions (1:N)
  │                 └── quiz_attempts (1:N)
  │                       └── ai_feedback_reports (1:1)
  ├── study_progress (1:N, per document)
  ├── user_topic_mastery (1:N, per topic)
  ├── streaks (1:1)
  └── notifications (1:N)
```

**Tổng: 13 bảng** (giảm từ 15 bản cũ — bỏ `ai_conversations`/`ai_messages` và `study_sessions`/`study_recommendations` vì không có trong SRS)

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite + Tailwind)            │
└─────────────────┬───────────────────────────────────────────────┘
                  │ REST API (JSON)
                  ▼
┌─────────────────────────┐         ┌──────────────────────────────┐
│   BACKEND API SERVER    │         │     OBJECT STORAGE           │
│   (Java Spring Boot)    │         │                              │
│                         │         │  Dev: Local /uploads/        │
│  • Auth (JWT)           │         │  Prod: Cloudflare R2         │
│  • CRUD API             │         │                              │
│  • File Upload          │         │  Lưu: PDF, DOCX, Avatars    │
│  • Text Extraction      │         └──────────────────────────────┘
│  • AI Service (Gemini)  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐         ┌──────────────────────────────┐
│   MySQL 8.x (InnoDB)    │         │     AI SERVICE               │
│                         │         │                              │
│  • 13 tables relational │         │  Google Gemini 2.0 Flash     │
│  • JSON data (linh hoạt)│         │                              │
│  • FULLTEXT search      │         │  • Text → Summary            │
│                         │         │  • Text → Quiz + Flashcard   │
│  Dev: Local MySQL       │         │  • Results → Feedback        │
│  Prod: Railway/Aiven    │         │  • Weak topics → Practice    │
└─────────────────────────┘         └──────────────────────────────┘
```

---

## 🔧 Strategy Templates (Hardcoded — SRS UC-03)

> Theo SRS: "Mỗi Learning Goal phải đi kèm một bộ Strategy Template được định nghĩa trước (Hard-coded configurations)"

Không cần bảng DB riêng. Cấu hình hardcode trong backend:

```java
// StrategyConfig.java
public enum LearningGoalStrategy {
    CRAMMING(
        "Ôn thi",
        SummaryFormat.BULLET_POINTS,
        Set.of(ImportanceLevel.CORE),
        Map.of(CognitiveLevel.RECALL, 80, CognitiveLevel.UNDERSTAND, 20)
    ),
    DEEP_UNDERSTANDING(
        "Hiểu sâu",
        SummaryFormat.PARAGRAPHS,
        Set.of(ImportanceLevel.CORE, ImportanceLevel.SUPPORT),
        Map.of(CognitiveLevel.RECALL, 30, CognitiveLevel.UNDERSTAND, 40, CognitiveLevel.APPLY, 30)
    ),
    QUICK_SCAN(
        "Lướt nhanh",
        SummaryFormat.BULLET_POINTS,
        Set.of(ImportanceLevel.CORE),
        Map.of(CognitiveLevel.RECALL, 100)
    ),
    ELI5(
        "Giải thích đơn giản",
        SummaryFormat.PARAGRAPHS,
        Set.of(ImportanceLevel.CORE, ImportanceLevel.SUPPORT),
        Map.of(CognitiveLevel.RECALL, 60, CognitiveLevel.UNDERSTAND, 40)
    ),
    MEMORIZATION(
        "Ghi nhớ",
        SummaryFormat.BULLET_POINTS,
        Set.of(ImportanceLevel.CORE, ImportanceLevel.SUPPORT, ImportanceLevel.ADVANCED),
        Map.of(CognitiveLevel.RECALL, 90, CognitiveLevel.UNDERSTAND, 10)
    );
}
```

---

## 🔄 Data Flow theo 4 Phases SRS

### Phase 1: Preparation (Upload tài liệu)
```
User upload file → Backend validate (format + size ≤ 30MB)
    → Lưu file lên Storage → Extract text (PDFBox / Apache POI)
    → Chunk text (~500-1000 tokens) → Lưu document_chunks
    → AI phân loại topics → Lưu knowledge_topics
    → Update processing_status = 'ready'
    → Notification: "Tài liệu sẵn sàng"
```

### Phase 2: Goal-Driven Generation (Chọn mục tiêu → AI sinh nội dung)
```
User chọn learning_goal (vd: "Ôn thi")
    → Backend load Strategy Template cho goal
    → Lấy document_chunks → Construct prompt theo template
    → Gemini API trả JSON response
    → Parse → Lưu: document_summaries + flashcards + quizzes
    → Mỗi flashcard có importance_level, mỗi quiz question có cognitive_level
    → Frontend hiển thị "Nội dung đã sẵn sàng"
```

### Phase 3: Learning Session (Học tập)
```
User mở Summary → Xem tóm tắt theo goal
User mở Flashcard → Default filter theo goal (vd: Ôn thi = Core only)
    → User thay đổi filter (thêm Advanced) → Reload data
    → Flip card → Rate: Quên/Nhớ → Lưu review_status
User mở Quiz → Câu hỏi phân bổ theo goal (vd: 80% Recall)
    → User filter thêm (vd: Apply) → Reload
```

### Phase 4: Assessment & Remediation (Đánh giá & Khắc phục)
```
User nộp Quiz → Chấm điểm → Phân tích câu sai theo topic
    → Truy vết: tìm vị trí trong PDF gốc (page + position)
    → Gửi context cho AI → AI tạo feedback report:
        • Summary kết quả
        • Weak topics + giải thích lý do sai
        • Smart notes cho đoạn cần đọc lại
        • Gợi ý khắc phục
    → Tự động tạo Remedial Quiz (3 câu xoay quanh phần sai)
    → Update user_topic_mastery
    → Frontend: hiển thị điểm + gợi ý "Xem lại lỗi sai"
```

---

## ⚠️ Ghi chú quan trọng về MySQL

### 1. UUID trong MySQL
```sql
-- CHAR(36) lưu UUID dạng string. Tương thích tốt với JPA/Hibernate.
-- Nếu cần tối ưu sau: đổi sang BINARY(16) + UUID_TO_BIN()
```

### 2. JSON trong MySQL 8.x
```sql
-- MySQL JSON tốt cho đọc, nhưng không index trực tiếp
-- Nếu cần query JSON thường xuyên → tạo generated column:
ALTER TABLE ai_feedback_reports
  ADD COLUMN first_weak_score INT GENERATED ALWAYS AS (JSON_EXTRACT(weak_topics, '$[0].score')) STORED;
```

### 3. FULLTEXT Search (tìm chunks liên quan)
```sql
-- Dùng cho việc tìm chunks khi cần context:
SELECT content FROM document_chunks
WHERE document_id = ?
AND MATCH(content) AGAINST('từ khóa' IN NATURAL LANGUAGE MODE)
LIMIT 10;

-- ⚠️ Tiếng Việt: set innodb_ft_min_token_size=2, innodb_ft_enable_stopword=OFF
```

### 4. utf8mb4 BẮT BUỘC
```sql
-- LUÔN dùng utf8mb4, KHÔNG dùng utf8 (utf8 = utf8mb3, thiếu emoji + ký tự đặc biệt)
-- Đã config sẵn trong mọi CREATE TABLE: CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

### 5. ENUM — Phù hợp cho project này
```sql
-- Dùng ENUM cho: role, learning_goal, processing_status, importance_level, cognitive_level
-- ✅ Validate tự động, tiết kiệm storage, query nhanh
-- ⚠️ Thêm giá trị mới cần ALTER TABLE (nhưng MySQL 8.x xử lý nhanh với <100 users)
```

### 6. Foreign Key & ON DELETE
```sql
-- CASCADE: xóa user → xóa tất cả data
-- SET NULL: xóa dataset → documents.dataset_id = NULL (giữ lại document)
-- ⚠️ Cascade nhiều tầng: xóa 1 user trigger nhiều DELETE → cân nhắc soft delete cho production
```

### 7. Spring Data JPA Notes
```java
// Entity UUID: dùng @GeneratedValue(strategy = GenerationType.UUID) (Spring Boot 3.x)
// hoặc tự generate trong @PrePersist
// JSON column: dùng @JdbcTypeCode(SqlTypes.JSON) hoặc converter
// ENUM: dùng @Enumerated(EnumType.STRING)
// Timestamp: dùng @CreationTimestamp / @UpdateTimestamp
```

---

## 📐 Ước tính dung lượng (<100 users)

| Dữ liệu | / user | 100 users |
|---|---|---|
| User data | ~1KB | ~100KB |
| Datasets + Documents metadata | ~15KB | ~1.5MB |
| Document files (PDF/DOCX) | ~50MB | ~5GB |
| Document chunks (text) | ~5MB | ~500MB |
| Summaries | ~500KB | ~50MB |
| Flashcards + Quizzes | ~1MB | ~100MB |
| Feedback reports | ~500KB | ~50MB |
| **Tổng DB** | **~7MB** | **~700MB** |
| **Tổng File Storage** | **~50MB** | **~5GB** |

→ MySQL free tier (1-5GB) đủ dùng. File storage 5-10GB free tier đủ.

---

## 🔮 Hướng mở rộng sau MVP

Khi có thời gian hoặc cần nâng cấp:
1. **Spaced Repetition (SM-2)** — Thêm `next_review_at`, `ease_factor` vào flashcards
2. **AI Chat** — Thêm `ai_conversations`, `ai_messages` tables
3. **PDF Highlight** — Tích hợp PDF.js + position_metadata
4. **Study Sessions** — Track thời gian học, phân tích hiệu quả
5. **Collaboration** — Chia sẻ dataset giữa users
6. **RAG** — Nếu tài liệu quá dài cho context window
7. **OAuth** — Google/GitHub login
8. **Real-time** — WebSocket notifications
