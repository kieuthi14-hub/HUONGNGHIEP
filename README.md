# 🏆 Debias AI Protocol - Website Dự Án Khoa Học Kỹ Thuật (KHKT)

> **Tên đề tài**: Hệ Thống Hỗ Trợ Ra Quyết Định & Định Hướng Nghề Nghiệp Giảm Thụ Định Kiến Tư Duy (Debias AI Protocol)  
> **Lĩnh vực**: Phần mềm Hệ thống & Tâm lý học Nhận thức  
> **Tác giả**: Học viên `kieuthi14` | Dự án Classroom App  
> **Năm xuất bản**: 2026

---

## 📌 Giới Thiệu Đề Tài

Dự án ứng dụng lý thuyết **Tâm lý học Nhận thức (Cognitive Psychology)** kết hợp với **Kiến trúc Thuật toán 4 Module** nhằm hỗ trợ học sinh THCS/THPT định hướng nghề nghiệp một cách khách quan, loại bỏ các bẫy tâm lý và định kiến cá nhân.

---

## 🏗️ Kiến Trúc Hệ Thống 4 Tầng

1. **Tầng Giao Diện (Frontend)**: Debias UI tương tác mượt mà, hỗ trợ máy tính & máy tính bảng.
2. **Tầng Bảo Mật & Middleware**: API Gateway & Auth Guard kiểm soát truy cập.
3. **Tầng Nghiệp Vụ (Backend API)**:
   - **Module 1: Devil's Advocate** — Phản biện chống *Confirmation Bias* (Định kiến xác nhận).
   - **Module 2: Cross-Checker** — Kiểm chứng số liệu thực tế chống *Availability Bias* (Định kiến tính sẵn có).
   - **Module 3: Ma Trận 4 Ô** — Phân tích & cô lập *Bandwagon Effect* (Hiệu ứng đám đông).
   - **Module 4: Thuật Toán Chi Phí Chìm** — Cảnh báo bẫy *Sunk Cost Fallacy*.
4. **Tầng Cơ Sở Dữ Liệu (Database)**: User & Session DB + Labor Market Repository.

---

## 🚀 Hướng Dẫn Chạy Sản Phẩm

### Chạy Local Server (PowerShell Native)
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
Mở trình duyệt truy cập: `http://localhost:3000`

### Nạp Cơ Sở Dữ Liệu SQL
Sử dụng file `schema/database_init.sql` nạp vào MySQL / MariaDB.

---

## 🌟 Chế Độ Thử Nghiệm Nhanh Dành Cho Ban Giám Khảo (1-Click Presets)
Website tích hợp sẵn 3 kịch bản kiểm thử dành cho Ban Giám Khảo (BGK) chấm thi tại gian hàng:
- **Preset 1**: "Chạy theo trào lưu CNTT Lương 50 triệu"
- **Preset 2**: "Đăng ký Marketing do số đông bạn bè"
- **Preset 3**: "Bẫy chi phí chìm - Ngại chuyển ngành vì tiếc thời gian đã học"
