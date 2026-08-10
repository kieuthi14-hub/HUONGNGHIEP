-- ============================================================================
-- DEBIAS AI PROTOCOL - KHKT DATABASE SCHEMA INITIALIZATION
-- Ngôn ngữ: MySQL / MariaDB / PostgreSQL Compatible SQL
-- Tác giả: Super Agent AI
-- ============================================================================

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `debias_khkt_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `debias_khkt_db`;

-- ----------------------------------------------------------------------------
-- Bảng 1: users (Quản lý hồ sơ Học sinh & Ban Giám kháo)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL COMMENT 'Họ và tên người dùng',
  `email` VARCHAR(191) NOT NULL UNIQUE COMMENT 'Địa chỉ email',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa',
  `role` ENUM('student', 'jury', 'admin') DEFAULT 'student' COMMENT 'Phân quyền: Học sinh, Giám khảo, Quản trị',
  `school_name` VARCHAR(255) NULL COMMENT 'Tên trường học THCS/THPT',
  `grade_level` VARCHAR(50) NULL COMMENT 'Khối lớp (VD: Lớp 11)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Bảng 2: labor_market_repository (Kho dữ liệu Thị trường Lao động thực tế)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `labor_market_repository`;
CREATE TABLE `labor_market_repository` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `career_code` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Mã ngành nghề (VD: it_software)',
  `career_name` VARCHAR(255) NOT NULL COMMENT 'Tên ngành nghề',
  `avg_salary_range` VARCHAR(100) NOT NULL COMMENT 'Khoảng thu nhập trung bình thực tế',
  `annual_growth_rate` VARCHAR(50) NOT NULL COMMENT 'Tốc độ tăng trưởng hàng năm',
  `competition_ratio` VARCHAR(50) NOT NULL COMMENT 'Tỉ lệ chọi cạnh tranh',
  `automation_risk_percent` INT NOT NULL COMMENT 'Nguy cơ bị AI/Tự động hóa thay thế (%)',
  `common_myths_json` TEXT NULL COMMENT 'Danh sách các lầm tưởng phổ biến (JSON)',
  `realities_json` TEXT NULL COMMENT 'Thực tế môi trường làm việc (JSON)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Bảng 3: debias_assessments (Lưu trữ các Phiên Đánh giá Tư duy)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `debias_assessments`;
CREATE TABLE `debias_assessments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL COMMENT 'Khóa ngoại liên kết bảng users',
  `career_code` VARCHAR(100) NOT NULL COMMENT 'Ngành nghề đăng ký đánh giá',
  `confirmation_bias_score` INT NOT NULL DEFAULT 0 COMMENT 'Điểm Định kiến Xác nhận (0-100)',
  `availability_bias_score` INT NOT NULL DEFAULT 0 COMMENT 'Điểm Định kiến Tính sẵn có (0-100)',
  `bandwagon_bias_score` INT NOT NULL DEFAULT 0 COMMENT 'Điểm Hiệu ứng Đám đông (0-100)',
  `sunk_cost_bias_score` INT NOT NULL DEFAULT 0 COMMENT 'Điểm Bẫy Chi phí Chìm (0-100)',
  `overall_debias_score` INT NOT NULL DEFAULT 0 COMMENT 'Chỉ số Định kiến Tư duy Tổng hợp (%)',
  `objectivity_index` INT NOT NULL DEFAULT 100 COMMENT 'Chỉ số Tư duy Khách quan (100 - overall)',
  `classification` VARCHAR(255) NOT NULL COMMENT 'Xếp loại tư duy',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_assessments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Bảng 4: bias_logs (Nhật ký Phản biện & Câu trả lời Chi tiết)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `bias_logs`;
CREATE TABLE `bias_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessment_id` INT NOT NULL COMMENT 'Khóa ngoại liên kết bảng debias_assessments',
  `module_name` VARCHAR(100) NOT NULL COMMENT 'Tên Module (DevilsAdvocate, CrossChecker, 4Quad, SunkCost)',
  `question_asked` TEXT NOT NULL COMMENT 'Câu hỏi hoặc chỉ số đối chiếu',
  `user_response` TEXT NOT NULL COMMENT 'Câu trả lời của học sinh',
  `detected_bias` VARCHAR(255) NULL COMMENT 'Loại định kiến phát hiện',
  `recommendation` TEXT NULL COMMENT 'Khuyến nghị khuyên giải từ hệ thống',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_logs_assessment` FOREIGN KEY (`assessment_id`) REFERENCES `debias_assessments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NẠP DỮ LIỆU MẪU (SEED DATA FOR TESTING & JURY DEMO)
-- ============================================================================

INSERT INTO `users` (`full_name`, `email`, `password_hash`, `role`, `school_name`, `grade_level`) VALUES
('Kiều Thị B', 'kieuthi14@khkt.edu.vn', '$2a$12$eImiTXuWVxfM37uY4JANjO5614i6iXn18f15g.w08g58a', 'student', 'THPT Chuyên KHKT', 'Lớp 11A1'),
('Ban Giám Khảo KHKT', 'giamkhao@khkt.gov.vn', '$2a$12$eImiTXuWVxfM37uY4JANjO5614i6iXn18f15g.w08g58a', 'jury', 'Hội đồng Khoa học KHKT', 'Giám khảo Quốc gia');

INSERT INTO `labor_market_repository` 
(`career_code`, `career_name`, `avg_salary_range`, `annual_growth_rate`, `competition_ratio`, `automation_risk_percent`, `common_myths_json`, `realities_json`) 
VALUES
('it_software', 'Công nghệ thông tin & Phần mềm', '18 - 45 triệu VNĐ/tháng', '+16.5%', '1 : 8.5', 12, 
 '["Lương 50 triệu ngay khi mới ra trường", "Làm việc tự do không áp lực"]', 
 '["Áp lực học công nghệ mới liên tục", "Tỉ lệ đào thải sau tuổi 35 nếu không nâng cấp kỹ năng"]'),

('medicine_pharmacy', 'Y khoa & Dược học', '15 - 40 triệu VNĐ/tháng', '+12.0%', '1 : 12.0', 5, 
 '["Học Y ra làm bác sĩ giàu sang ngay", "Chỉ cần thuộc lòng sách vở"]', 
 '["Thời gian đào tạo 6-9 năm", "Trực đêm dày đặc và áp lực tâm lý cao"]'),

('business_marketing', 'Quản trị Kinh doanh & Marketing', '10 - 30 triệu VNĐ/tháng', '+10.5%', '1 : 15.0', 35, 
 '["Ra trường làm giám đốc ngay", "Chỉ cần quay video TikTok vui vẻ"]', 
 '["Áp lực KPI doanh số cực kỳ khắc nghiệt", "Cần kỹ năng phân tích dữ liệu chuyên sâu"]');
