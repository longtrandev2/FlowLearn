-- Migration Script: Từ Cloudflare R2 sang Cloudinary
-- Thực thi trên database: flowlearn_db

-- 1. Thêm cột mới cho Cloudinary
ALTER TABLE documents ADD COLUMN cloudinary_id VARCHAR(512);

-- 2. (Tùy chọn) Chép dữ liệu ID cũ sang (Nếu bạn muốn tận dụng lại metadata, hoặc phục vụ việc di chuyển file sau này).
-- Lưu ý: Nếu dữ liệu cũ không còn dùng được với Cloudinary, bạn có thể cấp một ID tạm hoặc để trống (null) tuỳ quy tắc business.
UPDATE documents SET cloudinary_id = r2_key;

-- 3. Xóa các cột cũ của R2 không còn sử dụng
ALTER TABLE documents DROP COLUMN r2_key;
ALTER TABLE documents DROP COLUMN r2_bucket;

-- 4. Bật lại ràng buộc (Constraint) NOT NULL cho cột mới giống hệt Entity (nếu bạn đảm bảo dữ liệu không bị null)
ALTER TABLE documents MODIFY COLUMN cloudinary_id VARCHAR(512) NOT NULL;
