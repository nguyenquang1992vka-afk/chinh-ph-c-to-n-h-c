import React from "react";
import {
  Star,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  BookOpen,
  Gamepad2,
  Users,
  CheckCircle2,
  GraduationCap,
  ChevronRight,
  Compass,
  ExternalLink,
} from "lucide-react";
import { APP_IMAGES } from "../../data/assets";
import { useApp } from "../../context/AppContext";

export const HomeView: React.FC = () => {
  const {
    role,
    setRole,
    setActiveTab,
    selectedGrade,
    setSelectedGrade,
    currentStudent,
    leaderboard,
  } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF7] to-amber-50/40 pt-6 pb-12 border-b border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Slogan & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-purple-200 text-purple-900 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#8957F6]" />
                <span>Hệ Sinh Thái Học Toán Tiểu Học Thông Minh GDPT 2018</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                HÀNH TRÌNH <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3478F6] via-[#8957F6] to-[#FF6B9C]">
                  TỎA SÁNG
                </span>
              </h1>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 font-bold text-base sm:text-lg leading-relaxed shadow-xs">
                ⭐ Mỗi bài toán – Một thử thách. <br />
                ⭐ Mỗi nhiệm vụ – Một ngôi sao. <br />
                ⭐ Mỗi ngày – Một bước tiến.
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                Đưa học sinh tiểu học bước vào vũ trụ Toán học 3D kì diệu cùng Robot trợ lí <strong>Sao Sáng AI</strong>,
                chinh phục 3 hành tinh cá nhân hóa và 8 đấu trường trò chơi toán học rực rỡ.
              </p>

              {/* Grade Selector Pills */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Chọn khối lớp học tập:
                </span>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {[1, 2, 3, 4, 5].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                        selectedGrade === g
                          ? "bg-[#3478F6] text-white shadow-md scale-105"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      Toán Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => {
                    setRole("student");
                    setActiveTab("planets");
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#3478F6] via-indigo-600 to-[#8957F6] text-white text-base font-black rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5 fill-amber-300 text-amber-300 star-glow" />
                  BẮT ĐẦU HÀNH TRÌNH
                </button>
                <button
                  onClick={() => {
                    setRole("teacher");
                    setActiveTab("workshop");
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-slate-300 text-slate-800 text-base font-bold rounded-2xl hover:border-[#8957F6] hover:text-[#8957F6] transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-[#8957F6]" />
                  Cổng Giáo Viên (Xưởng Đề AI)
                </button>
              </div>
            </div>

            {/* Right Column: High Fidelity 3D Math Universe Artwork */}
            <div className="lg:col-span-6 relative">
              <div className="magic-border shadow-2xl rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900">
                <img
                  src={APP_IMAGES.hero}
                  alt="Thế giới Toán học 3D Hành Trình Tỏa Sáng"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge on Artwork */}
              <div className="absolute -bottom-4 -left-2 sm:left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-500 star-glow" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">
                    Đã trao tặng tuần này
                  </span>
                  <span className="text-lg font-black text-slate-900 tabular-nums">
                    1,250+ Ngôi Sao Vàng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL PORTAL ENTRY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Portal Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#3478F6] text-white flex items-center justify-center mb-4 shadow-md">
                <Star className="w-6 h-6 fill-amber-300" />
              </div>
              <h2 className="text-2xl font-black text-blue-950 mb-2">CỔNG HỌC SINH TỎA SÁNG</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Chinh phục 3 hành tinh toán học cá nhân hóa, làm nhiệm vụ mỗi ngày, mở khóa huy hiệu vinh quang
                và đấu trí trong 8 trò chơi toán học rực rỡ.
              </p>
              <div className="space-y-2 text-xs font-bold text-slate-700 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ngân hàng sao & bảng xếp hạng thời gian thực</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Robot Sao Sáng AI đọc đề và gợi ý từng bước</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setRole("student");
                setActiveTab("planets");
              }}
              className="py-3 px-6 bg-[#3478F6] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-between"
            >
              <span>Vào Cổng Học Sinh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Portal Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50/60 rounded-3xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#8957F6] text-white flex items-center justify-center mb-4 shadow-md">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <h2 className="text-2xl font-black text-purple-950 mb-2">
                CỔNG GIÁO VIÊN & XƯỞNG ĐỀ AI
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Tải lên tài liệu hoặc đề cũ, AI tự động phân tích mục tiêu học tập, sinh đề 3 mức độ, kiểm tra thuật
                toán chính xác và giao bài nhanh chóng cho lớp.
              </p>
              <div className="space-y-2 text-xs font-bold text-slate-700 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tự động sinh 10, 20, 30 câu hỏi chuẩn GDPT 2018</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dashboard phân tích năng lực và xuất báo cáo Excel / PDF</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (role === "teacher") {
                  setActiveTab("workshop");
                } else {
                  alert("Khu vực này chỉ dành cho Giáo viên có tài khoản quản trị. Để truy cập, em vui lòng bấm 'Đăng Xuất' ở góc trên bên phải và đăng nhập Cổng Giáo Viên!");
                }
              }}
              className="py-3 px-6 bg-[#8957F6] hover:bg-[#7844eb] text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-between"
            >
              <span>{role === "teacher" ? "Vào Xưởng Sáng Tạo Đề AI" : "Khu Vực Quản Trị Giáo Viên (Khóa)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* KNTT TEXTBOOK CURRICULUM & NXBGD LEARNING MATERIALS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>BÁM SÁT SGK KẾT NỐI TRI THỨC VỚI CUỘC SỐNG · NXB GIÁO DỤC VIỆT NAM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                MỤC LỤC SGK & BÀI HỌC CỦNG CỐ - MỞ RỘNG
              </h2>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Hệ thống kiến thức trọng tâm bám sát từng bài trong sách giáo khoa <strong>Toán Kết nối tri thức</strong> (Lớp 1 đến Lớp 5), kết hợp trọn bộ: <em>Phiếu bài tập củng cố cơ bản SGK</em>, <em>Bài tập mở rộng toán tư duy</em>, luyện tập tương tác (chỉ hiện gợi ý & phương pháp sau khi nộp bài) và hỗ trợ in phiếu A4 tiện lợi.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-indigo-300 font-semibold">
                <span className="bg-white/10 px-2.5 py-1 rounded-md">📚 Mục lục bài học theo tuần/chủ đề SGK</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">💡 Kiến thức cốt lõi & lỗi sai cần tránh</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">🟢 Bài củng cố bám sát SGK</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">🚀 Bài mở rộng phát triển năng lực</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md">🖨️ Xuất in phiếu A4</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("resources")}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-slate-900" />
                <span>Xem Mục Lục SGK & Làm Bài</span>
              </button>

              <a
                href="https://hoclieubotro.nxbgd.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Cổng hoclieubotro.nxbgd.vn</span>
                <ExternalLink className="w-4 h-4 text-amber-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PLANETS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                3 HÀNH TINH CÁ NHÂN HÓA HỌC TOÁN
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Lộ trình học tập phân hóa theo 3 mức độ nhận thức của học sinh tiểu học Việt Nam
              </p>
            </div>
            <button
              onClick={() => setActiveTab("planets")}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Xem Cả 3 Hành Tinh →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setActiveTab("planets")}
              className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <img
                src={APP_IMAGES.planetEasy}
                alt=""
                className="w-full aspect-square rounded-xl object-cover mb-3"
              />
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                Mức 1 · Nhận biết
              </span>
              <h4 className="font-bold text-base text-emerald-950 mt-1">Hành Tinh Khởi Động</h4>
              <p className="text-xs text-slate-600 mt-1">Củng cố kiến thức nền tảng và bảng tính nhanh.</p>
            </div>

            <div
              onClick={() => setActiveTab("planets")}
              className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <img
                src={APP_IMAGES.planetMedium}
                alt=""
                className="w-full aspect-square rounded-xl object-cover mb-3"
              />
              <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded-md">
                Mức 2 · Kết nối
              </span>
              <h4 className="font-bold text-base text-blue-950 mt-1">Hành Tinh Chinh Phục</h4>
              <p className="text-xs text-slate-600 mt-1">Giải toán có lời văn và bài tập vận dụng đời sống.</p>
            </div>

            <div
              onClick={() => setActiveTab("planets")}
              className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <img
                src={APP_IMAGES.planetHard}
                alt=""
                className="w-full aspect-square rounded-xl object-cover mb-3"
              />
              <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded-md">
                Mức 3 · Vận dụng cao
              </span>
              <h4 className="font-bold text-base text-purple-950 mt-1">Hành Tinh Thử Thách</h4>
              <p className="text-xs text-slate-600 mt-1">Toán tư duy logic, toán đố và giải mật mã vũ trụ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                Bảng Vàng Tỏa Sáng
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              VINH DANH NHỮNG NGÔI SAO TOÁN HỌC XUẤT SẮC
            </h3>
            <p className="text-sm text-amber-100 mt-1">
              Top 3 bạn nhỏ dẫn đầu tuần này đang sở hữu tổng cộng hơn 100 ngôi sao!
            </p>
          </div>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className="px-6 py-3 bg-white text-amber-900 font-black rounded-xl text-xs hover:bg-amber-50 transition-colors shrink-0 shadow-md"
          >
            Xem Chi Tiết Bảng Vàng →
          </button>
        </div>
      </section>
    </div>
  );
};
