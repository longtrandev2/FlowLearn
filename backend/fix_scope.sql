-- Chạy đoạn script này trong DB (qua MySQL Workbench/DataGrip) để update lại cấu trúc cột chuẩn mới

USE flowlearn_db;

-- 1. Nếu bạn đã có dữ liệu trong bảng study_sessions, đổi tên cột scope_id thành file_id
ALTER TABLE study_sessions CHANGE COLUMN `scope_id` `file_id` VARCHAR(36) NOT NULL;

-- 2. Xóa cột scope khỏi database (vì ứng dụng không dùng nữa)
ALTER TABLE study_sessions DROP COLUMN `scope`;