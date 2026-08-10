/**
 * DEBIAS AI PROTOCOL - MAIN APP CONTROLLER
 * Xử lý tương tác Giao diện, Điều phối Wizard, Supabase Realtime Sync & Ban Giám Khảo Sandbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initArchDiagramInteractivity();
  initWizardFlow();
  initJurySandbox();
  initRealtimeJuryListener();
});

/* 1. Navbar Scroll Header */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(15, 23, 42, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(15, 23, 42, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });
}

/* 2. Interactive Architecture Explorer (Khám phá sơ đồ kiến trúc 4 tầng) */
function initArchDiagramInteractivity() {
  const nodes = document.querySelectorAll('.arch-node');
  const detailsBox = document.getElementById('arch-details-content');

  const archDescriptions = {
    'debias-ui': 'Tầng Giao diện (Debias UI): Giao diện tương tác trực quan cho học sinh THCS/THPT, thiết kế mượt mà hỗ trợ trình diễn trên cả Máy tính & Máy tính bảng cho BGK.',
    'auth-guard': 'Tầng Bảo mật (API Gateway & Auth Guard): Mô phỏng cơ chế xác thực Token, lọc request rác và phân quyền giữa Học sinh & Giám khảo.',
    'debias-orchestrator': 'Bộ Điều phối Quy trình (Protocol Orchestrator): Quản lý luồng xử lý 4 bước qua các Module phản biện chuyên sâu.',
    'devils-advocate': 'Module Người Phản Biện (Devil\'s Advocate): Tự động đặt câu hỏi phản biện chống Định kiến xác nhận (Confirmation Bias).',
    'cross-checker': 'Module Kiểm Chứng Số (Cross-Checker): Trích xuất số liệu thực tế từ Kho dữ liệu để giải độc Định kiến tính sẵn có (Availability Bias).',
    'matrix-4quad': 'Module Ma Trận Phân Tư 4 Ô: Phân tích và cô lập Hiệu ứng đám đông (Bandwagon Effect).',
    'sunk-cost': 'Module Chi Phí Chìm: Tính toán chi phí cơ hội và cảnh báo bẫy tâm lý tiếc nguồn lực đã mất.',
    'market-service': 'Dịch vụ Tích hợp Thị trường: Kết nối API tra cứu thông tin tuyển dụng & xu hướng nghề nghiệp 5 năm.',
    'user-db': 'Supabase Realtime Channel: Kênh lắng nghe sự kiện đẩy dữ liệu tự động cho Màn hình Giám khảo.',
    'market-db': 'Kho Dữ liệu Thị trường Supabase: CSDL Cloud lưu trữ thông tin thực tế về tỉ lệ chọi, thu nhập, nguy cơ AI thay thế.'
  };

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.style.borderColor = 'rgba(255, 255, 255, 0.08)');
      node.style.borderColor = '#0ea5e9';

      const key = node.dataset.nodeKey;
      if (detailsBox && archDescriptions[key]) {
        detailsBox.innerHTML = `<div style="padding: 1rem; background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0ea5e9; border-radius: 6px;">
          <h5 style="color: #38bdf8; margin-bottom: 0.3rem;">ℹ️ Thông tin Chi tiết Tầng Kiến trúc</h5>
          <p style="font-size: 0.9rem; color: #e2e8f0;">${archDescriptions[key]}</p>
        </div>`;
      }
    });
  });
}

/* 3. Wizard Flow Controller (Điều phối luồng 4 bước Debias) */
let currentStep = 1;

function initWizardFlow() {
  updateStepUI(1);

  // Setup Step 1 Select Change
  const careerSelect = document.getElementById('career-select');
  if (careerSelect) {
    careerSelect.addEventListener('change', (e) => {
      const careerId = e.target.value;
      renderDevilsQuestions(careerId);
    });
  }
}

