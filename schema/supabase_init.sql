-- ============================================================================
-- DEBIAS AI PROTOCOL - SUPABASE (POSTGRESQL) DATABASE INITIALIZATION
-- Ngôn ngữ: PostgreSQL / Supabase SQL Editor
-- Tác giả: Super Agent AI
-- ============================================================================

-- Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. Bảng public.profiles (Lưu thông tin Học sinh & Giám khảo)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.bias_logs CASCADE;
DROP TABLE IF EXISTS public.debias_assessments CASCADE;
DROP TABLE IF EXISTS public.labor_market_repository CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'jury', 'admin')),
  school_name TEXT,
  grade_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. Bảng public.labor_market_repository (Kho dữ liệu Lao động kiểm chứng)
-- ----------------------------------------------------------------------------
CREATE TABLE public.labor_market_repository (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  career_code TEXT UNIQUE NOT NULL,
  career_name TEXT NOT NULL,
  avg_salary_range TEXT NOT NULL,
  annual_growth_rate TEXT NOT NULL,
  competition_ratio TEXT NOT NULL,
  automation_risk_percent INT NOT NULL,
  common_myths JSONB DEFAULT '[]'::jsonb,
  realities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. Bảng public.debias_assessments (Kết quả Phiên Đánh giá Tư duy)
-- ----------------------------------------------------------------------------
CREATE TABLE public.debias_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT DEFAULT 'Học sinh KHKT',
  career_code TEXT NOT NULL,
  confirmation_bias_score INT DEFAULT 0,
  availability_bias_score INT DEFAULT 0,
  bandwagon_bias_score INT DEFAULT 0,
  sunk_cost_bias_score INT DEFAULT 0,
  overall_debias_score INT DEFAULT 0,
  objectivity_index INT DEFAULT 100,
  classification TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. Bảng public.bias_logs (Chi tiết nhật ký phản biện từng câu hỏi)
-- ----------------------------------------------------------------------------
CREATE TABLE public.bias_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  assessment_id UUID REFERENCES public.debias_assessments(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  question_asked TEXT NOT NULL,
  user_response TEXT NOT NULL,
  detected_bias TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CẤU HÌNH ROW LEVEL SECURITY (RLS) - BẢO MẬT & QUYỀN TRUY CẬP SUPABASE
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_market_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debias_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bias_logs ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai (Public Read) cho mọi bảng
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Labor Data" ON public.labor_market_repository FOR SELECT USING (true);
CREATE POLICY "Public Read Assessments" ON public.debias_assessments FOR SELECT USING (true);
CREATE POLICY "Public Read Bias Logs" ON public.bias_logs FOR SELECT USING (true);

-- Cho phép ghi dữ liệu công khai (Public Insert) từ Web App
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Assessments" ON public.debias_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bias Logs" ON public.bias_logs FOR INSERT WITH CHECK (true);

-- ============================================================================
-- NẠP DỮ LIỆU MẪU (SEED DATA CHO SUPABASE)
-- ============================================================================

INSERT INTO public.profiles (full_name, email, role, school_name, grade_level) VALUES
('Kiều Thị B', 'kieuthi14@khkt.edu.vn', 'student', 'THPT Chuyên KHKT', 'Lớp 11A1'),
('Ban Giám Khảo KHKT', 'giamkhao@khkt.gov.vn', 'jury', 'Hội đồng Khoa học KHKT', 'Giám khảo Quốc gia');

INSERT INTO public.labor_market_repository 
(career_code, career_name, avg_salary_range, annual_growth_rate, competition_ratio, automation_risk_percent, common_myths, realities) 
VALUES
('it_software', 'Công nghệ thông tin & Phần mềm', '18 - 45 triệu VNĐ/tháng', '+16.5%', '1 : 8.5', 12, 
 '["Lương 50 triệu ngay khi mới ra trường", "Làm việc tự do không áp lực"]'::jsonb, 
 '["Áp lực học công nghệ mới liên tục", "Tỉ lệ đào thải sau tuổi 35 nếu không nâng cấp kỹ năng"]'::jsonb),

('medicine_pharmacy', 'Y khoa & Dược học', '15 - 40 triệu VNĐ/tháng', '+12.0%', '1 : 12.0', 5, 
 '["Học Y ra làm bác sĩ giàu sang ngay", "Chỉ cần thuộc lòng sách vở"]'::jsonb, 
 '["Thời gian đào tạo 6-9 năm", "Trực đêm dày đặc và áp lực tâm lý cao"]'::jsonb),

('business_marketing', 'Quản trị Kinh doanh & Marketing', '10 - 30 triệu VNĐ/tháng', '+10.5%', '1 : 15.0', 35, 
 '["Ra trường làm giám đốc ngay", "Chỉ cần quay video TikTok vui vẻ"]'::jsonb, 
 '["Áp lực KPI doanh số cực kỳ khắc nghiệt", "Cần kỹ năng phân tích dữ liệu chuyên sâu"]'::jsonb);
