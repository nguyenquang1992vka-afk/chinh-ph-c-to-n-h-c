import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Volume2,
  RotateCcw,
  Star,
  ChevronRight,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { APP_IMAGES } from "../../data/assets";
import { MathQuestion } from "../../types";
import { useApp } from "../../context/AppContext";
import { playCorrectSound, playIncorrectSound, speakVietnamese } from "../../utils/audio";
import { SaoSangRobot } from "../assistant/SaoSangRobot";

export const PlanetsView: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    questionBank,
    currentStudent,
    submitStudentWork,
    setActiveTab,
  } = useApp();

  const [activePlanet, setActivePlanet] = useState<"easy" | "medium" | "hard" | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter questions for the selected planet & grade
  const startPlanetMission = (difficulty: "easy" | "medium" | "hard") => {
    setActivePlanet(difficulty);
    let matched = questionBank.filter(
      (q) => q.grade === selectedGrade && q.difficulty === difficulty
    );

    // If fewer than 5 questions exist for this specific difficulty & grade, supplement with other questions of that grade
    if (matched.length < 5) {
      const supplemental = questionBank.filter(
        (q) => q.grade === selectedGrade && q.difficulty !== difficulty
      );
      matched = [...matched, ...supplemental].slice(0, 5);
    } else {
      matched = matched.slice(0, 5);
    }

    setSessionQuestions(matched);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmissionResult(null);
    setShowExplanation(false);
    setStartTime(Date.now());
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submissionResult) return; // already finished
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
      const res = await fetch("/api/grade-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          answers: selectedAnswers,
          questions: sessionQuestions,
          timeSpentSeconds,
          isHardPlanet: activePlanet === "hard",
          isOnTime: true,
          previousScore: currentStudent.averageScore || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult(data);
        submitStudentWork({
          assignmentId: `planet_${activePlanet}_${Date.now()}`,
          studentId: currentStudent.id,
          studentName: currentStudent.fullName,
          score: data.score,
          percentage: data.percentage,
          correctCount: data.correctCount,
          totalQuestions: data.totalQuestions,
          timeSpentSeconds,
          starsAwarded: data.starsAwarded,
          starBreakdown: data.starBreakdown,
          answers: selectedAnswers,
        });

        if (data.percentage >= 80) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }
      }
    } catch (err) {
      console.error("Grading error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = sessionQuestions[currentIndex];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Grade Selector Strip */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">3 HÀNH TINH TOÁN HỌC CÁ NHÂN HÓA</h2>
          <p className="text-sm text-slate-500">
            Học sinh được phân hóa theo năng lực thực tế, tự chọn hành tinh phù hợp với mục tiêu học tập.
          </p>
        </div>

        {/* Grade buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 px-2 uppercase">Khối lớp:</span>
          {[1, 2, 3, 4, 5].map((g) => (
            <button
              key={g}
              onClick={() => {
                setSelectedGrade(g);
                if (activePlanet) startPlanetMission(activePlanet);
              }}
              className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                selectedGrade === g
                  ? "bg-[#3478F6] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Planets Showcase Cards (when not currently in test session) */}
      {!activePlanet ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Planet 1: Khởi Động */}
          <div className="group bg-white rounded-3xl border-2 border-emerald-200 hover:border-emerald-400 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-emerald-50 mb-6 border border-emerald-100">
                <img
                  src={APP_IMAGES.planetEasy}
                  alt="Hành tinh Khởi Động"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  MỨC 1 · DỄ
                </span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-2">HÀNH TINH KHỞI ĐỘNG</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Dành cho các bạn nhỏ củng cố kiến thức nền tảng, làm quen các khái niệm và bảng tính căn bản
                theo chuẩn GDPT 2018 một cách nhẹ nhàng, vui vẻ.
              </p>
              <div className="text-xs text-emerald-800 space-y-1 mb-6">
                <div>✓ 100% câu hỏi nhận biết và tính nhẩm nhanh</div>
                <div>✓ Trợ lí Sao Sáng AI đọc và hỗ trợ từng bước</div>
                <div>✓ Nhận ngay +2 sao khi hoàn thành</div>
              </div>
            </div>

            <button
              onClick={() => startPlanetMission("easy")}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Khám Phá Khởi Động
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Planet 2: Chinh Phục */}
          <div className="group bg-white rounded-3xl border-2 border-blue-200 hover:border-blue-400 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-blue-50 mb-6 border border-blue-100">
                <img
                  src={APP_IMAGES.planetMedium}
                  alt="Hành tinh Chinh Phục"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#3478F6] text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  MỨC 2 · TRUNG BÌNH
                </span>
              </div>
              <h3 className="text-2xl font-bold text-blue-950 mb-2">HÀNH TINH CHINH PHỤC</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Dành cho học sinh rèn luyện kiến thức kết nối, giải toán có lời văn gắn với đời sống thực tế
                và bài toán hình học 2-3 bước tính.
              </p>
              <div className="text-xs text-blue-800 space-y-1 mb-6">
                <div>✓ Dạng toán liên môn và thực tế sinh động</div>
                <div>✓ Phân tích chu vi, diện tích và phân số</div>
                <div>✓ Nhận ngay +3 sao khi đạt kết quả tốt</div>
              </div>
            </div>

            <button
              onClick={() => startPlanetMission("medium")}
              className="w-full py-3 bg-gradient-to-r from-[#3478F6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Tiến Vào Chinh Phục
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Planet 3: Thử Thách */}
          <div className="group bg-white rounded-3xl border-2 border-purple-200 hover:border-purple-400 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-purple-50 mb-6 border border-purple-100">
                <img
                  src={APP_IMAGES.planetHard}
                  alt="Hành tinh Thử Thách"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#8957F6] text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  MỨC 3 · VẬN DỤNG CAO
                </span>
              </div>
              <h3 className="text-2xl font-bold text-purple-950 mb-2">HÀNH TINH THỬ THÁCH</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Dành cho học sinh yêu thích tư duy logic, toán nâng cao, đấu trường Toán tiểu học và toán mở
                rộng phát triển năng lực vượt bậc.
              </p>
              <div className="text-xs text-purple-800 space-y-1 mb-6">
                <div>✓ Toán tư duy trừu tượng và tối ưu hóa</div>
                <div>✓ Bài toán đố thông minh đòi hỏi suy luận</div>
                <div>✓ Thưởng đặc biệt: +3 sao thưởng độ khó</div>
              </div>
            </div>

            <button
              onClick={() => startPlanetMission("hard")}
              className="w-full py-3 bg-gradient-to-r from-[#8957F6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Vượt Qua Thử Thách
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NXBGD Supplementary Material Assistant Tip */}
        <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm font-black text-xs">
              SGK
            </div>
            <div>
              <h4 className="text-sm font-black text-blue-950">
                Ôn tập bám sát Sách Giáo Khoa "Kết Nối Tri Thức" (Lớp {selectedGrade})
              </h4>
              <p className="text-xs text-blue-800 mt-0.5">
                Mục lục bài học theo tuần/chủ đề, tóm tắt lý thuyết trọng tâm, bài tập củng cố cơ bản và mở rộng tư duy toán học.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("resources")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Mục Lục SGK & Củng Cố</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        </>
      ) : (
        /* Active Practice Arena */
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden mb-12">
          {/* Header of Test Session */}
          <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActivePlanet(null)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold underline"
              >
                ← Chọn hành tinh khác
              </button>
              <span className="text-slate-600">|</span>
              <span className="font-bold text-base text-amber-300">
                {activePlanet === "easy" && "Hành Tinh Khởi Động (Dễ)"}
                {activePlanet === "medium" && "Hành Tinh Chinh Phục (Trung Bình)"}
                {activePlanet === "hard" && "Hành Tinh Thử Thách (Khó)"} - Lớp {selectedGrade}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" />
                <span>Đang ghi nhận thời gian làm bài</span>
              </div>
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                Câu {currentIndex + 1} / {sessionQuestions.length}
              </div>
            </div>
          </div>

          {/* Question Card Content */}
          {currentQ ? (
            <div className="p-6 sm:p-10">
              {/* Question text & Audio speak */}
              {/* Question text & Audio speak */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold">
                  <span className="uppercase tracking-wider text-[#3478F6]">{currentQ.topic}</span>
                  <button
                    onClick={() => {
                      const text = `Câu hỏi: ${currentQ.questionText}`;
                      speakVietnamese(text);
                    }}
                    className="flex items-center gap-1 text-[#3478F6] hover:underline"
                  >
                    <Volume2 className="w-4 h-4" /> Đọc câu hỏi
                  </button>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {currentQ.questionText}
                </h3>

                {/* Pre-answer notice */}
                {selectedAnswers[currentQ.id] === undefined && (
                  <div className="mt-4 p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-blue-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#3478F6] shrink-0" />
                    <span>
                      Em hãy chọn một phương án (A, B, C hoặc D) bên dưới. Sau khi chọn xong, hệ thống sẽ lập tức mở khóa Gợi ý tư duy và Hướng dẫn cách làm chi tiết từng bước!
                    </span>
                  </div>
                )}
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const hasAnswered = selectedAnswers[currentQ.id] !== undefined;
                  const isThisCorrect = optIdx === currentQ.correctIndex;
                  const optionLetters = ["A", "B", "C", "D"];

                  let cardStyle = "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
                  let badgeStyle = "bg-slate-100 text-slate-700";

                  if (hasAnswered) {
                    if (isSelected && isThisCorrect) {
                      cardStyle = "border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-300";
                      badgeStyle = "bg-emerald-600 text-white";
                    } else if (isSelected && !isThisCorrect) {
                      cardStyle = "border-rose-400 bg-rose-50/80 shadow-md ring-2 ring-rose-200";
                      badgeStyle = "bg-rose-600 text-white";
                    } else if (isThisCorrect) {
                      cardStyle = "border-emerald-400 bg-emerald-50/40 border-dashed";
                      badgeStyle = "bg-emerald-100 text-emerald-800";
                    } else {
                      cardStyle = "border-slate-200 opacity-60 bg-slate-50/40";
                      badgeStyle = "bg-slate-100 text-slate-400";
                    }
                  } else if (isSelected) {
                    cardStyle = "border-[#3478F6] bg-blue-50/70 shadow-sm";
                    badgeStyle = "bg-[#3478F6] text-white";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${cardStyle}`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${badgeStyle}`}
                      >
                        {optionLetters[optIdx]}
                      </span>
                      <span className="text-lg font-bold text-slate-900 leading-tight">
                        {opt}
                      </span>
                      {hasAnswered && isSelected && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isThisCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* POST-ANSWER REVEAL: Hướng dẫn cách làm & Gợi ý tư duy mở khóa SAU KHI HỌC SINH TRẢ LỜI */}
              {selectedAnswers[currentQ.id] !== undefined && (
                <div className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-amber-50/90 via-purple-50/50 to-blue-50/60 border-2 border-amber-300 rounded-3xl shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                        ★
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">
                          HƯỚNG DẪN CÁCH LÀM & PHÂN TÍCH TƯ DUY
                        </h4>
                        <p className="text-xs text-slate-500">
                          (Đã mở khóa sau khi em chọn phương án trả lời)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const readGuidance = `Hướng dẫn cách làm bài này: ${currentQ.explanation}. Gợi ý tư duy: ${currentQ.visualHint || ""}`;
                        speakVietnamese(readGuidance);
                      }}
                      className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      Nghe đọc hướng dẫn
                    </button>
                  </div>

                  {/* Student Answer feedback banner */}
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {selectedAnswers[currentQ.id] === currentQ.correctIndex ? (
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Chúc mừng em! Em đã chọn đúng phương án {["A", "B", "C", "D"][selectedAnswers[currentQ.id]]} ({currentQ.options[selectedAnswers[currentQ.id]]}).
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-amber-600" />
                        Em đã chọn phương án {["A", "B", "C", "D"][selectedAnswers[currentQ.id]]}. Đáp án chuẩn xác là {["A", "B", "C", "D"][currentQ.correctIndex]} ({currentQ.options[currentQ.correctIndex]}). Em hãy đọc kĩ các bước dưới đây nhé:
                      </span>
                    )}
                  </div>

                  {/* Detailed Step-by-Step Guidance */}
                  <div className="bg-white p-4 rounded-2xl border border-amber-200/90 text-sm space-y-2.5">
                    <div>
                      <span className="font-extrabold text-[#3478F6] text-xs uppercase tracking-wide block mb-1">
                        1. Hướng dẫn cách làm chi tiết từng bước:
                      </span>
                      <p className="text-slate-800 leading-relaxed font-semibold">
                        {currentQ.explanation}
                      </p>
                    </div>

                    {currentQ.visualHint && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="font-extrabold text-[#8957F6] text-xs uppercase tracking-wide block mb-1">
                          2. Gợi ý tư duy & phương pháp giải:
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {currentQ.visualHint}
                        </p>
                      </div>
                    )}

                    {currentQ.calculationCheck && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
                        <span className="font-bold text-slate-600">Kiểm tra thuật toán: </span>
                        {currentQ.calculationCheck}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination and Submission controls */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  >
                    Câu trước
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === sessionQuestions.length - 1}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  >
                    Câu kế tiếp
                  </button>
                </div>

                {/* Question jumping dots */}
                <div className="flex items-center gap-1.5">
                  {sessionQuestions.map((q, idx) => {
                    const answered = selectedAnswers[q.id] !== undefined;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          idx === currentIndex
                            ? "bg-[#3478F6] text-white scale-110"
                            : answered
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-base rounded-xl shadow-lg hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Star className="w-5 h-5 fill-white star-glow" />
                  {isSubmitting ? "Máy chủ đang chấm..." : "NỘP BÀI TỨC THÌ"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Không tìm thấy câu hỏi cho mục này. Vui lòng thử chọn hành tinh khác.
            </div>
          )}
        </div>
      )}

      {/* Celebratory Result Modal */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full p-8 shadow-2xl border-2 border-amber-300 text-center relative max-h-[90vh] overflow-y-auto">
            {/* Sparkling Trophy Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-lg flex items-center justify-center mb-4">
              <div className="w-full h-full bg-[#FFFDF7] rounded-[22px] flex items-center justify-center">
                <Star className="w-10 h-10 text-amber-500 fill-amber-400 star-glow" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              CHÚC MỪNG EM ĐÃ HOÀN THÀNH THỬ THÁCH!
            </h3>
            <p className="text-slate-600 text-base mb-6 font-medium">
              {submissionResult.praiseMessage}
            </p>

            {/* Score summary grid */}
            <div className="grid grid-cols-3 gap-3 mb-6 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center">
              <div>
                <span className="text-xs text-slate-500 font-bold block">ĐIỂM SỐ</span>
                <span className="text-3xl font-extrabold text-[#3478F6] tabular-nums">
                  {submissionResult.score} / 10
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">SỐ CÂU ĐÚNG</span>
                <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">
                  {submissionResult.correctCount}/{submissionResult.totalQuestions}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">SAO NHẬN ĐƯỢC</span>
                <span className="text-3xl font-extrabold text-amber-500 tabular-nums flex items-center justify-center gap-1">
                  +{submissionResult.starsAwarded}
                  <Star className="w-6 h-6 fill-amber-400 inline" />
                </span>
              </div>
            </div>

            {/* Star breakdown rules */}
            <div className="text-left bg-white p-4 rounded-xl border border-slate-200 mb-6 space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900 text-sm block mb-1">
                Chi tiết quy tắc thưởng sao:
              </span>
              {submissionResult.starBreakdown.map((rule: string, rIdx: number) => (
                <div key={rIdx} className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            {/* Review all solutions accordion button */}
            <div className="mb-6">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-2xl text-xs font-bold transition-colors flex items-center justify-between"
              >
                <span>{showExplanation ? "Ẩn danh sách lời giải chi tiết" : "Xem hướng dẫn cách làm chi tiết tất cả các câu"}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showExplanation ? "rotate-90" : ""}`} />
              </button>

              {showExplanation && (
                <div className="mt-3 space-y-3 text-left max-h-60 overflow-y-auto pr-1">
                  {sessionQuestions.map((q, qIdx) => {
                    const ans = selectedAnswers[q.id];
                    const isRight = ans === q.correctIndex;
                    return (
                      <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-800">Câu {qIdx + 1}: {q.questionText}</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${isRight ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {isRight ? "Đúng" : "Sai"}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          Đáp án đúng: <span className="font-bold text-emerald-700">{q.options[q.correctIndex]}</span>
                        </div>
                        <div className="text-slate-700 bg-slate-50 p-2 rounded-lg font-medium">
                          <strong>Cách làm: </strong>{q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setActivePlanet(null);
                }}
                className="flex-1 py-3 bg-[#3478F6] hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md"
              >
                Chinh phục bài mới
              </button>
              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setActiveTab("leaderboard");
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-white" />
                Xem Bảng Vàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Robot Helper for current question: only reveals hints & solution when hasAnswered is true */}
      <SaoSangRobot
        currentQuestion={currentQ}
        hasAnswered={currentQ ? selectedAnswers[currentQ.id] !== undefined : false}
      />
    </div>
  );
};
