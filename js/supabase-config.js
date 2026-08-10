/**
 * DEBIAS AI PROTOCOL - SUPABASE CONFIGURATION & CLIENT
 * Thầy/Cô điền URL và ANON KEY từ bảng điều khiển Supabase vào 2 biến dưới đây:
 */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"; // Thay bằng URL dự án Supabase (VD: https://xyz.supabase.co)
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // Thay bằng ANON Key công khai từ Supabase API Settings

let supabaseClient = null;

// Khởi tạo Supabase Client nếu có CDN SDK
if (typeof supabase !== 'undefined' && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL") {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("⚡ Supabase Client initialized successfully!");
  } catch (err) {
    console.warn("⚠️ Chưa cấu hình Supabase URL/Key hợp lệ. Đang dùng chế độ Mock Data.", err);
  }
} else {
  console.log("ℹ️ Đang chạy ở chế độ offline/local data. Để kết nối Supabase, vui lòng cập nhật SUPABASE_URL & SUPABASE_ANON_KEY trong js/supabase-config.js");
}

/**
 * Tải Dữ liệu Thị trường Lao động từ Supabase
 */
async function loadLaborMarketFromSupabase() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from('labor_market_repository')
      .select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Lỗi tải CSDL từ Supabase:", err);
    return null;
  }
}

/**
 * Lưu Kết quả Đánh giá Định kiến Tư duy lên Supabase Table `debias_assessments`
 */
async function saveAssessmentToSupabase(assessmentData) {
  if (!supabaseClient) {
    console.log("ℹ️ [Local Mode] Kết quả chưa đồng bộ lên Supabase do chưa nhập URL/Key.");
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('debias_assessments')
      .insert([
        {
          student_name: assessmentData.studentName || 'Học sinh KHKT',
          career_code: assessmentData.careerCode,
          confirmation_bias_score: assessmentData.confScore,
          availability_bias_score: assessmentData.availScore,
          bandwagon_bias_score: assessmentData.bandScore,
          sunk_cost_bias_score: assessmentData.sunkScore,
          overall_debias_score: assessmentData.overallScore,
          objectivity_index: assessmentData.objectivityIndex,
          classification: assessmentData.classification
        }
      ])
      .select();

    if (error) throw error;
    console.log("✅ Đã lưu kết quả thành công lên Supabase Cloud DB:", data);
    return data;
  } catch (err) {
    console.error("❌ Lỗi lưu dữ liệu lên Supabase:", err.message);
    return null;
  }
}
