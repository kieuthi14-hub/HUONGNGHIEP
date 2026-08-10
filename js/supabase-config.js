/**
 * DEBIAS AI PROTOCOL - SUPABASE CONFIGURATION & REALTIME CLIENT
 * Đã kết nối dự án Supabase chính thức của thầy/cô (Ref: fwfjciayddfrllskjqna)
 */

const SUPABASE_URL = "https://fwfjciayddfrllskjqna.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZmpjaWF5ZGRmcmxsc2tqcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNzkzNjAsImV4cCI6MjEwMTc1NTM2MH0.BTxM4SlNk6_kgLizggoXCcoqNF4Z6D7roRqM-VJDyN4";

let supabaseClient = null;

// Khởi tạo Supabase Client
if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("⚡ [LIVE SUPABASE] Đã kết nối thành công tới Supabase Project: https://fwfjciayddfrllskjqna.supabase.co");
  } catch (err) {
    console.warn("⚠️ Khởi tạo Supabase Client thất bại:", err);
  }
}

/**
 * Tải Dữ liệu Thị trường Lao động từ Supabase Cloud DB
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
    console.warn("ℹ️ Đang dùng dữ liệu dự phòng cục bộ do chưa chạy SQL khởi tạo trên Supabase.", err.message);
    return null;
  }
}

/**
 * Lưu Kết quả Đánh giá Định kiến Tư duy lên Supabase Table `debias_assessments`
 */
async function saveAssessmentToSupabase(assessmentData) {
  if (!supabaseClient) {
    console.log("ℹ️ [Local Mode] Chưa khởi tạo Supabase Client.");
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
    console.log("✅ [LIVE SUPABASE] Đã đồng bộ thành công lên Supabase Cloud DB:", data);
    return data;
  } catch (err) {
    console.warn("ℹ️ Cần chạy tệp schema/supabase_init.sql trong SQL Editor của Supabase để tạo bảng:", err.message);
    return null;
  }
}

/**
 * Đăng ký Listener Realtime Subscriptions cho Màn hình Ban Giám Khảo (Jury Monitor)
 */
function subscribeToRealtimeAssessments(onNewAssessmentCallback) {
  if (!supabaseClient) return null;

  const channel = supabaseClient
    .channel('realtime_debias_assessments')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'debias_assessments' },
      (payload) => {
        console.log('⚡ [LIVE REALTIME EVENT] Đã nhận đánh giá mới từ Supabase:', payload.new);
        if (typeof onNewAssessmentCallback === 'function') {
          onNewAssessmentCallback(payload.new);
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 Trạng thái Supabase Realtime Channel:', status);
    });

  return channel;
}
