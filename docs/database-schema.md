# Database Schema Documentation - FlowLearn

> **⚠️ IMPLEMENTATION STATUS: DESIGN PHASE**
>
> This database schema documentation represents the **planned design** for the FlowLearn platform. As of the current implementation state:
>
> - ✅ Schema design is complete and comprehensive
> - ❌ No migration files created (no Flyway/Liquibase)
> - ❌ No JPA entities implemented
> - ❌ Database not yet deployed
> - 📋 Ready for implementation when backend development begins
>
> **Next Steps:**
> 1. Create Flyway migration files from this schema
> 2. Generate JPA entities using the annotations provided
> 3. Configure database connection in `application.yml`
> 4. Run migrations to create database tables

---

## Overview

FlowLearn is a SaaS education platform with AI integration. This database schema is designed for **Spring Boot + MySQL** (MySQL 8.0+) to support:

- Document upload and AI processing (PDF/DOCX/TXT/PPTX/XLSX)
- AI-generated Flashcards and Quizzes
- Spaced Repetition System (SRS) using SM-2 algorithm
- Study activity tracking (Weekly Activity chart, Day Streak)
- Chat with documents (RAG-based)
- Subscription tiers (Free/Pro)
- Role-based access control (USER/MODERATOR/SUPER_ADMIN)

**Database Engine:** MySQL 8.0+ (InnoDB)
**Character Set:** utf8mb4
**Collation:** utf8mb4_unicode_ci

---

## ER Diagram (Text-based)

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   users     │────<│  folders    │>────│  folders     │
│             │     │  (nested)   │     │ (parent)     │
└─────────────┘     └─────────────┘     └──────────────┘
       │
       │
       ├─────────────────┐
       │                 │
       v                 v
┌─────────────┐   ┌─────────────┐   ┌──────────────┐
│  documents  │   │ study_sess  │   │ chat_msgs    │
│             │   │             │   │              │
└──────┬──────┘   └──────┬──────┘   └──────────────┘
       │                 │
       v                 v
┌─────────────┐   ┌──────────────┐
│ summaries   │   │ flashcards   │
└─────────────┘   └──────┬───────┘
                         │
                         v
                   ┌──────────────┐
                   │user_flashcard│
                   │  _progress   │
                   └──────────────┘

┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│   quizzes   │>──│quiz_questions│   │quiz_results │
└─────────────┘   └──────────────┘   └─────────────┘

┌─────────────┐   ┌──────────────┐
│subscriptions│   │ user_stats   │
└─────────────┘   └──────────────┘

