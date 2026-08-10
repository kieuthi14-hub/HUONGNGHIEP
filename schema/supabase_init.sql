-- ============================================================================
-- DEBIAS AI PROTOCOL - SUPABASE (POSTGRESQL) DATABASE INITIALIZATION WITH AUTH
-- Ngôn ngữ: PostgreSQL / Supabase SQL Editor
-- Tác giả: Super Agent AI
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. Bảng public.users_auth (Đăng ký & Đăng nhập bằng Username / Mật khẩu)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.bias_logs CASCADE;
DROP TABLE IF EXISTS public.debias_assessments CASCADE;
DROP TABLE IF EXISTS public.labor_market_repository CASCADE;
DROP TABLE IF EXISTS public.users_auth CASCADE;

CREATE TABLE public.users_auth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  school_name TEXT,
  grade_level TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'jury', 'admin')),
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
  user_id UUID REFERENCES public.users_auth(id) ON DELETE SET NULL,
  username TEXT DEFAULT 'hocsinh_khkt',
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
-- 4. Bảng public.bias_logs (Chi tiết nhật ký từng câu hỏi)
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
-- CẤU HÌNH ROW LEVEL SECURITY (RLS) SUPABASE
-- ============================================================================

ALTER TABLE public.users_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_market_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debias_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bias_logs ENABLE ROW LEVEL SECURITY;

-- Policies cho users_auth
CREATE POLICY "Public Select UsersAuth" ON public.users_auth FOR SELECT USING (true);
CREATE POLICY "Public Insert UsersAuth" ON public.users_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update UsersAuth" ON public.users_auth FOR UPDATE USING (true);

-- Policies cho các bảng khác
CREATE POLICY "Public Read Labor Data" ON public.labor_market_repository FOR SELECT USING (true);
CREATE POLICY "Public Read Assessments" ON public.debias_assessments FOR SELECT USING (true);
CREATE POLICY "Public Read Bias Logs" ON public.bias_logs FOR SELECT USING (true);

CREATE POLICY "Public Insert Assessments" ON public.debias_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bias Logs" ON public.bias_logs FOR INSERT WITH CHECK (true);

-- Bật Realtime Subscription cho Màn hình Ban Giám Khảo
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.debias_assessments;
  END IF;
END $$;

-- ============================================================================
-- NẠP DỮ LIỆU TÀI KHOẢN MẪU & THỊ TRƯỜNG LAO ĐỘNG (SEED DATA)
-- ============================================================================

-- Tài khoản học sinh mẫu: username: kieuthi14 | pass: 123456
-- Tài khoản giám khảo mẫu: username: giamkhao | pass: 123456
INSERT INTO public.users_auth (username, password_hash, full_name, school_name, grade_level, role) VALUES
('kieuthi14', '123456', 'Kiều Thị B', 'THPT Chuyên KHKT', 'Lớp 11A1', 'student'),
('giamkhao', '123456', 'Ban Giám Khảo KHKT', 'Hội đồng Khoa học KHKT', 'Giám khảo Quốc gia', 'jury')
ON CONFLICT (username) DO NOTHING;

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
 '["Áp lực KPI doanh số cực kỳ khắc nghiệt", "Cần kỹ năng phân tích dữ liệu chuyên sâu"]'::jsonb)
ON CONFLICT (career_code) DO NOTHING;
