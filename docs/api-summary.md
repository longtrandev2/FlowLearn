# FlowLearn - API & Feature Summary

Document này liệt kê toàn bộ các API đã hoàn thiện ở thời điểm hiện tại, được phân loại theo từng Entity chính trong hệ thống. *Lưu ý: Chức năng Chat/VectorDB và Payment/Subscription tạm thời chưa triển khai.*

## 1. Authentication (AuthController)
- POST /api/v1/auth/register - Đăng ký tài khoản mới.
- POST /api/v1/auth/login - Đăng nhập, nhận JWT Token.

## 2. Admin / Users (AdminUserController)
- GET /api/v1/admin/users/stats - Thống kê số lượng user mới (cho Dashboard Admin).
- GET /api/v1/admin/users - Danh sách toàn bộ user (có phân trang/tìm kiếm).
- PUT /api/v1/admin/users/{userId}/status - Cập nhật trạng thái user (Active/Inactive).
- DELETE /api/v1/admin/users/{userId} - Xóa user.

## 3. Documents (DocumentController)
- POST /api/v1/documents - Upload tài liệu (Tự động tải lên R2 Cloudflare và parse text bằng Apache Tika).
- GET /api/v1/documents - Lấy danh sách tài liệu của user.
- GET /api/v1/documents/{id} - Lấy chi tiết một tài liệu.
- DELETE /api/v1/documents/{id} - Xóa tài liệu khỏi database và R2.

## 4. Folders (FolderController)
- POST /api/v1/folders - Tạo thư mục mới.
- GET /api/v1/folders - Danh sách thư mục của user.
- GET /api/v1/folders/{id} - Thông tin 1 thư mục.
- PUT /api/v1/folders/{id} - Cập nhật tên thư mục.
- DELETE /api/v1/folders/{id} - Xóa thư mục.

## 5. Study Sessions (StudySessionController)
- POST /api/v1/study-sessions/start - Bắt đầu 1 phiên học (từ Document hoặc Folder).
- POST /api/v1/study-sessions/{sessionId}/complete - Hoàn thành phiên học, ghi nhận thời gian.
- GET /api/v1/study-sessions/{sessionId}/summary - Lấy hoặc **Tự động Generate Summary (bằng LLM)** cho session nếu chưa có.

## 6. Flashcards (FlashcardController)
- GET /api/v1/flashcards/due - Lấy danh sách Flashcard đến hạn ôn tập (Spaced Repetition).
- GET /api/v1/flashcards/session/{sessionId} - Lấy danh sách Flashcard của phiên học. **Nếu chưa có, tự động trigger Gemini LLM sinh mới dựa trên file nội dung R2.**
- POST /api/v1/flashcards/{id}/review - Submit kết quả review Flashcard (Quality 0-5), tính toán lại ngày ôn tập tiếp theo (SM-2 Algorithm).

## 7. Quizzes (QuizController)
- GET /api/v1/quizzes/session/{sessionId} - Lấy danh sách Quiz của phiên học. **Nếu chưa có, tự động trigger Gemini LLM sinh mới Quiz câu hỏi đa lựa chọn.**
- POST /api/v1/quizzes/{quizId}/submit - Nộp bài làm Quiz, tính điểm và lưu lại kết quả.