┌─────────────┐
│study_activ  │
└─────────────┘
```

---

## Table Definitions

### 1. users

**Description:** Core user table storing authentication, profile, and subscription information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt hash |
| full_name | VARCHAR(255) | NOT NULL | Full display name |
| avatar_url | VARCHAR(512) | NULL | Cloudflare R2/Cloudinary URL |
| role | ENUM | DEFAULT 'USER' | USER, MODERATOR, SUPER_ADMIN |
| status | ENUM | DEFAULT 'ACTIVE' | ACTIVE, WARNED, BANNED, SUSPENDED |
| plan | ENUM | DEFAULT 'FREE' | FREE, PRO |
| storage_used_mb | BIGINT | DEFAULT 0 | Storage used in MB |
| storage_limit_mb | INT | DEFAULT 500 | Storage limit in MB |
| warning_count | INT | DEFAULT 0 | Number of warnings received |
| last_login_at | DATETIME | NULL | Last login timestamp |
| created_at | DATETIME | DEFAULT NOW() | Account creation |
| updated_at | DATETIME | ON UPDATE NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `email`
- INDEX: `idx_role (role)`
- INDEX: `idx_status (status)`
- INDEX: `idx_plan (plan)`

**Frontend Mapping:**
- Maps to `useAuthStore.new.ts` User type
- Maps to `useAdminUsersStore.ts` AdminUser type

**Spring Boot Entity Notes:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(length = 36)
    private String id;

    @Email
    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(length = 512)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserPlan plan = UserPlan.FREE;

    private Long storageUsedMb = 0L;
    private Integer storageLimitMb = 500;
    private Integer warningCount = 0;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

---

### 2. folders

**Description:** Organizes documents into hierarchical folders with nested support.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| user_id | CHAR(36) | NOT NULL, FK | Owner |
| parent_id | CHAR(36) | NULL, FK | Parent folder (NULL = root) |
| name | VARCHAR(255) | NOT NULL | Folder name |
| description | TEXT | NULL | Optional description |
| cover_image_url | VARCHAR(512) | NULL | Custom cover URL |
| color | ENUM | DEFAULT 'ocean' | ocean, indigo, emerald, amber, rose, violet |
| created_at | DATETIME | DEFAULT NOW() | Creation |
| updated_at | DATETIME | ON UPDATE NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_user_id (user_id)`
- INDEX: `idx_parent_id (parent_id)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `parent_id` → `folders(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `library/types/index.ts` Folder interface
- Maps to `FolderColor` enum

**Spring Boot Entity Notes:**
```java
@Entity
@Table(name = "folders")
public class Folder {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "parent_id", length = 36)
    private String parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Folder parent;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image_url", length = 512)
    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FolderColor color = FolderColor.OCEAN;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Computed fields (not stored)
    @Transient
    private Integer subfolderCount;

    @Transient
    private Integer fileCount;
}
```

---

### 3. documents

**Description:** Stores metadata for uploaded files (actual files stored in Cloudflare R2).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| user_id | CHAR(36) | NOT NULL, FK | Owner |
| folder_id | CHAR(36) | NULL, FK | Parent folder |
| name | VARCHAR(512) | NOT NULL | Filename |
| file_type | ENUM | NOT NULL | PDF, DOCX, TXT, PPTX, XLSX |
| file_size_bytes | BIGINT | NOT NULL | Size in bytes |
| r2_key | VARCHAR(512) | NOT NULL | R2 object key |
| r2_bucket | VARCHAR(255) | DEFAULT 'flowlearn-documents' | R2 bucket name |
| status | ENUM | DEFAULT 'uploading' | uploading, processing, ready, error |
| error_message | TEXT | NULL | Error if any |
| page_count | INT | NULL | Number of pages (PDF) |
| uploaded_at | DATETIME | DEFAULT NOW() | Upload timestamp |
| updated_at | DATETIME | ON UPDATE NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_user_id (user_id)`
- INDEX: `idx_folder_id (folder_id)`
- INDEX: `idx_status (status)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `folder_id` → `folders(id)` ON DELETE SET NULL

**Frontend Mapping:**
- Maps to `library/types/index.ts` DocumentFile interface
- Maps to `FileType` and `DocumentStatus` enums

**Spring Boot Entity Notes:**
```java
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "folder_id", length = 36)
    private String folderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", insertable = false, updatable = false)
    private Folder folder;

    @Column(nullable = false, length = 512)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileType fileType;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "r2_key", nullable = false, length = 512)
    private String r2Key;

    @Column(name = "r2_bucket", length = 255)
    private String r2Bucket = "flowlearn-documents";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status = DocumentStatus.UPLOADING;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "page_count")
    private Integer pageCount;

    @CreatedDate
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Transient: computed size string (e.g., "2.4 MB")
    @Transient
    private String size;
}
```

---

### 4. study_sessions

**Description:** Tracks each study session (can be for a file or folder).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| user_id | CHAR(36) | NOT NULL, FK | User who studied |
| scope | ENUM | NOT NULL | 'file' or 'folder' |
| scope_id | CHAR(36) | NOT NULL | Document ID or Folder ID |
| goal_id | ENUM | NOT NULL | exam-prep, deep-understanding, quick-review, eli5, memorize |
| started_at | DATETIME | DEFAULT NOW() | Start time |
| completed_at | DATETIME | NULL | End time |
| total_time_seconds | INT | DEFAULT 0 | Duration in seconds |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_user_id (user_id)`
- INDEX: `idx_scope (scope, scope_id)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `study-session/types/index.ts` StudyScopeInfo, GoalId

**Spring Boot Entity Notes:**
```java
@Entity
@Table(name = "study_sessions")
public class StudySession {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudyScope scope;

    @Column(name = "scope_id", length = 36, nullable = false)
    private String scopeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal_id", nullable = false)
    private GoalId goalId;

    @CreatedDate
    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "total_time_seconds")
    private Integer totalTimeSeconds = 0;
}
```

---

### 5. summaries

**Description:** AI-generated summaries based on learning goals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| study_session_id | CHAR(36) | NOT NULL, FK | Parent session |
| goal_id | ENUM | NOT NULL | Associated learning goal |
| content | TEXT | NOT NULL | Markdown content |
| word_count | INT | NULL | Word count |
| created_at | DATETIME | DEFAULT NOW() | Generation time |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_study_session_id (study_session_id)`

**Foreign Keys:**
- `study_session_id` → `study_sessions(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `study-session/types/index.ts` Summary interface

---

### 6. flashcards

**Description:** AI-generated flashcards for studying.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| document_id | CHAR(36) | NULL, FK | Source document |
| study_session_id | CHAR(36) | NULL, FK | Source session |
| front | TEXT | NOT NULL | Question side |
| back | TEXT | NOT NULL | Answer side |
| importance | ENUM | DEFAULT 'core' | core, support, advanced |
| created_at | DATETIME | DEFAULT NOW() | Creation time |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_document_id (document_id)`
- INDEX: `idx_study_session_id (study_session_id)`

**Foreign Keys:**
- `document_id` → `documents(id)` ON DELETE CASCADE
- `study_session_id` → `study_sessions(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `study-session/types/index.ts` Flashcard interface
- Maps to `FlashcardImportance` enum

---

### 7. user_flashcard_progress

**Description:** Tracks user progress with each flashcard using SM-2 SRS algorithm.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| user_id | CHAR(36) | NOT NULL, FK | User |
| flashcard_id | CHAR(36) | NOT NULL, FK | Flashcard |
| repetitions | INT | DEFAULT 0 | Number of reviews |
| interval_days | INT | DEFAULT 0 | Days until next review |
| ease_factor | DECIMAL(3,2) | DEFAULT 2.50 | SM-2 ease factor (1.3-2.5+) |
| next_review_date | DATE | NULL | When to review next |
| last_reviewed_at | DATETIME | NULL | Last review time |
| last_quality | INT | NULL | SM-2 quality (0-5) |
| created_at | DATETIME | DEFAULT NOW() | First seen |
| updated_at | DATETIME | ON UPDATE NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `unique_user_flashcard (user_id, flashcard_id)`
- INDEX: `idx_user_next_review (user_id, next_review_date)`
- INDEX: `idx_flashcard_id (flashcard_id)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `flashcard_id` → `flashcards(id)` ON DELETE CASCADE

**SRS Algorithm Notes (SM-2):**

The SuperMemo-2 algorithm fields:
- **repetitions**: How many times successfully reviewed
- **interval_days**: Days until next review
- **ease_factor**: Multiplier for interval (starts at 2.5, min 1.3)
- **next_review_date**: Calculated as `last_reviewed_at + interval_days`
- **last_quality**: Response quality (0-5):
  - 5: Perfect response
  - 4: Correct with hesitation
  - 3: Correct but difficult
  - 2: Incorrect but familiar
  - 1: Incorrect, barely familiar
  - 0: Complete blackout

SM-2 Formulas:
```
// After each review:
IF quality >= 3:
  IF repetitions == 0:
    interval = 1
  ELSE IF repetitions == 1:
    interval = 6
  ELSE:
    interval = previous_interval * ease_factor

  repetitions += 1
ELSE:
  repetitions = 0
  interval = 1

ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
ease_factor = MAX(1.3, ease_factor)
```

---

### 8. quizzes

**Description:** Quiz containers generated from study sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| study_session_id | CHAR(36) | NOT NULL, FK | Parent session |
| cognitive_level | ENUM | DEFAULT 'understand' | recall, understand, apply |
| total_questions | INT | NOT NULL | Number of questions |
| created_at | DATETIME | DEFAULT NOW() | Creation time |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_study_session_id (study_session_id)`

**Foreign Keys:**
- `study_session_id` → `study_sessions(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `study-session/types/index.ts` CognitiveLevel enum

---

### 9. quiz_questions

**Description:** Individual quiz questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| quiz_id | CHAR(36) | NOT NULL, FK | Parent quiz |
| question | TEXT | NOT NULL | Question text |
| options | JSON | NOT NULL | {"A": "opt A", "B": "opt B", ...} |
| correct_key | ENUM | NOT NULL | A, B, C, or D |
| explanation | TEXT | NULL | Explanation |
| question_index | INT | NOT NULL | Order in quiz |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_quiz_id (quiz_id)`

**Foreign Keys:**
- `quiz_id` → `quizzes(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `study-session/types/index.ts` QuizQuestion, QuizOption

**Spring Boot JSON Notes:**
```java
@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {
    // ...

    @Column(columnDefinition = "JSON", nullable = false)
    @Convert(converter = QuizOptionsConverter.class)
    private Map<String, String> options;
}
```

---

### 10. quiz_results

**Description:** Stores user quiz results.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| quiz_id | CHAR(36) | NOT NULL, FK | Quiz |
| user_id | CHAR(36) | NOT NULL, FK | User who took it |
| score | DECIMAL(5,2) | NOT NULL | Score 0-100 |
| correct_count | INT | NOT NULL | Number correct |
| time_spent_seconds | INT | NOT NULL | Time taken |
| answers | JSON | NOT NULL | [{questionId, selectedKey, isCorrect}, ...] |
| completed_at | DATETIME | DEFAULT NOW() | Completion time |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_quiz_id (quiz_id)`
- INDEX: `idx_user_id (user_id)`

**Foreign Keys:**
- `quiz_id` → `quizzes(id)` ON DELETE CASCADE
- `user_id` → `users(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `study-session/types/index.ts` QuizResult interface

---

### 11. chat_messages

**Description:** Chat messages with documents (RAG-based AI chat).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| user_id | CHAR(36) | NOT NULL, FK | Sender |
| document_id | CHAR(36) | NOT NULL, FK | Context document |
| role | ENUM | NOT NULL | 'user' or 'model' |
| content | TEXT | NOT NULL | Message content |
| created_at | DATETIME | DEFAULT NOW() | Timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_user_document (user_id, document_id)`
- INDEX: `idx_created_at (created_at)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `document_id` → `documents(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `chat/types/index.ts` Message interface
- Maps to `MessageRole` enum

---

### 12. study_activities

**Description:** Daily study activity tracking for Weekly Activity and Day Streak features.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY | AUTO_INCREMENT |
| user_id | CHAR(36) | NOT NULL, FK | User |
| activity_date | DATE | NOT NULL | Date |
| hours_studied | DECIMAL(5,2) | NOT NULL, DEFAULT 0 | Hours studied |
| day_of_week | TINYINT | NOT NULL | 0=Sun, 1=Mon, ..., 6=Sat |
| is_streak_day | BOOLEAN | DEFAULT TRUE | Counts toward streak |
| created_at | DATETIME | DEFAULT NOW() | Creation |
| updated_at | DATETIME | ON UPDATE NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `unique_user_date (user_id, activity_date)`
- INDEX: `idx_user_date (user_id, activity_date DESC)`
- INDEX: `idx_activity_date (activity_date)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Frontend Mapping:**
- Maps to `overview/types/index.ts` StudyDay, StreakData interfaces

**Usage Pattern:**
```sql
-- Get weekly activity for a user
SELECT day_of_week, hours_studied
FROM study_activities
WHERE user_id = ?
  AND activity_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY activity_date;

-- Calculate current streak
SELECT COUNT(*)
FROM study_activities
WHERE user_id = ?
  AND is_streak_day = TRUE
  AND activity_date >= (
    SELECT MAX(activity_date)
    FROM study_activities
    WHERE user_id = ? AND hours_studied = 0
  );
```

---

### 13. subscriptions

**Description:** User subscription management (Stripe integration).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | CHAR(36) | PRIMARY KEY | UUID v4 |
| user_id | CHAR(36) | NOT NULL, FK | Subscriber |
| plan | ENUM | NOT NULL | FREE, PRO |
| status | ENUM | DEFAULT 'active' | active, canceled, past_due, expired |
| stripe_subscription_id | VARCHAR(255) | NULL | Stripe sub ID |
| stripe_customer_id | VARCHAR(255) | NULL | Stripe customer ID |
| current_period_start | DATETIME | NULL | Period start |
| current_period_end | DATETIME | NULL | Period end |
| cancel_at_period_end | BOOLEAN | DEFAULT FALSE | Cancel scheduled? |
| created_at | DATETIME | DEFAULT NOW() | Creation |
| updated_at | DATETIME | ON UPDATE NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_user_id (user_id)`
- INDEX: `idx_stripe_subscription (stripe_subscription_id)`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

---

### 14. user_stats

**Description:** Computed statistics cache for performance optimization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | CHAR(36) | PRIMARY KEY, FK | User |
| documents_count | INT | DEFAULT 0 | Total documents |
| folders_count | INT | DEFAULT 0 | Total folders |
| flashcards_count | INT | DEFAULT 0 | Total flashcards |
| study_sessions_count | INT | DEFAULT 0 | Total sessions |
| current_streak | INT | DEFAULT 0 | Current day streak |
| longest_streak | INT | DEFAULT 0 | Longest streak |
| total_study_hours | DECIMAL(10,2) | DEFAULT 0 | Total hours |
| updated_at | DATETIME | ON UPDATE NOW() | Last recalc |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE

**Usage Notes:**
- Update via application events or scheduled job
- Recalculate on demand if stale
- Avoid complex COUNT queries in hot paths

---

## Relationships Summary

### One-to-Many

| Parent | Child | FK Column | On Delete |
|--------|-------|-----------|-----------|
| users | folders | user_id | CASCADE |
| users | documents | user_id | CASCADE |
| users | study_sessions | user_id | CASCADE |
| users | chat_messages | user_id | CASCADE |
| users | study_activities | user_id | CASCADE |
| users | subscriptions | user_id | CASCADE |
| users | user_stats | user_id | CASCADE |
| folders | folders (children) | parent_id | CASCADE |
| folders | documents | folder_id | SET NULL |
| documents | flashcards | document_id | CASCADE |
| study_sessions | summaries | study_session_id | CASCADE |
| study_sessions | flashcards | study_session_id | CASCADE |
| study_sessions | quizzes | study_session_id | CASCADE |
| quizzes | quiz_questions | quiz_id | CASCADE |
| quizzes | quiz_results | quiz_id | CASCADE |
| flashcards | user_flashcard_progress | flashcard_id | CASCADE |

### Many-to-One

Each child table has an inverse relationship to its parent.

---

## Enum Values Reference

### UserRole
- `USER` - Regular user
- `MODERATOR` - Content moderator
- `SUPER_ADMIN` - Full admin access

### UserStatus
- `ACTIVE` - Normal account
- `WARNED` - Has warnings
- `BANNED` - Permanently banned
- `SUSPENDED` - Temporarily suspended

### UserPlan
- `FREE` - Free tier (500MB storage)
- `PRO` - Pro tier (expanded limits)

### FileType
- `PDF` - PDF documents
- `DOCX` - Word documents
- `TXT` - Text files
- `PPTX` - PowerPoint presentations
- `XLSX` - Excel spreadsheets

### DocumentStatus
- `uploading` - Upload in progress
- `processing` - AI processing
- `ready` - Ready to use
- `error` - Processing failed

### FolderColor
- `ocean` - Blue gradient
- `indigo` - Indigo gradient
- `emerald` - Green gradient
- `amber` - Orange gradient
- `rose` - Red gradient
- `violet` - Purple gradient

### StudyScope
- `file` - Single document study
- `folder` - Multi-document study

### GoalId
- `exam-prep` - Exam preparation
- `deep-understanding` - Deep learning
- `quick-review` - Quick review
- `eli5` - Simplified explanation
- `memorize` - Memorization focus

### FlashcardImportance
- `core` - Core concepts
- `support` - Supporting details
- `advanced` - Advanced topics

### CognitiveLevel
- `recall` - Basic recall
- `understand` - Comprehension
- `apply` - Application

### SubscriptionStatus
- `active` - Active subscription
- `canceled` - Canceled (still active until period end)
- `past_due` - Payment failed
- `expired` - Subscription ended

---

## Spring Boot Implementation Guidelines

### JPA Annotations

1. **@Id**: Use `String` with length 36 for UUIDs
2. **@Enumerated(EnumType.STRING)**: Store enums as strings
3. **@CreatedDate / @LastModifiedDate**: Enable JPA Auditing
4. **@Transient**: Computed fields not stored in DB
5. **@Convert**: Use for JSON column conversion

### UUID Strategy

```java
@Id
@GeneratedValue(uuid = GenerationType.UUID)
@Column(length = 36)
private String id;
```

### Audit Configuration

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

### JSON Column Handling

```java
@Converter
public class MapJsonConverter implements AttributeConverter<Map<String, Object>, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Object> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### Repository Best Practices

```java
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = :status")
    List<User> findByRoleAndStatus(@Param("role") UserRole role, @Param("status") UserStatus status);

    @Modifying
    @Query("UPDATE User u SET u.storageUsedMb = u.storageUsedMb + :delta WHERE u.id = :id")
    int updateStorageUsed(@Param("id") String id, @Param("delta") Long delta);
}
```

---

## Verification Checklist

- [x] Users table with role, status, plan enums
- [x] Folders with nested support (parent_id self-reference)
- [x] Documents with R2 metadata and status tracking
- [x] Study sessions with scope (file/folder)
- [x] Summaries linked to study sessions
- [x] Flashcards with importance levels
- [x] User flashcard progress with SM-2 fields
- [x] Quizzes with cognitive levels
- [x] Quiz questions with JSON options
- [x] Quiz results storing answers
- [x] Chat messages for document chat
- [x] Study activities for streak/weekly activity
- [x] Subscriptions with Stripe integration
- [x] User stats cache table
- [x] All indexes defined for performance
- [x] Foreign key cascades configured
- [x] Enums match frontend TypeScript types
- [x] SRS algorithm fields complete

---

## Migration Order

1. Create `users` table (independent)
2. Create `folders` table (depends on users)
3. Create `documents` table (depends on users, folders)
4. Create `study_sessions` table (depends on users)
5. Create `summaries` table (depends on study_sessions)
6. Create `flashcards` table (depends on documents, study_sessions)
7. Create `user_flashcard_progress` table (depends on users, flashcards)
8. Create `quizzes` table (depends on study_sessions)
9. Create `quiz_questions` table (depends on quizzes)
10. Create `quiz_results` table (depends on quizzes, users)
11. Create `chat_messages` table (depends on users, documents)
12. Create `study_activities` table (depends on users)
13. Create `subscriptions` table (depends on users)
14. Create `user_stats` table (depends on users)

---

## Notes

- **Storage Tracking**: Update `users.storage_used_mb` on document upload/delete
- **Streak Calculation**: Update `study_activities.is_streak_day` daily via scheduled job
- **Stats Refresh**: Trigger `user_stats` updates on relevant CRUD operations
- **Soft Deletes**: Consider using soft deletes for subscriptions (add `deleted_at` column)
- **Index Tuning**: Monitor query performance and add composite indexes as needed
- **Partitioning**: Consider partitioning `study_activities` by date for large datasets

---

## Next Steps for Implementation

### 1. Database Migration Setup

**Add Flyway to `pom.xml`:**
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

**Configure in `application.yml`:**
```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```

### 2. Create Migration Files

Create SQL migration files in `src/main/resources/db/migration/` following the migration order above:

- `V1__Create_users_table.sql`
- `V2__Create_folders_table.sql`
- `V3__Create_documents_table.sql`
- ... (continuing through V14)

**Example migration format:**
```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512),
    role ENUM('USER', 'MODERATOR', 'SUPER_ADMIN') DEFAULT 'USER',
    status ENUM('ACTIVE', 'WARNED', 'BANNED', 'SUSPENDED') DEFAULT 'ACTIVE',
    plan ENUM('FREE', 'PRO') DEFAULT 'FREE',
    storage_used_mb BIGINT DEFAULT 0,
    storage_limit_mb INT DEFAULT 500,
    warning_count INT DEFAULT 0,
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_plan (plan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Generate JPA Entities

Create entity classes in `src/main/java/io/flowlearn/backend/entity/` using the annotations provided in each table's "Spring Boot Entity Notes" section.

**Package structure:**
```
io.flowlearn.backend.entity/
├── User.java
├── Folder.java
├── Document.java
├── StudySession.java
├── Summary.java
├── Flashcard.java
├── UserFlashcardProgress.java
├── Quiz.java
├── QuizQuestion.java
├── QuizResult.java
├── ChatMessage.java
├── StudyActivity.java
├── Subscription.java
└── UserStats.java
```

### 4. Create Repositories

Create Spring Data JPA repositories in `src/main/java/io/flowlearn/backend/repository/`:

**Example:**
```java
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = :status")
    List<User> findByRoleAndStatus(
        @Param("role") UserRole role,
        @Param("status") UserStatus status
    );

    @Modifying
    @Query("UPDATE User u SET u.storageUsedMb = u.storageUsedMb + :delta WHERE u.id = :id")
    int updateStorageUsed(@Param("id") String id, @Param("delta") Long delta);
}
```

### 5. Configure Database Connection

**Add to `application.yml`:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/flowlearn?useSSL=false&serverTimezone=UTC
    username: flowlearn_user
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate  # Use Flyway for schema management
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
```

### 6. Enable JPA Auditing

**Create `JpaConfig.java`:**
```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

### 7. Testing

**Create test database and run migrations:**
```bash
# Run Flyway migrations
./mvnw flyway:migrate

# Verify tables created
mysql -u flowlearn_user -p flowlearn -e "SHOW TABLES;"
```

### 8. Verification Checklist

After implementation:
- [ ] All 14 tables created successfully
- [ ] All foreign keys configured correctly
- [ ] All indexes created
- [ ] Enum values match frontend TypeScript types
- [ ] JPA entities map correctly to tables
- [ ] Repositories can perform basic CRUD operations
- [ ] Auditing fields (created_at, updated_at) work automatically
- [ ] Cascade deletes work as expected
- [ ] Migration can run on fresh database
- [ ] Migration can be rolled back if needed

---

**See Also:**
- [API Specifications](./api-specs.md) - API endpoints that use these tables
- [Backend CLAUDE.md](../backend/CLAUDE.md) - Backend coding standards
- [Frontend CLAUDE.md](../frontend/CLAUDE.md) - Frontend type definitions
