import React, { useState } from "react";
import {
  BookOpen,
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
  Check,
  HelpCircle,
  Award,
} from "lucide-react";
import { KNTTLesson, SupplementaryExercise } from "../../types";
import { KNTT_CURRICULUM_DATA } from "../../data/knttCurriculumData";
import { useApp } from "../../context/AppContext";
import { playStarSound, playFanfareSound } from "../../utils/audio";

interface KNTTTextbookCompanionProps {
  onAssignLesson?: (lesson: KNTTLesson) => void;
}

export const KNTTTextbookCompanion: React.FC<KNTTTextbookCompanionProps> = ({ onAssignLesson }) => {
  const { role, selectedGrade, setSelectedGrade, triggerStarCelebration, setActiveTab } = useApp();

  const [activeGrade, setActiveGrade] = useState<number>(selectedGrade || 3);
  const [selectedSemester, setSelectedSemester] = useState<number>(0); // 0 = all, 1 = HK1, 2 = HK2
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLesson, setActiveLesson] = useState<KNTTLesson | null>(null);

  // Exercise interaction state (Lesson detail modal)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, number>>({});
  const [submittedExercises, setSubmittedExercises] = useState<Record<string, boolean>>({});
  const [activeExerciseTab, setActiveExerciseTab] = useState<"all" | "reinforce" | "extension">("all");

  // Filter lessons
  const filteredLessons = KNTT_CURRICULUM_DATA.filter((lesson) => {
    if (activeGrade !== 0 && lesson.grade !== activeGrade) return false;
    if (selectedSemester !== 0 && lesson.semester !== selectedSemester) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = lesson.lessonTitle.toLowerCase().includes(q);
      const matchChapter = lesson.chapterTitle.toLowerCase().includes(q);
      const matchKnowledge = lesson.keyKnowledge.some(
        (k) => k.title.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchChapter && !matchKnowledge) return false;
    }
    return true;
  });

  const handleOpenLesson = (lesson: KNTTLesson) => {
    setActiveLesson(lesson);
    setExerciseAnswers({});
    setSubmittedExercises({});
    setActiveExerciseTab("all");
    playStarSound();
  };

  const handleSelectOption = (exerciseId: string, optionIndex: number) => {
    // If already submitted, prevent re-selection unless reset
    setExerciseAnswers((prev) => ({
      ...prev,
      [exerciseId]: optionIndex,
    }));
  };

  const handleSubmitAnswer = (exercise: SupplementaryExercise) => {
    const selectedIdx = exerciseAnswers[exercise.id];
    if (selectedIdx === undefined) {
      alert("Em hãy chọn một đáp án trước khi nộp bài nhé!");
      return;
    }

    const isCorrect = exercise.options ? exercise.options[selectedIdx] === exercise.correctAnswer : false;

    setSubmittedExercises((prev) => ({
      ...prev,
      [exercise.id]: true,
    }));

    if (isCorrect) {
      triggerStarCelebration(1);
    } else {
      playStarSound();
    }
  };

  const handleSpeakText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt hiện tại không hỗ trợ đọc giọng nói tự động.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintWorksheet = (lesson: KNTTLesson) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Trình duyệt đang chặn cửa sổ bật lên. Vui lòng cấp quyền mở pop-up để xem phiếu in.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${lesson.lessonTitle} - Phiếu Học Tập Bám Sát SGK Kết Nối Tri Thức</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: "Times New Roman", Times, serif; padding: 35px; color: #111; line-height: 1.5; font-size: 14px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
            .school-info { font-size: 13px; font-weight: bold; }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; color: #1e3a8a; }
            .subtitle { text-align: center; font-size: 13px; margin-bottom: 16px; font-style: italic; color: #475569; }
            .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; font-weight: bold; border: 1px dashed #999; padding: 10px; border-radius: 6px; }
            .section-title { font-size: 15px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 8px; text-transform: uppercase; }
            .knowledge-box { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
            .knowledge-item { margin-bottom: 10px; }
            .knowledge-item strong { color: #1e40af; }
            .exercise-card { margin-bottom: 16px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; page-break-inside: avoid; }
            .exercise-q { font-weight: bold; margin-bottom: 6px; }
            .exercise-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 15px; }
            .answer-space { border-bottom: 1px dotted #888; height: 28px; margin-top: 8px; }
            .footer { margin-top: 35px; border-top: 1px solid #cbd5e1; padding-top: 15px; display: flex; justify-content: space-between; font-style: italic; }
            @media print {
              body { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-info">
              TRƯỜNG TIỂU HỌC: ...................................................<br/>
              LỚP: ${lesson.grade} ............. NĂM HỌC 2025 - 2026
            </div>
            <div style="text-align: right; font-size: 12px;">
              BỘ SÁCH: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG<br/>
              ${lesson.textbookPage}
            </div>
          </div>

          <div class="title">${lesson.lessonTitle}</div>
          <div class="subtitle">${lesson.chapterTitle} · ${lesson.curriculumStandard}</div>

          <div class="student-info">
            <span>Họ và tên học sinh: ..............................................................</span>
            <span>Ngày học: ..... / ..... / 202...</span>
            <span>Điểm số: ......... / 10 ⭐</span>
          </div>

          <div class="section-title">I. KIẾN THỨC TRỌNG TÂM CẦN GHI NHỚ</div>
          <div class="knowledge-box">
            ${lesson.keyKnowledge
              .map(
                (k, i) => `
              <div class="knowledge-item">
                <strong>${i + 1}. ${k.title}:</strong> ${k.description}
                ${
                  k.rulesOrFormulas && k.rulesOrFormulas.length > 0
                    ? `<ul>${k.rulesOrFormulas.map((r) => `<li>${r}</li>`).join("")}</ul>`
                    : ""
                }
                ${k.visualExample ? `<div><em>Ví dụ mẫu:</em> ${k.visualExample}</div>` : ""}
              </div>
            `
              )
              .join("")}
          </div>

          <div class="section-title">II. BÀI TẬP CỦNG CỐ CƠ BẢN (BÁM SÁT SGK)</div>
          ${lesson.reinforcementExercises
            .map(
              (ex, i) => `
            <div class="exercise-card">
              <div class="exercise-q">Câu ${i + 1}: ${ex.question}</div>
              ${
                ex.options
                  ? `<div class="exercise-opts">${ex.options.map((opt) => `<div>[   ] ${opt}</div>`).join("")}</div>`
                  : `<div class="answer-space">Bài giải: </div><div class="answer-space"></div>`
              }
            </div>
          `
            )
            .join("")}

          <div class="section-title">III. BÀI TẬP MỞ RỘNG & PHÁT TRIỂN TƯ DUY</div>
          ${lesson.extensionExercises
            .map(
              (ex, i) => `
            <div class="exercise-card">
              <div class="exercise-q">Bài ${i + 1} (Thử thách nâng cao): ${ex.question}</div>
              ${
                ex.options
                  ? `<div class="exercise-opts">${ex.options.map((opt) => `<div>[   ] ${opt}</div>`).join("")}</div>`
                  : `<div class="answer-space">Bài giải: </div><div class="answer-space"></div>`
              }
            </div>
          `
            )
            .join("")}

          <div class="footer">
            <div>Chữ ký phụ huynh: ......................................</div>
            <div>Giáo viên chấm và nhận xét: ......................................................</div>
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

  return (
    <div className="space-y-8">
      {/* SECTION HEADER & GUIDE */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-500/30 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>CHUẨN CHƯƠNG TRÌNH GDPT 2018 · NXB GIÁO DỤC VIỆT NAM</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            MỤC LỤC & KIẾN THỨC TRỌNG TÂM SGK "KẾT NỐI TRI THỨC"
          </h2>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Hệ thống mục lục bài học bám sát 100% sách giáo khoa <strong>Toán Kết nối tri thức với cuộc sống</strong> từ
            Lớp 1 đến Lớp 5. Từng bài đều có: <em>Tóm tắt kiến thức trọng tâm SGK</em>, <em>Phiếu bài tập củng cố cơ bản</em> và{" "}
            <em>Bài tập mở rộng phát triển năng lực tư duy toán học</em>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Tóm tắt kiến thức bám sát SGK
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <Check className="w-3.5 h-3.5 text-amber-400" /> Trả lời xong mới mở hướng dẫn giải
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <Check className="w-3.5 h-3.5 text-cyan-400" /> Xuất phiếu in A4 tiện lợi
            </span>
          </div>
        </div>

        <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none hidden md:block">
          <Layers className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Grade Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-500 mr-1 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Chọn Lớp:
            </span>
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setActiveGrade(g);
                  setSelectedGrade(g);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeGrade === g
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Học kì:</span>
            {[
              { id: 0, label: "Tất cả học kì" },
              { id: 1, label: "Học kì 1" },
              { id: 2, label: "Học kì 2" },
            ].map((sem) => (
              <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedSemester === sem.id
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bài học, chủ đề SGK, kiến thức (Ví dụ: Các số 0 đến 5, Chu vi, Phân số, Vận tốc...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-slate-50/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Xóa tìm
            </button>
          )}
        </div>
      </div>

      {/* LESSONS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">
              MỤC LỤC BÀI HỌC TOÁN {activeGrade} - SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {filteredLessons.length} bài học
            </span>
          </div>

          {role === "teacher" && (
            <button
              onClick={() => setActiveTab("workshop")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Giao bài từ Xưởng Đề AI
            </button>
          )}
        </div>

        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium">Không tìm thấy bài học nào phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSemester(0);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLessons.map((lesson) => {
              const totalExercises = lesson.reinforcementExercises.length + lesson.extensionExercises.length;
              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3">
                    {/* Chapter & Page Tag */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                        {lesson.chapterTitle}
                      </span>
                      <span className="font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {lesson.textbookPage}
                      </span>
                    </div>

                    {/* Lesson Title */}
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {lesson.lessonTitle}
                    </h4>

                    {/* Objective */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      <strong>Mục tiêu:</strong> {lesson.objective}
                    </p>

                    {/* Key points snapshot */}
                    <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Trọng tâm SGK ({lesson.keyKnowledge.length} nội dung):
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {lesson.keyKnowledge.map((k, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span className="font-medium text-slate-800">{k.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {lesson.reinforcementExercises.length} Củng cố
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {lesson.extensionExercises.length} Mở rộng
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintWorksheet(lesson)}
                        title="In phiếu bài tập bám sát bài học này"
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenLesson(lesson)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                      >
                        <span>Học & Làm Bài</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* DETAILED LESSON MODAL (KIẾN THỨC + BÀI CỦNG CỐ & MỞ RỘNG) */}
      {/* ======================================================== */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-[#FFFDF7] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-amber-300/60">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 text-white flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    Sách Kết Nối Tri Thức · Lớp {activeLesson.grade}
                  </span>
                  <span className="text-indigo-200">{activeLesson.chapterTitle}</span>
                  <span className="text-amber-300 font-medium">({activeLesson.textbookPage})</span>
                </div>
                <h3 className="text-2xl font-black text-white">{activeLesson.lessonTitle}</h3>
                <p className="text-xs text-indigo-100">{activeLesson.objective}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handlePrintWorksheet(activeLesson)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                  title="In phiếu bài học này"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
              {/* SECTION 1: KIẾN THỨC TRỌNG TÂM SGK */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>I. KIẾN THỨC TRỌNG TÂM BÁM SÁT SGK KẾT NỐI TRI THỨC</span>
                  </h4>
                  <button
                    onClick={() => {
                      const fullSpeech = activeLesson.keyKnowledge
                        .map((k) => `${k.title}. ${k.description}. ${k.rulesOrFormulas ? k.rulesOrFormulas.join(". ") : ""}`)
                        .join(". ");
                      handleSpeakText(fullSpeech);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Nghe cô đọc kiến thức</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activeLesson.keyKnowledge.map((point, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="font-bold text-slate-900 text-base">{point.title}</h5>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed pl-8">{point.description}</p>

                      {point.rulesOrFormulas && point.rulesOrFormulas.length > 0 && (
                        <div className="ml-8 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 space-y-1">
                          <span className="text-xs font-black uppercase text-amber-900 block">
                            📌 Quy tắc / Công thức cần nhớ:
                          </span>
                          <ul className="text-xs space-y-1 font-medium">
                            {point.rulesOrFormulas.map((r, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-1.5">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {point.visualExample && (
                        <div className="ml-8 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium">
                          <strong>Ví dụ trực quan:</strong> {point.visualExample}
                        </div>
                      )}

                      {point.commonMistakes && point.commonMistakes.length > 0 && (
                        <div className="ml-8 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900">
                          <span className="font-bold flex items-center gap-1 text-red-700 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            Lưu ý tránh sai sót khi làm bài:
                          </span>
                          {point.commonMistakes.join("; ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* EXERCISES FILTER TABS */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <span>II. LUYỆN TẬP TƯƠNG TÁC (CỦNG CỐ & MỞ RỘNG)</span>
                    </h4>
                  </div>

                  {/* Filter Subtabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveExerciseTab("all")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeExerciseTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Tất cả ({activeLesson.reinforcementExercises.length + activeLesson.extensionExercises.length})
                    </button>
                    <button
                      onClick={() => setActiveExerciseTab("reinforce")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeExerciseTab === "reinforce"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-emerald-700"
                      }`}
                    >
                      🟢 Bài Củng Cố ({activeLesson.reinforcementExercises.length})
                    </button>
                    <button
                      onClick={() => setActiveExerciseTab("extension")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeExerciseTab === "extension"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-purple-700"
                      }`}
                    >
                      🚀 Bài Mở Rộng ({activeLesson.extensionExercises.length})
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Quy định sư phạm:</strong> Em cần suy nghĩ, chọn đáp án và bấm{" "}
                    <strong>"Nộp bài & Kiểm tra"</strong>, sau đó hệ thống mới mở <em>Gợi ý tư duy</em> và{" "}
                    <em>Hướng dẫn cách giải chi tiết</em>.
                  </span>
                </div>

                {/* EXERCISE LIST */}
                <div className="space-y-6">
                  {/* Reinforcement Section */}
                  {(activeExerciseTab === "all" || activeExerciseTab === "reinforce") && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h5 className="font-black text-slate-800 text-sm uppercase tracking-wide">
                          A. BÀI TẬP CỦNG CỐ CƠ BẢN (BÁM SÁT BÀI HỌC SGK)
                        </h5>
                      </div>

                      {activeLesson.reinforcementExercises.map((ex, exIdx) => {
                        const isSubmitted = submittedExercises[ex.id];
                        const selectedIdx = exerciseAnswers[ex.id];
                        const isCorrect =
                          isSubmitted && ex.options && selectedIdx !== undefined
                            ? ex.options[selectedIdx] === ex.correctAnswer
                            : false;

                        return (
                          <div
                            key={ex.id}
                            className={`rounded-2xl p-5 border transition-all ${
                              isSubmitted
                                ? isCorrect
                                  ? "bg-emerald-50/60 border-emerald-300"
                                  : "bg-red-50/60 border-red-300"
                                : "bg-white border-slate-200 shadow-sm"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <span className="text-xs font-black text-slate-500 uppercase">
                                Câu {exIdx + 1} · Củng cố kiến thức
                              </span>
                              {isSubmitted && (
                                <span
                                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                    isCorrect ? "bg-emerald-200 text-emerald-900" : "bg-red-200 text-red-900"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Đúng (+1 ⭐)
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-3.5 h-3.5 text-red-700" /> Chưa chính xác
                                    </>
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="text-base font-bold text-slate-900 mb-4">{ex.question}</p>

                            {/* Options */}
                            {ex.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                                {ex.options.map((opt, optIdx) => {
                                  const isOptionSelected = selectedIdx === optIdx;
                                  const isOptionCorrect = opt === ex.correctAnswer;

                                  let optClass = "border-slate-200 hover:border-blue-400 bg-slate-50 text-slate-800";
                                  if (isSubmitted) {
                                    if (isOptionCorrect) {
                                      optClass = "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold";
                                    } else if (isOptionSelected && !isOptionCorrect) {
                                      optClass = "border-red-400 bg-red-100 text-red-950 line-through";
                                    }
                                  } else if (isOptionSelected) {
                                    optClass = "border-blue-600 bg-blue-100 text-blue-950 font-bold shadow-xs";
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelectOption(ex.id, optIdx)}
                                      disabled={isSubmitted}
                                      className={`p-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${optClass}`}
                                    >
                                      <span>{opt}</span>
                                      {isSubmitted && isOptionCorrect && (
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Action Button: Submit answer */}
                            {!isSubmitted ? (
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => handleSubmitAnswer(ex)}
                                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                                >
                                  <span>Nộp bài & Kiểm tra</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              /* REVEALED SECTION: HINT & STEP-BY-STEP METHOD (ONLY AFTER SUBMISSION) */
                              <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-fadeIn">
                                <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                                    <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                                    <span>Gợi ý tư duy từ Robot Sao Sáng:</span>
                                  </div>
                                  <p className="pl-5 leading-relaxed">{ex.hint}</p>
                                </div>

                                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-300 text-xs text-blue-950 space-y-1">
                                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    <span>Hướng dẫn cách làm & Lời giải chi tiết:</span>
                                  </div>
                                  <p className="pl-5 leading-relaxed font-medium">{ex.method}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Extension Section */}
                  {(activeExerciseTab === "all" || activeExerciseTab === "extension") && (
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <h5 className="font-black text-purple-900 text-sm uppercase tracking-wide">
                          B. BÀI TẬP MỞ RỘNG & PHÁT TRIỂN TƯ DUY TOÁN HỌC (NÂNG CAO)
                        </h5>
                      </div>

                      {activeLesson.extensionExercises.map((ex, exIdx) => {
                        const isSubmitted = submittedExercises[ex.id];
                        const selectedIdx = exerciseAnswers[ex.id];
                        const isCorrect =
                          isSubmitted && ex.options && selectedIdx !== undefined
                            ? ex.options[selectedIdx] === ex.correctAnswer
                            : false;

                        return (
                          <div
                            key={ex.id}
                            className={`rounded-2xl p-5 border transition-all ${
                              isSubmitted
                                ? isCorrect
                                  ? "bg-emerald-50/60 border-emerald-300"
                                  : "bg-red-50/60 border-red-300"
                                : "bg-purple-50/40 border-purple-200 shadow-sm"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <span className="text-xs font-black text-purple-700 uppercase flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" /> Thử thách {exIdx + 1} · Vận dụng sáng tạo
                              </span>
                              {isSubmitted && (
                                <span
                                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                    isCorrect ? "bg-emerald-200 text-emerald-900" : "bg-red-200 text-red-900"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Xuất sắc (+1 ⭐)
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-3.5 h-3.5 text-red-700" /> Cần xem lại
                                    </>
                                  )}
                                </span>
                              )}
                            </div>

                            <p className="text-base font-bold text-slate-900 mb-4">{ex.question}</p>

                            {/* Options */}
                            {ex.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                                {ex.options.map((opt, optIdx) => {
                                  const isOptionSelected = selectedIdx === optIdx;
                                  const isOptionCorrect = opt === ex.correctAnswer;

                                  let optClass = "border-slate-200 hover:border-purple-400 bg-white text-slate-800";
                                  if (isSubmitted) {
                                    if (isOptionCorrect) {
                                      optClass = "border-emerald-500 bg-emerald-100 text-emerald-950 font-bold";
                                    } else if (isOptionSelected && !isOptionCorrect) {
                                      optClass = "border-red-400 bg-red-100 text-red-950 line-through";
                                    }
                                  } else if (isOptionSelected) {
                                    optClass = "border-purple-600 bg-purple-100 text-purple-950 font-bold shadow-xs";
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelectOption(ex.id, optIdx)}
                                      disabled={isSubmitted}
                                      className={`p-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${optClass}`}
                                    >
                                      <span>{opt}</span>
                                      {isSubmitted && isOptionCorrect && (
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Action Button: Submit answer */}
                            {!isSubmitted ? (
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => handleSubmitAnswer(ex)}
                                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                                >
                                  <span>Nộp bài & Kiểm tra</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              /* REVEALED SECTION: HINT & STEP-BY-STEP METHOD (ONLY AFTER SUBMISSION) */
                              <div className="mt-4 pt-4 border-t border-purple-200 space-y-3 animate-fadeIn">
                                <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
                                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                                    <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                                    <span>Gợi ý tư duy mở rộng:</span>
                                  </div>
                                  <p className="pl-5 leading-relaxed">{ex.hint}</p>
                                </div>

                                <div className="p-3.5 rounded-xl bg-purple-100/70 border border-purple-300 text-xs text-purple-950 space-y-1">
                                  <div className="font-bold flex items-center gap-1.5 text-purple-900">
                                    <CheckCircle2 className="w-4 h-4 text-purple-700" />
                                    <span>Phương pháp & Hướng dẫn cách làm chi tiết:</span>
                                  </div>
                                  <p className="pl-5 leading-relaxed font-medium">{ex.method}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500">
                Chương trình Giáo dục Phổ thông 2018 · NXB Giáo dục Việt Nam
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePrintWorksheet(activeLesson)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>In Phiếu Học Tập A4</span>
                </button>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
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
