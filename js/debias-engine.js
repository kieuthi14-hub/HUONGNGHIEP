/**
 * DEBIAS AI PROTOCOL - ENGINE MODULE
 * Thuật toán Giảm thiểu Định kiến Tư duy (Debias Algorithm Framework)
 * Đề tài Khoa học Kỹ thuật KHKT
 */

class DebiasEngine {
  constructor() {
    this.sessionState = {
      careerChoice: '',
      reasoningText: '',
      confirmationAnswers: {},
      availabilityScore: 0,
      bandwagonScore: 0,
      sunkCostScore: 0,
      finalDebiasScore: 0
    };
  }

  /**
   * Module 1: Devil's Advocate (Chống Confirmation Bias - Định kiến xác nhận)
   * Tạo bộ câu hỏi phản biện dựa trên ngành nghề đã chọn
   */
  generateDevilsQuestions(careerId) {
    const market = LABOR_MARKET_DATA[careerId] || LABOR_MARKET_DATA["it_software"];
    return [
      {
        id: "q1_risk",
        question: `Bạn đã bao giờ chủ động tìm hiểu 3 RỦI RO LỚN NHẤT hoặc MẶT TỐI của ngành ${market.name} chưa?`,
        options: [
          { text: "Chưa, em chỉ tìm hiểu các bài viết khen ngợi & thành công", biasPoints: 25 },
          { text: "Có nghe qua nhưng nghĩ mình sẽ không gặp phải", biasPoints: 15 },
          { text: "Đã nghiên cứu kỹ và có phương án phòng ngừa thực tế", biasPoints: 0 }
        ]
      },
      {
        id: "q2_effort",
        question: `Nếu trong 3 năm đầu ra trường, thu nhập thấp hơn kỳ vọng và áp lực công việc gấp đôi dự kiến, bạn sẽ làm gì?`,
        options: [
          { text: "Nản lòng và hối hận vì chọn ngành này", biasPoints: 25 },
          { text: "Cố chịu đựng nhưng không biết đi về đâu", biasPoints: 15 },
          { text: "Đã lường trước và lên lộ trình tích lũy năng lực lâu dài", biasPoints: 0 }
        ]
      },
      {
        id: "q3_alternative",
        question: `Nếu ngành ${market.name} bị ảnh hưởng mạnh bởi AI/Tự động hóa trong 5 năm tới, bạn có phương án dự phòng nào?`,
        options: [
          { text: "Chưa nghĩ tới vì tin rằng ngành này không bao giờ lỗi thời", biasPoints: 25 },
          { text: "Có biết đến nguy cơ AI nhưng chưa biết chuẩn bị gì", biasPoints: 15 },
          { text: "Đang trau dồi các kỹ năng cốt lõi không thể thay thế bởi AI", biasPoints: 0 }
        ]
      }
    ];
  }

  /**
   * Module 2: Cross-Checker (Chống Availability Bias - Định kiến tính sẵn có)
   * So sánh thông tin cảm tính của người dùng với Kho dữ liệu lao động thực tế
   */
  evaluateAvailabilityBias(perceivedSalary, perceivedCompetition, careerId) {
    const data = LABOR_MARKET_DATA[careerId] || LABOR_MARKET_DATA["it_software"];
    
    // Thuật toán tính độ lệch giữa cảm tính và thực tế
    let biasPoints = 0;
    if (perceivedSalary === 'very_high') biasPoints += 20;
    if (perceivedCompetition === 'easy') biasPoints += 30;

    return {
      realData: data,
      biasPoints: biasPoints,
      analysis: `Số liệu thực tế: Tỉ lệ cạnh tranh ${data.competitionRatio}, Nguy cơ AI thay thế ${data.automationRisk}. Các lầm tưởng phổ biến: "${data.commonMyths[0]}".`
    };
  }

  /**
   * Module 3: 4-Quad Matrix & Bandwagon Analyzer (Chống Bandwagon Effect - Hiệu ứng đám đông)
   */
  evaluateBandwagonEffect(influences) {
    // influences: array các lý do (VD: 'friends_choice', 'viral_tiktok', 'parent_demand', 'personal_passion')
    let bandwagonPoints = 0;

    if (influences.includes('friends_choice')) bandwagonPoints += 30;
    if (influences.includes('viral_tiktok')) bandwagonPoints += 25;
    if (influences.includes('parent_demand')) bandwagonPoints += 20;
    if (influences.includes('personal_passion')) bandwagonPoints -= 15;

    bandwagonPoints = Math.max(0, Math.min(100, bandwagonPoints));

    return {
      bandwagonScore: bandwagonPoints,
      level: bandwagonPoints > 50 ? "Báo động Cao (Bị ảnh hưởng đám đông)" : "Khách quan (Dựa trên động lực bản thân)",
      matrixSummary: {
        quadrant1: "Động lực Nội tại (Sở thích/Năng lực)",
        quadrant2: "Áp lực Đám đông (Bạn bè/Trend mạng)",
        quadrant3: "Kỳ vọng Gia đình/Xã hội",
        quadrant4: "Dữ liệu Thực tế Thị trường"
      }
    };
  }

  /**
   * Module 4: Sunk Cost Calculator (Thuật toán Phân tích Chi phí Chìm & Chi phí Cơ hội)
   */
  calculateSunkCost(yearsInvested, moneyInvested, reluctanceToSwitch) {
    // Tính điểm bẫy Chi phí chìm (Sunk Cost Fallacy)
    let sunkCostPoints = (yearsInvested * 10) + (reluctanceToSwitch * 15);
    sunkCostPoints = Math.min(100, sunkCostPoints);

    return {
      sunkCostPoints: sunkCostPoints,
      opportunityCostWarning: sunkCostPoints > 40 ? 
        "CẢNH BÁO BẪY CHI PHÍ CHÌM: Bạn đang ngại thay đổi chỉ vì tiếc công sức/thời gian đã qua, thay vì nhìn vào triển vọng tương lai!" :
        "Tư duy linh hoạt: Bạn sẵn sàng điều chỉnh khi có bằng chứng mới."
    };
  }

  /**
   * Tổng hợp Chỉ số Định kiến Tư duy (Cognitive Bias Index Score %)
   * Thang điểm từ 0% (Khách quan tuyệt đối) đến 100% (Bị định kiến nặng nề)
   */
  computeFinalDebiasScore(confPoints, availPoints, bandPoints, sunkPoints) {
    const totalBias = (confPoints * 0.35) + (availPoints * 0.25) + (bandPoints * 0.25) + (sunkPoints * 0.15);
    const debiasScore = Math.round(totalBias);
    
    let classification = "";
    let colorCode = "";

    if (debiasScore < 25) {
      classification = "Tư duy Khách quan & Khoa học (Đạt chuẩn KHKT)";
      colorCode = "#10b981"; // Emerald
    } else if (debiasScore < 55) {
      classification = "Có Định kiến Trung bình (Cần kiểm chứng thêm số liệu)";
      colorCode = "#f59e0b"; // Amber
    } else {
      classification = "Định kiến Tư duy Nặng nề (Cực kỳ rủi ro khi ra quyết định)";
      colorCode = "#ef4444"; // Red
    }

    return {
      score: debiasScore,
      objectivityIndex: 100 - debiasScore,
      classification: classification,
      colorCode: colorCode
    };
  }
}

// Export singleton instance
window.debiasEngine = new DebiasEngine();
