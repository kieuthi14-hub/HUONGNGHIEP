/**
 * DEBIAS AI PROTOCOL - LABOR MARKET DATA REPOSITORY
 * Dữ liệu Thị trường Lao động & Ngành nghề Việt Nam (Kho dữ liệu kiểm chứng số)
 */

const LABOR_MARKET_DATA = {
  "it_software": {
    id: "it_software",
    name: "Công nghệ thông tin & Phần mềm",
    avgSalary: "18 - 45 triệu VNĐ/tháng",
    growthRate: "+16.5% / năm",
    competitionRatio: "1 : 8.5 (Rất cao)",
    automationRisk: "12% (Thấp - Cần kỹ năng tư duy nâng cao)",
    commonMyths: [
      "Chỉ cần gõ phím là có lương 50 triệu ngay khi mới ra trường",
      "Ai làm IT cũng giàu và làm tự do (Freelance) thoải mái"
    ],
    realities: [
      "Tỉ lệ thải loại sau 5 năm cao nếu không cập nhật công nghệ liên tục (AI, Cloud)",
      "Áp lực làm việc overtime (OT) cao và bệnh nghề nghiệp cột sống/mắt"
    ],
    skillsRequired: ["Tư duy thuật toán", "Tiếng Anh chuyên ngành", "Tự học liên tục", "Giải quyết vấn đề"]
  },
  "medicine_pharmacy": {
    id: "medicine_pharmacy",
    name: "Y khoa & Dược học",
    avgSalary: "15 - 40 triệu VNĐ/tháng (Sau 6-9 năm đào tạo)",
    growthRate: "+12.0% / năm",
    competitionRatio: "1 : 12.0 (Khốc liệt)",
    automationRisk: "5% (Rất thấp)",
    commonMyths: [
      "Học Y xong ra trường là làm bác sĩ giàu sang ngay",
      "Chỉ cần học thuộc lòng sách giáo khoa là giỏi Y"
    ],
    realities: [
      "Thời gian đào tạo kéo dài 6-9 năm (Đại học + Nội trú/Chuyên khoa 1)",
      "Cơ mệt mỏi thể chất, trực đêm dày đặc, áp lực sức khỏe tâm lý cao"
    ],
    skillsRequired: ["Sự kiên trì bền bỉ", "Đạo đức y đức", "Chịu áp lực cực cao", "Cập nhật y khoa thế giới"]
  },
  "business_marketing": {
    id: "business_marketing",
    name: "Quản trị Kinh doanh & Marketing",
    avgSalary: "10 - 30 triệu VNĐ/tháng (Phụ thuộc KPI & Doanh số)",
    growthRate: "+10.5% / năm",
    competitionRatio: "1 : 15.0 (Cực kỳ đông đảo)",
    automationRisk: "35% (Trung bình - AI làm Marketing tự động)",
    commonMyths: [
      "Học Quản trị ra làm sếp/giám đốc ngay",
      "Làm Marketing là chỉ cần sáng tạo nội dung vui vẻ trên TikTok"
    ],
    realities: [
      "Yêu cầu phân tích dữ liệu (Data Analytics) và đo lường ROI khắc nghiệt",
      "Tỉ lệ cạnh tranh việc làm cao do ngành nhận học sinh từ nhiều khối ngành khác"
    ],
    skillsRequired: ["Tư duy dữ liệu", "Giao tiếp & Đàm phán", "Sáng tạo nội dung", "Quản lý ngân sách"]
  },
  "finance_banking": {
    id: "finance_banking",
    name: "Tài chính & Ngân hàng",
    avgSalary: "14 - 35 triệu VNĐ/tháng",
    growthRate: "+8.5% / năm",
    competitionRatio: "1 : 9.0 (Mức độ cao)",
    automationRisk: "45% (Cao - AI & Fintech thay thế nhiều vị trí truyền thống)",
    commonMyths: [
      "Làm ngân hàng đếm tiền nhẹ nhàng, thưởng tết hàng chục tháng lương",
      "Chỉ cần giỏi tính toán cộng trừ nhân chia"
    ],
    realities: [
      "Áp lực chỉ tiêu (KPI) huy động vốn & bảo hiểm rất nặng nề",
      "Vị trí giao dịch viên truyền thống đang thu hẹp dần do ngân hàng số"
    ],
    skillsRequired: ["Phân tích rủi ro", "Pháp lý tài chính", "Thấu hiểu sản phẩm Fintech", "Tiếng Anh chuyên sâu"]
  },
  "graphic_design": {
    id: "graphic_design",
    name: "Thiết kế Đồ họa & Truyền thông Đa phương tiện",
    avgSalary: "12 - 28 triệu VNĐ/tháng",
    growthRate: "+14.0% / năm",
    competitionRatio: "1 : 7.0 (Khá đông)",
    automationRisk: "40% (Tác động lớn từ Generative AI: Midjourney, Stable Diffusion)",
    commonMyths: [
      "Chỉ cần biết vẽ hoặc dùng phần mềm Photoshop là thành Designer chuyên nghiệp",
      "Làm thiết kế tự do thoải mái thời gian, không phụ thuộc ai"
    ],
    realities: [
      "AI đang rút ngắn thời gian tạo hình ảnh, buộc designer nâng tầm thành tư duy Art Director",
      "Chỉnh sửa theo ý khách hàng (Client revision) nhiều vòng gây quá tải tâm lý"
    ],
    skillsRequired: ["Tư duy thẩm mỹ & Storytelling", "Làm chủ AI Tools", "Thấu hiểu hành vi người dùng (UI/UX)", "Quản lý tiến độ"]
  }
};
