import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Printer,
  Sparkles,
  Volume2,
  ChevronRight,
  GraduationCap,
  Star,
  Layers,
  ArrowRight,
  Download,
  Share2,
  X,
  Compass,
} from "lucide-react";
import { SupplementaryResource, BookSeries, ResourceCategory } from "../../types";
import { SUPPLEMENTARY_RESOURCES, NXBGD_PLATFORMS } from "../../data/supplementaryData";
import { KNTTTextbookCompanion } from "./KNTTTextbookCompanion";
import { useApp } from "../../context/AppContext";
import { playStarSound, playFanfareSound } from "../../utils/audio";

export const SupplementaryLearningHub: React.FC = () => {
  const { role, selectedGrade, setSelectedGrade, setActiveTab, triggerStarCelebration } = useApp();

  const [activeHubTab, setActiveHubTab] = useState<"kntt_curriculum" | "digital_resources">("kntt_curriculum");
  const [filterGrade, setFilterGrade] = useState<number>(selectedGrade || 3);
  const [filterSeries, setFilterSeries] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<SupplementaryResource | null>(null);

  // Exercise interaction inside the modal
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Filter logic
  const filteredList = SUPPLEMENTARY_RESOURCES.filter((res) => {
    if (filterGrade !== 0 && res.grade !== filterGrade) return false;
    if (filterSeries !== "all" && res.bookSeries !== filterSeries) return false;
    if (filterCategory !== "all" && res.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchTopic = res.topic.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchDesc) return false;
    }
    return true;
  });

  const handleOpenDetail = (res: SupplementaryResource) => {
    setSelectedResource(res);
    setSelectedAnswers({});
    setRevealedSolutions({});
    playStarSound();
  };

  const handleSelectOption = (exerciseId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseId]: optionIndex,
    }));
  };

  const handleCheckAnswer = (exerciseId: string, isCorrect: boolean) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [exerciseId]: true,
    }));
    if (isCorrect) {
      triggerStarCelebration(1);
    } else {
      playStarSound();
    }
  };

  const handlePrintWorksheet = (res: SupplementaryResource) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Trình duyệt đang chặn cửa sổ bật lên. Vui lòng cấp quyền mở pop-up để xem phiếu in.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${res.title} - Phiếu Học Liệu Bổ Trợ NXBGD</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: "Times New Roman", Times, serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
            .school-info { font-size: 13px; font-weight: bold; }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 6px; text-transform: uppercase; }
            .subtitle { text-align: center; font-size: 14px; margin-bottom: 20px; font-style: italic; }
            .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; border: 1px dashed #666; padding: 10px; }
            .section-title { font-size: 15px; font-weight: bold; text-decoration: underline; margin-top: 20px; margin-bottom: 10px; }
            .point-item { margin-bottom: 8px; font-size: 14px; }
            .exercise-item { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dotted #ccc; }
            .exercise-q { font-weight: bold; font-size: 14px; margin-bottom: 8px; }
            .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-left: 20px; }
            .footer { margin-top: 40px; text-align: right; font-size: 13px; font-style: italic; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-info">
              HÀNH TRÌNH TỎA SÁNG · EDTECH 2026<br/>
              NGUỒN: NXB GIÁO DỤC VIỆT NAM (hoclieubotro.nxbgd.vn)
            </div>
            <div class="school-info" style="text-align: right;">
              MÔN TOÁN TIỂU HỌC · LỚP ${res.grade}<br/>
              BỘ SÁCH: ${res.bookSeries}
            </div>
          </div>

          <div class="title">${res.title}</div>
          <div class="subtitle">${res.curriculumStandard}</div>

          <div class="student-info">
            <span>Họ và tên học sinh: ..............................................................</span>
            <span>Lớp: .............</span>
            <span>Ngày làm: ..... / ..... / 2026</span>
          </div>

          <div class="section-title">I. KIẾN THỨC CỐT LÕI CẦN GHI NHỚ:</div>
          ${res.summaryPoints.map((pt, idx) => `<div class="point-item"><strong>${idx + 1}.</strong> ${pt}</div>`).join("")}

          <div class="section-title">II. BÀI TẬP VẬN DỤNG TỰ LUYỆN:</div>
          ${res.exercises.map((ex, idx) => `
            <div class="exercise-item">
              <div class="exercise-q">Câu ${idx + 1}: ${ex.question}</div>
              ${ex.options ? `
                <div class="options-grid">
                  ${ex.options.map((opt, oIdx) => `<div>${String.fromCharCode(65 + oIdx)}. ${opt}</div>`).join("")}
                </div>
              ` : `
                <div style="height: 60px; border-bottom: 1px dashed #aaa; margin-top: 10px;">(Học sinh trình bày bài làm và đáp số vào đây)</div>
              `}
            </div>
          `).join("")}

          <div class="footer">
            Giáo viên chấm và nhận xét: ............................................................................<br/>
            Điểm số: ............ / 10 ⭐
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt không hỗ trợ đọc giọng nói tự động.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* HERO SECTION BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-10 shadow-xl border-2 border-indigo-500/30">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>KHO HỌC LIỆU BỔ TRỢ & BỔ SUNG KIẾN THỨC CHUẨN NXBGD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            HỌC LIỆU BỔ TRỢ TOÁN TIỂU HỌC
          </h1>
          <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed">
            Hệ thống bài tập, cẩm nang phương pháp và vở bài tập điện tử bám sát chương trình Giáo dục phổ thông 2018 của
            <strong> Nhà xuất bản Giáo dục Việt Nam</strong> (kết nối trực tiếp với nền tảng <code>hoclieubotro.nxbgd.vn</code>).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://hoclieubotro.nxbgd.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-slate-900" />
              <span>Mở Cổng hoclieubotro.nxbgd.vn</span>
            </a>

            <button
              onClick={() => {
                if (role === "teacher") {
                  setActiveTab("workshop");
                } else {
                  setActiveTab("planets");
                }
              }}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors border border-white/20 flex items-center gap-2"
            >
              {role === "teacher" ? (
                <>
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span>Vào Xưởng Đề AI Sinh Bài Tập</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Luyện Tập Trên 3 Hành Tinh</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* NXBGD Decorative Badge */}
        <div className="absolute top-6 right-6 hidden md:flex flex-col items-end opacity-20 pointer-events-none">
          <BookOpen className="w-40 h-40 text-white" />
        </div>
      </div>

      {/* PRIMARY HUB TAB NAVIGATION */}
      <div className="flex flex-col sm:flex-row items-center justify-start gap-3 border-b-2 border-slate-200 pb-3">
        <button
          onClick={() => {
            setActiveHubTab("kntt_curriculum");
            playStarSound();
          }}
          className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm ${
            activeHubTab === "kntt_curriculum"
              ? "bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-blue-500/25 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BookOpen className="w-5 h-5 text-amber-300" />
          <span>MỤC LỤC & BÀI HỌC SGK KẾT NỐI TRI THỨC</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
            Trọng tâm + Củng cố & Mở rộng
          </span>
        </button>

        <button
          onClick={() => {
            setActiveHubTab("digital_resources");
            playStarSound();
          }}
          className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm ${
            activeHubTab === "digital_resources"
              ? "bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-blue-500/25 ring-2 ring-blue-400/50 scale-[1.02]"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ExternalLink className="w-5 h-5 text-blue-400" />
          <span>HỌC LIỆU BỔ TRỢ SỐ (hoclieubotro.nxbgd.vn)</span>
        </button>
      </div>

      {activeHubTab === "kntt_curriculum" && <KNTTTextbookCompanion />}

      {activeHubTab === "digital_resources" && (
        <div className="space-y-8 animate-fadeIn">
          {/* QUICK PLATFORMS HUB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NXBGD_PLATFORMS.map((plat, idx) => (
          <a
            key={idx}
            href={plat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {plat.tag}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
              {plat.name}
            </h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5 mb-2 font-mono">
              {plat.domain}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {plat.description}
            </p>
          </a>
        ))}
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Khối Lớp:</span>
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setFilterGrade(g);
                  setSelectedGrade(g);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  filterGrade === g
                    ? "bg-[#3478F6] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Lớp {g}
              </button>
            ))}
            <button
              onClick={() => setFilterGrade(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterGrade === 0
                  ? "bg-[#3478F6] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Tất cả (1-5)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chủ đề, bài học bổ trợ..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Bộ sách:</span>
            <select
              value={filterSeries}
              onChange={(e) => setFilterSeries(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả các bộ sách</option>
              <option value="Kết nối tri thức">Kết nối tri thức với cuộc sống</option>
              <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              <option value="Cánh diều">Cánh diều</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Thể loại:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Tất cả thể loại</option>
              <option value="Vở bài tập bổ trợ số">Vở bài tập bổ trợ số</option>
              <option value="Phiếu củng cố kiến thức">Phiếu củng cố kiến thức</option>
              <option value="Chuyên đề ôn luyện">Chuyên đề ôn luyện</option>
              <option value="Toán tư duy thực tế">Toán tư duy thực tế</option>
              <option value="Video mô phỏng tương tác">Video mô phỏng tương tác</option>
            </select>
          </div>

          <span className="text-slate-400 ml-auto font-medium">
            Hiển thị {filteredList.length} chuyên đề bổ trợ
          </span>
        </div>
      </div>

      {/* RESOURCES LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-blue-400"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                  Toán Lớp {res.grade}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {res.bookSeries}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                  {res.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>

              {/* Curriculum badge */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{res.curriculumStandard}</span>
              </div>

              {/* Summary bullets preview */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                  Kiến thức trọng tâm:
                </span>
                {res.summaryPoints.slice(0, 2).map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5 text-slate-600 line-clamp-1">
                    <span className="text-[#3478F6] font-bold">✓</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handlePrintWorksheet(res)}
                title="In hoặc lưu phiếu bài tập PDF"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">In Phiếu</span>
              </button>

              <button
                onClick={() => handleOpenDetail(res)}
                className="px-4 py-2 bg-[#3478F6] hover:bg-blue-700 text-white font-black rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 ml-auto"
              >
                <span>Ôn Tập & Luyện Ngay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

          {filteredList.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800">Không tìm thấy học liệu phù hợp</h4>
              <p className="text-xs text-slate-500 mt-1">
                Vui lòng thử chọn lại khối lớp khác hoặc xóa từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL / DRAWER */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFDF7] rounded-3xl max-w-3xl w-full border-2 border-indigo-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    Toán Lớp {selectedResource.grade}
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    {selectedResource.bookSeries}
                  </span>
                  <span className="text-xs text-indigo-200">
                    {selectedResource.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">{selectedResource.title}</h2>
                <p className="text-xs text-indigo-100 mt-1">
                  Nguồn chính thức: {selectedResource.officialSource}
                </p>
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Audio reading button */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center gap-2.5 text-xs text-blue-900 font-bold">
                  <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Trợ lí AI đọc nội dung kiến thức trọng tâm cho học sinh</span>
                </div>
                <button
                  onClick={() => handleSpeak(selectedResource.summaryPoints.join(". "))}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Đọc Bài
                </button>
              </div>

              {/* Part 1: Key Summary Points */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  1. Kiến Thức Cốt Lõi Cần Nhớ (Chuẩn NXB Giáo Dục)
                </h3>
                <div className="space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
                  {selectedResource.summaryPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 2: Common Mistakes & Tips */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  2. Sai Lầm Học Sinh Thường Mắc & Mẹo Khắc Phục
                </h3>
                <div className="space-y-2 bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
                  {selectedResource.tipsAndMistakes.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-rose-950 leading-relaxed">
                      <span className="font-bold text-rose-600">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 3: Interactive Practice Exercises */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    3. Bài Tập Bổ Trợ Tương Tác
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    (Trả lời xong để mở lời giải và phương pháp)
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedResource.exercises.map((ex, exIdx) => {
                    const selectedIdx = selectedAnswers[ex.id];
                    const isRevealed = revealedSolutions[ex.id];
                    const isCorrect = selectedIdx !== undefined && ex.options && ex.options[selectedIdx] === ex.correctAnswer;

                    return (
                      <div
                        key={ex.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                      >
                        <div className="font-bold text-slate-900 text-sm">
                          <span className="text-blue-600 mr-1.5">Câu {exIdx + 1}:</span>
                          {ex.question}
                        </div>

                        {/* Options */}
                        {ex.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ex.options.map((opt, oIdx) => {
                              const isSelected = selectedIdx === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(ex.id, oIdx)}
                                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs"
                                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <span className="inline-block w-5 h-5 rounded-md bg-white border text-center leading-5 mr-2 font-mono">
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Check Answer Button */}
                        <div className="pt-2 flex items-center justify-between">
                          {!isRevealed ? (
                            <button
                              disabled={selectedIdx === undefined}
                              onClick={() => handleCheckAnswer(ex.id, !!isCorrect)}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                selectedIdx !== undefined
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              Kiểm Tra Kết Quả
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" /> Chính xác! Em nhận được 1 sao vàng ⭐
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                                  <AlertTriangle className="w-4 h-4" /> Chưa chính xác. Em xem phương pháp giải bên dưới nhé!
                                </span>
                              )}
                            </div>
                          )}

                          {isRevealed && (
                            <button
                              onClick={() => {
                                setSelectedAnswers((prev) => {
                                  const n = { ...prev };
                                  delete n[ex.id];
                                  return n;
                                });
                                setRevealedSolutions((prev) => {
                                  const n = { ...prev };
                                  delete n[ex.id];
                                  return n;
                                });
                              }}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Làm lại
                            </button>
                          )}
                        </div>

                        {/* REVEALED METHOD AND HINT ONLY AFTER ANSWERING */}
                        {isRevealed && (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mt-2">
                            <div className="font-bold text-emerald-700">
                              Đáp án đúng: {ex.correctAnswer}
                            </div>
                            <div className="text-slate-600">
                              <strong>Gợi ý:</strong> {ex.hint}
                            </div>
                            <div className="text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 font-medium">
                              <strong>Hướng dẫn giải chi tiết:</strong> {ex.method}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href={selectedResource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1.5"
              >
                <span>Xem trên website gốc (hoclieubotro.nxbgd.vn)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintWorksheet(selectedResource)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>In Phiếu Học Tập</span>
                </button>

                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
