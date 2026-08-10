/**
 * DEBIAS AI PROTOCOL - SUPABASE CONFIGURATION & AUTH SYSTEM
 * Tích hợp hệ thống Đăng ký / Đăng nhập Username & Mật khẩu đồng bộ Supabase Cloud
 */

const SUPABASE_URL = "https://fwfjciayddfrllskjqna.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZmpjaWF5ZGRmcmxsc2tqcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNzkzNjAsImV4cCI6MjEwMTc1NTM2MH0.BTxM4SlNk6_kgLizggoXCcoqNF4Z6D7roRqM-VJDyN4";

let supabaseClient = null;

// Khởi tạo Supabase Client
if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("⚡ [SUPABASE AUTH] Đã kết nối hệ thống Đăng nhập / Đăng ký Supabase Cloud DB!");
  } catch (err) {
    console.warn("⚠️ Khởi tạo Supabase Client thất bại:", err);
  }
}

/**
 * 1. ĐĂNG KÝ TÀI KHOẢN MỚI (Lưu trực tiếp vào Supabase public.users_auth)
 */
async function registerUserSupabase(username, password, fullName, schoolName, gradeLevel, role) {
  if (!supabaseClient) {
    return { success: false, message: "Supabase chưa sẵn sàng." };
  }

  try {
    // Check if username already exists
    const { data: existingUser } = await supabaseClient
      .from('users_auth')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return { success: false, message: `Tên đăng nhập "${username}" đã tồn tại trên hệ thống. Vui lòng chọn username khác!` };
    }

    // Insert new user record into Supabase
    const { data, error } = await supabaseClient
      .from('users_auth')
      .insert([
        {
          username: username,
          password_hash: password, // Mật khẩu lưu đồng bộ trên Supabase
          full_name: fullName,
          school_name: schoolName,
          grade_level: gradeLevel,
          role: role || 'student'
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, user: data[0], message: "Đăng ký tài khoản thành công!" };

  } catch (err) {
    console.error("Lỗi đăng ký Supabase:", err.message);
    return { success: false, message: `Lỗi đăng ký: ${err.message}` };
  }
}

/**
 * 2. ĐĂNG NHẬP HỆ THỐNG (Đồng bộ tra cứu từ Supabase public.users_auth)
 */
async function loginUserSupabase(username, password) {
  if (!supabaseClient) {
    return { success: false, message: "Supabase chưa sẵn sàng." };
  }

  try {
    const { data, error } = await supabaseClient
      .from('users_auth')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();

    if (error || !data) {
      return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
    }

    return { success: true, user: data, message: "Đăng nhập thành công!" };

  } catch (err) {
    console.error("Lỗi đăng nhập Supabase:", err.message);
    return { success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng!" };
  }
}

/**
 * 3. LƯU KẾT QUẢ ĐÁNH GIÁ (Gắn ID & Username người dùng đã đăng nhập)
 */
async function saveAssessmentToSupabase(assessmentData) {
  if (!supabaseClient) return null;

  try {
    const currentUser = JSON.parse(localStorage.getItem('khkt_current_user') || '{}');

    const payload = {
      user_id: currentUser.id || null,
      username: currentUser.username || 'hocsinh_khkt',
      student_name: currentUser.full_name || assessmentData.studentName || 'Học sinh KHKT',
      career_code: assessmentData.careerCode,
      confirmation_bias_score: assessmentData.confScore,
      availability_bias_score: assessmentData.availScore,
      bandwagon_bias_score: assessmentData.bandScore,
      sunk_cost_bias_score: assessmentData.sunkScore,
      overall_debias_score: assessmentData.overallScore,
      objectivity_index: assessmentData.objectivityIndex,
      classification: assessmentData.classification
    };

    const { data, error } = await supabaseClient
      .from('debias_assessments')
      .insert([payload])
      .select();

    if (error) throw error;
    console.log("✅ [LIVE SUPABASE] Đã lưu bài test theo User:", data);
    return data;

  } catch (err) {
    console.warn("⚠️ Lỗi lưu đánh giá lên Supabase:", err.message);
    return null;
  }
}

/**
 * 4. ĐĂNG KÝ LISTENER REALTIME FOR JURY MONITOR
 */
function subscribeToRealtimeAssessments(onNewAssessmentCallback) {
  if (!supabaseClient) return null;

  const channel = supabaseClient
    .channel('realtime_debias_assessments')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'debias_assessments' },
      (payload) => {
        console.log('⚡ [LIVE REALTIME EVENT] Đánh giá mới từ Supabase:', payload.new);
        if (typeof onNewAssessmentCallback === 'function') {
          onNewAssessmentCallback(payload.new);
        }
      }
    )
    .subscribe();

  return channel;
}
