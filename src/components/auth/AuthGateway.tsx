import React, { useState } from "react";
import {
  Star,
  Sparkles,
  School,
  User,
  Lock,
  Mail,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  HelpCircle,
  Trophy,
  Zap,
} from "lucide-react";
import { APP_IMAGES } from "../../data/assets";
import { useApp } from "../../context/AppContext";
import { playStarSound } from "../../utils/audio";

export const AuthGateway: React.FC = () => {
  const { loginAsTeacher, loginAsStudent, students, classes } = useApp();

  const [activePortal, setActivePortal] = useState<"teacher" | "student">("student");

  // Teacher Form State
  const [teacherEmail, setTeacherEmail] = useState("mai.nguyen@edutech.edu.vn");
  const [teacherPassword, setTeacherPassword] = useState("giaovien123");
  const [teacherError, setTeacherError] = useState("");

  // Student Form State
  const [selectedStudentCode, setSelectedStudentCode] = useState("HS-3A01");
  const [studentPassword, setStudentPassword] = useState("123456");
  const [studentError, setStudentError] = useState("");

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherEmail.trim()) {
      setTeacherError("Vui lòng nhập email hoặc tài khoản giáo viên.");
      return;
    }
    setTeacherError("");
    playStarSound();
    loginAsTeacher(teacherEmail, teacherPassword);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentCode.trim()) {
      setStudentError("Vui lòng chọn hoặc nhập mã học sinh.");
      return;
    }
    setStudentError("");
    playStarSound();
    loginAsStudent(selectedStudentCode, studentPassword);
  };

  const handleQuickTeacher = () => {
    playStarSound();
    loginAsTeacher("mai.nguyen@edutech.edu.vn", "giaovien123");
  };

  const handleQuickStudent = (code: string) => {
    playStarSound();
    loginAsStudent(code, "123456");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 flex flex-col justify-between selection:bg-amber-200">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-[#3478F6] via-[#8957F6] to-[#FF6B9C] text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-4 h-4 text-[#FFC83D] animate-spin" />
        <span>HÀNH TRÌNH TỎA SÁNG · HỆ SINH THÁI TOÁN TIỂU HỌC THÔNG MINH CHUẨN GDPT 2018</span>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Header Branding */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 text-amber-950 text-xs font-extrabold mb-4 shadow-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 star-glow" />
            <span>CỔNG XÁC THỰC GIÁO DỤC AN TOÀN 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            HÀNH TRÌNH{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3478F6] via-[#8957F6] to-[#FF6B9C]">
              TỎA SÁNG
            </span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#8957F6] mt-2">
            CHINH PHỤC TOÁN TIỂU HỌC CÙNG AI
          </p>

          <div className="mt-4 inline-block px-5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm sm:text-base shadow-xs">
            ⭐ Mỗi bài toán – Một thử thách. Mỗi nhiệm vụ – Một ngôi sao. Mỗi ngày – Một bước tiến.
          </div>
        </div>

        {/* 2 Portal Choice & Login Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto w-full">
          {/* Left Column: 3D Universe Illustration & Value Props (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-indigo-700/40 relative overflow-hidden">
            {/* Background Image Scrim */}
            <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none">
              <img
                src={APP_IMAGES.hero}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFC83D] to-orange-400 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    <Star className="w-7 h-7 text-[#FFC83D] fill-[#FFC83D] star-glow" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black">VŨ TRỤ TOÁN HỌC 3D</h3>
                  <p className="text-xs text-indigo-300">Công nghệ EdTech thế hệ mới</p>
                </div>
              </div>

              {/* Mascot Robot Feature Card */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3.5">
                <img
                  src={APP_IMAGES.mascot}
                  alt="Robot Sao Sáng AI"
                  className="w-14 h-14 rounded-2xl bg-white p-0.5 object-cover shadow-md shrink-0"
                />
                <div className="text-xs">
                  <span className="font-extrabold text-amber-300 text-sm block">
                    Robot Sao Sáng AI
                  </span>
                  <p className="text-indigo-200 mt-0.5">
                    Đồng hành giải thích, đọc đề bằng giọng nói tiếng Việt và gợi ý tư duy sau khi học sinh trả lời!
                  </p>
                </div>
              </div>

              {/* Pillars List */}
              <div className="space-y-3 text-xs text-indigo-100 font-semibold">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 Hành tinh cá nhân hóa: Khởi Động · Chinh Phục · Thử Thách</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Xưởng sáng tạo đề AI tự động bóc tách mục tiêu GDPT 2018</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>8 Trò chơi toán học tương tác tính điểm và tặng sao thực tế</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bảng vàng vinh danh cập nhật theo múi giờ Việt Nam (GMT+7)</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="relative z-10 pt-6 mt-6 border-t border-indigo-800/80">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider block mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                TÀI KHOẢN MẪU TRẢI NGHIỆM (1-CLICK)
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleQuickTeacher}
                  className="w-full py-2 px-3 bg-purple-600/80 hover:bg-purple-600 text-white font-bold rounded-xl text-left flex items-center justify-between border border-purple-400/50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    Cô giáo Mai (Cổng Giáo Viên)
                  </span>
                  <span className="text-[10px] text-purple-200">1-Click →</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStudent("HS-3A01")}
                  className="w-full py-2 px-3 bg-blue-600/80 hover:bg-blue-600 text-white font-bold rounded-xl text-left flex items-center justify-between border border-blue-400/50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-300" />
                    Em Bảo An (HS-3A01 · Lớp 3A)
                  </span>
                  <span className="text-[10px] text-blue-200">1-Click →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Portal Selector & Login Forms (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-xl flex flex-col justify-between">
            <div>
              {/* Portal Tabs Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal("student");
                    setStudentError("");
                  }}
                  className={`py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                    activePortal === "student"
                      ? "bg-white text-[#3478F6] shadow-md scale-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <User className="w-4 h-4" />
                  CỔNG HỌC SINH
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePortal("teacher");
                    setTeacherError("");
                  }}
                  className={`py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                    activePortal === "teacher"
                      ? "bg-white text-[#8957F6] shadow-md scale-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <School className="w-4 h-4" />
                  CỔNG GIÁO VIÊN
                </button>
              </div>

              {/* FORM 1: CỔNG HỌC SINH */}
              {activePortal === "student" && (
                <form onSubmit={handleStudentLogin} className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase text-[#3478F6] tracking-wider block">
                      Đăng Nhập Học Sinh Tiểu Học
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      CHINH PHỤC TOÁN CÙNG SAO SÁNG
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Mỗi học sinh được cấp một mã số định danh riêng. Dữ liệu điểm số và bài làm được bảo mật an toàn.
                    </p>
                  </div>

                  {studentError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                      {studentError}
                    </div>
                  )}

                  {/* Student Selection or Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Chọn hoặc nhập Mã học sinh:
                    </label>
                    <select
                      value={selectedStudentCode}
                      onChange={(e) => setSelectedStudentCode(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#3478F6] rounded-2xl text-sm font-bold text-slate-900 outline-none transition-colors"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.studentCode}>
                          {st.studentCode} · {st.fullName} ({st.className})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PIN/Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Mã PIN / Mật khẩu học sinh:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Mặc định: 123456"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#3478F6] rounded-2xl text-sm font-bold text-slate-900 outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Mật khẩu mặc định hệ thống: <span className="font-mono font-bold text-slate-600">123456</span>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#3478F6] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>VÀO HỌC TOÁN NGAY</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              {/* FORM 2: CỔNG GIÁO VIÊN */}
              {activePortal === "teacher" && (
                <form onSubmit={handleTeacherLogin} className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase text-[#8957F6] tracking-wider block">
                      Đăng Nhập Dành Cho Giáo Viên
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      QUẢN TRỊ SƯ PHẠM SỐ & XƯỞNG ĐỀ AI
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Toàn quyền quản lí lớp học, tải tài liệu bóc tách mục tiêu, sinh đề GDPT 2018 và phân tích năng lực.
                    </p>
                  </div>

                  {teacherError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                      {teacherError}
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Email hoặc Tài khoản giáo viên:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="mai.nguyen@edutech.edu.vn"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#8957F6] rounded-2xl text-sm font-bold text-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Mật khẩu quản trị:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="Mặc định: giaovien123"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#8957F6] rounded-2xl text-sm font-bold text-slate-900 outline-none transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tài khoản mặc định: <span className="font-mono font-bold text-slate-600">mai.nguyen@edutech.edu.vn</span> / <span className="font-mono font-bold text-slate-600">giaovien123</span>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#8957F6] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>VÀO BÀN LÀM VIỆC GIÁO VIÊN</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>

            {/* Privacy & Security Footnote */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hệ thống phân quyền chuẩn mực · Bảo mật tuyệt đối điểm số học sinh Việt Nam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-200 bg-white/60">
        HÀNH TRÌNH TỎA SÁNG · CHINH PHỤC TOÁN TIỂU HỌC CÙNG AI © 2026. Chuẩn chương trình GDPT 2018.
      </footer>
    </div>
  );
};