function updateStepUI(step) {
  currentStep = step;

  // Update step indicators
  document.querySelectorAll('.step-item').forEach((item, index) => {
    const stepNum = index + 1;
    item.classList.remove('active', 'completed');
    if (stepNum === step) {
      item.classList.add('active');
    } else if (stepNum < step) {
      item.classList.add('completed');
    }
  });

  // Update progress bar
  const progressBar = document.querySelector('.wizard-progress-bar');
  if (progressBar) {
    const percent = ((step - 1) / 3) * 100;
    progressBar.style.width = `${percent}%`;
  }

  // Update panes visibility
  document.querySelectorAll('.step-pane').forEach((pane, index) => {
    if (index + 1 === step) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
}

function goToStep(step) {
  if (step === 2) {
    const careerSelect = document.getElementById('career-select');
    if (!careerSelect || !careerSelect.value) {
      alert('Vui lòng chọn một ngành nghề hoặc nguyện vọng mong muốn để bắt đầu phản biện!');
      return;
    }
    renderDevilsQuestions(careerSelect.value);
  } else if (step === 4) {
    calculateFinalResults();
  }
  updateStepUI(step);
}

/* Render Module 1: Devil's Questions */
function renderDevilsQuestions(careerId) {
  const container = document.getElementById('devils-questions-container');
  if (!container) return;

  const questions = window.debiasEngine.generateDevilsQuestions(careerId);
  let html = '';

  questions.forEach((q, qIndex) => {
    html += `
      <div style="background: rgba(30, 41, 59, 0.6); padding: 1.25rem; border-radius: 10px; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.08);">
        <h5 style="color: #fbbf24; margin-bottom: 0.75rem;">Câu ${qIndex + 1}: ${q.question}</h5>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    `;

    q.options.forEach((opt, oIndex) => {
      html += `
        <label style="display: flex; align-items: center; gap: 0.75rem; background: rgba(15, 23, 42, 0.6); padding: 0.65rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
          <input type="radio" name="${q.id}" value="${opt.biasPoints}" ${oIndex === 0 ? 'checked' : ''}>
          <span>${opt.text}</span>
        </label>
      `;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}

/* Compute and Display Final Scorecard & Save to Supabase */
function calculateFinalResults() {
  const careerSelect = document.getElementById('career-select');
  const careerId = careerSelect ? careerSelect.value : 'it_software';

  // 1. Devil's Advocate Score
  let confPoints = 0;
  document.querySelectorAll('#devils-questions-container input[type="radio"]:checked').forEach(radio => {
    confPoints += parseInt(radio.value, 10);
  });

  // 2. Cross-Checker Availability Bias
  const perceivedSalary = document.getElementById('perceived-salary') ? document.getElementById('perceived-salary').value : 'high';
  const perceivedComp = document.getElementById('perceived-comp') ? document.getElementById('perceived-comp').value : 'easy';
  const availResult = window.debiasEngine.evaluateAvailabilityBias(perceivedSalary, perceivedComp, careerId);

  // 3. Bandwagon Effect
  const influences = [];
  document.querySelectorAll('.influence-checkbox:checked').forEach(cb => {
    influences.push(cb.value);
  });
  const bandwagonResult = window.debiasEngine.evaluateBandwagonEffect(influences);

  // 4. Sunk Cost Fallacy
  const years = parseInt(document.getElementById('sunk-years') ? document.getElementById('sunk-years').value : '1', 10);
  const reluctance = parseInt(document.getElementById('sunk-reluctance') ? document.getElementById('sunk-reluctance').value : '2', 10);
  const sunkResult = window.debiasEngine.calculateSunkCost(years, 0, reluctance);

  // Final Overall Score
  const final = window.debiasEngine.computeFinalDebiasScore(confPoints, availResult.biasPoints, bandwagonResult.bandwagonScore, sunkResult.sunkCostPoints);

  // Render Result UI
  const resultScoreBox = document.getElementById('final-score-display');
  if (resultScoreBox) {
    resultScoreBox.innerHTML = `
      <div style="font-size: 3.5rem; font-weight: 800; color: ${final.colorCode}; line-height: 1;">${final.score}%</div>
      <div style="font-weight: 700; color: #fff; margin-top: 0.5rem; font-size: 1.1rem;">${final.classification}</div>
      <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.25rem;">Chỉ số Tư duy Khách quan (Objectivity Index): <strong style="color: #34d399;">${final.objectivityIndex}/100 điểm</strong></div>
    `;
  }

  // Render Detailed Analysis Table
  const reportDetails = document.getElementById('report-breakdown-details');
  if (reportDetails) {
    reportDetails.innerHTML = `
      <table class="custom-table">
        <thead>
          <tr>
            <th>Module Phân tích</th>
            <th>Loại Định kiến Kiểm tra</th>
            <th>Mức độ Định kiến Phát hiện</th>
            <th>Đánh giá & Khuyên giải</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #fbbf24;">Module 1: Devil's Advocate</strong></td>
            <td>Định kiến Xác nhận (Confirmation Bias)</td>
            <td><span style="color: ${confPoints > 30 ? '#ef4444' : '#10b981'}; font-weight: 700;">${confPoints} điểm</span></td>
            <td>${confPoints > 30 ? 'Cần chủ động tìm kiếm các thông tin trái chiều & rủi ro nghề nghiệp' : 'Tư duy chủ động, đã chuẩn bị tâm lý tốt'}</td>
          </tr>
          <tr>
            <td><strong style="color: #38bdf8;">Module 2: Cross-Checker</strong></td>
            <td>Định kiến Tính sẵn có (Availability Bias)</td>
            <td><span style="color: ${availResult.biasPoints > 20 ? '#ef4444' : '#10b981'}; font-weight: 700;">${availResult.biasPoints} điểm</span></td>
            <td>${availResult.analysis}</td>
          </tr>
          <tr>
            <td><strong style="color: #a78bfa;">Module 3: Ma trận 4 Ô</strong></td>
            <td>Hiệu ứng Đám đông (Bandwagon Effect)</td>
            <td><span style="color: ${bandwagonResult.bandwagonScore > 40 ? '#ef4444' : '#10b981'}; font-weight: 700;">${bandwagonResult.bandwagonScore}%</span></td>
            <td>${bandwagonResult.level}</td>
          </tr>
          <tr>
            <td><strong style="color: #f43f5e;">Module 4: Thuật toán Chi phí chìm</strong></td>
            <td>Bẫy Chi phí chìm (Sunk Cost Fallacy)</td>
            <td><span style="color: ${sunkResult.sunkCostPoints > 40 ? '#ef4444' : '#10b981'}; font-weight: 700;">${sunkResult.sunkCostPoints} điểm</span></td>
            <td>${sunkResult.opportunityCostWarning}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const assessmentPayload = {
    studentName: 'Học sinh KHKT',
    careerCode: careerId,
    confScore: confPoints,
    availScore: availResult.biasPoints,
    bandScore: bandwagonResult.bandwagonScore,
    sunkScore: sunkResult.sunkCostPoints,
    overallScore: final.score,
    objectivityIndex: final.objectivityIndex,
    classification: final.classification
  };

  // Kích hoạt hiển thị Realtime Feed trên Màn hình BGK Sandbox
  handleRealtimeEvent(assessmentPayload);

  // Tự động đồng bộ kết quả lên Supabase Cloud DB
  if (typeof saveAssessmentToSupabase === 'function') {
    saveAssessmentToSupabase(assessmentPayload).then(res => {
      const badge = document.getElementById('supabase-status-badge');
      if (badge && res) {
        badge.innerHTML = '⚡ Đã bắn sự kiện Realtime Supabase Cloud';
        badge.style.color = '#38bdf8';
      }
    });
  }
}

/* 4. Supabase Realtime Listener Integration for Jury Sandbox */
function initRealtimeJuryListener() {
  if (typeof subscribeToRealtimeAssessments === 'function') {
    subscribeToRealtimeAssessments((newRecord) => {
      handleRealtimeEvent(newRecord);
    });
  }
}

function handleRealtimeEvent(record) {
  const banner = document.getElementById('realtime-notification-banner');
  const bannerContent = document.getElementById('realtime-banner-content');
  const feed = document.getElementById('realtime-jury-feed');
  const placeholder = document.getElementById('empty-feed-placeholder');

  if (placeholder) placeholder.style.display = 'none';

  const timeStr = new Date().toLocaleTimeString('vi-VN');
  const studentName = record.student_name || record.studentName || 'Học sinh KHKT';
  const score = record.overall_debias_score !== undefined ? record.overall_debias_score : (record.overallScore || 0);
  const classification = record.classification || 'Phân tích tư duy hoàn tất';

  // 1. Hiển thị Banner Thông báo Nhấp nháy
  if (banner && bannerContent) {
    bannerContent.innerHTML = `
      <strong>⚡ [REALTIME EVENT - ${timeStr}]</strong> Có đánh giá tư duy mới từ <strong>${studentName}</strong>!<br>
      <span style="color: #34d399; font-weight: 700;">Chỉ số Định kiến: ${score}%</span> — Xếp loại: <em>${classification}</em>
    `;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 6000);
  }

  // 2. Đẩy thêm 1 dòng log vào Realtime Jury Feed
  if (feed) {
    const item = document.createElement('div');
    item.style.cssText = 'background: rgba(30, 41, 59, 0.8); border-left: 4px solid #10b981; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.75rem; animation: fadeIn 0.4s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.3);';
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8;">
        <span><i class="fa-solid fa-clock"></i> ${timeStr}</span>
        <span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-bolt"></i> REALTIME EVENT</span>
      </div>
      <div style="font-weight: 700; color: #fff; font-size: 0.9rem; margin: 0.25rem 0;">${studentName} - Mã ngành: <code>${record.career_code || record.careerCode}</code></div>
      <div style="font-size: 0.8rem; color: #38bdf8;">Định kiến: <strong style="color: #fbbf24;">${score}%</strong> | ${classification}</div>
    `;
    feed.insertBefore(item, feed.firstChild);
  }
}

/* 5. Jury Sandbox Presets (Kịch bản dùng thử 1-Click cho Ban Giám Khảo) */
function initJurySandbox() {
  const presetBtns = document.querySelectorAll('.load-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const caseId = e.currentTarget.dataset.caseId;
      loadJuryPresetCase(caseId);
    });
  });
}

function loadJuryPresetCase(caseId) {
  const careerSelect = document.getElementById('career-select');

  if (caseId === 'case_it_hype') {
    if (careerSelect) careerSelect.value = 'it_software';
    document.getElementById('perceived-salary').value = 'very_high';
    document.getElementById('perceived-comp').value = 'easy';
    
    document.querySelectorAll('.influence-checkbox').forEach(cb => {
      cb.checked = (cb.value === 'viral_tiktok' || cb.value === 'friends_choice');
    });

    alert('✅ Đã nạp Kịch bản BGK 1: "Chạy theo trào lưu IT lương 50 triệu". Nhấn OK để xem tín hiệu Realtime!');
    goToStep(4);

  } else if (caseId === 'case_bandwagon_mkt') {
    if (careerSelect) careerSelect.value = 'business_marketing';
    document.getElementById('perceived-salary').value = 'high';
    document.getElementById('perceived-comp').value = 'easy';

    document.querySelectorAll('.influence-checkbox').forEach(cb => {
      cb.checked = (cb.value === 'friends_choice' || cb.value === 'parent_demand');
    });

    alert('✅ Đã nạp Kịch bản BGK 2: "Chọn Marketing vì bạn bè đăng ký đông". Nhấn OK để xem tín hiệu Realtime!');
    goToStep(4);

  } else if (caseId === 'case_sunk_cost') {
    if (careerSelect) careerSelect.value = 'finance_banking';
    document.getElementById('sunk-years').value = '3';
    document.getElementById('sunk-reluctance').value = '3';

    alert('✅ Đã nạp Kịch bản BGK 3: "Bẫy chi phí chìm - Ngại thay đổi vì tiếc 3 năm theo học". Nhấn OK để xem tín hiệu Realtime!');
    goToStep(4);
  }
}

// Print / Export PDF function for Jury Presentation
function exportJuryReport() {
  window.print();
}
