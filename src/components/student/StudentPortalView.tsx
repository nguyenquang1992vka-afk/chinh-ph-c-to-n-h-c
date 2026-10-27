import React from "react";
import {
  Star,
  Award,
  BookOpen,
  RotateCcw,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const StudentPortalView: React.FC = () => {
  const {
    currentStudent,
    students,
    setCurrentStudentId,
    assignments,
    submissions,
    badges,
    setActiveTab,
    questionBank,
  } = useApp();

  const studentSubmissions = submissions.filter((s) => s.studentId === currentStudent.id);
  const myAssignments = assignments.filter(
    (a) => a.targetClassId === currentStudent.classId || a.targetClassId === "all"
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Student Switcher for multi-student demo */}
      <div className="mb-6 flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase px-2">
          Đổi tài khoản học sinh (Mô phỏng lớp học):
        </span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {students.slice(0, 6).map((st) => (
            <button
              key={st.id}
              onClick={() => setCurrentStudentId(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStudent.id === st.id
                  ? "bg-[#3478F6] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <img src={st.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
              <span>{st.fullName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 border-4 border-white shadow-2xl"
            />
            <span className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
              CẤP {currentStudent.level}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="bg-white/20 text-white font-extrabold text-xs px-3 py-0.5 rounded-full">
                Mã số: {currentStudent.studentCode}
              </span>
              <span className="bg-white/20 text-white font-extrabold text-xs px-3 py-0.5 rounded-full">
                {currentStudent.className}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black mb-2">{currentStudent.fullName}</h1>
            <p className="text-blue-100 text-sm">
              "Mỗi bài toán – Một thử thách. Mỗi nhiệm vụ – Một ngôi sao. Mỗi ngày – Một bước tiến."
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              {/* Star Bank Display */}
              <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                <Star className="w-8 h-8 text-[#FFC83D] fill-[#FFC83D] star-glow" />
                <div>
                  <span className="text-[11px] text-white/80 uppercase font-bold block">
                    NGÂN HÀNG SAO
                  </span>
                  <span className="text-2xl font-black tabular-nums">{currentStudent.totalStars} Ngôi Sao</span>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-400 fill-orange-400" />
                <div>
                  <span className="text-[11px] text-white/80 uppercase font-bold block">
                    CHUỖI CHĂM CHỈ
                  </span>
                  <span className="text-2xl font-black tabular-nums">{currentStudent.streakDays} Ngày</span>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-300" />
                <div>
                  <span className="text-[11px] text-white/80 uppercase font-bold block">
                    ĐIỂM TRUNG BÌNH
                  </span>
                  <span className="text-2xl font-black tabular-nums">{currentStudent.averageScore} / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Badges & Today's Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Badges Collection (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              BỘ SƯU TẬP HUY HIỆU TỎA SÁNG
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mỗi huy hiệu ghi dấu một nỗ lực vượt bậc của em trong hành trình học tập.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => {
                const isUnlocked = currentStudent.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border transition-all text-center ${
                      isUnlocked
                        ? "bg-amber-50/50 border-amber-300 shadow-xs"
                        : "bg-slate-50 border-slate-200 opacity-40 grayscale"
                    }`}
                  >
                    <div
                      className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-white mb-2 shadow-xs"
                      style={{ backgroundColor: isUnlocked ? b.color : "#94a3b8" }}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">
                      {b.title}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {isUnlocked ? "Đã đạt được" : "Chưa mở khóa"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Assigned Missions (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#3478F6]" />
                NHIỆM VỤ HÔM NAY TỪ THẦY CÔ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hoàn thành đúng hạn để nhận thêm sao thưởng khuyến khích!
              </p>
            </div>
            <button
              onClick={() => setActiveTab("planets")}
              className="text-xs font-bold text-[#3478F6] hover:underline"
            >
              Vào Hành Tinh Toán Học →
            </button>
          </div>

          <div className="space-y-4">
            {myAssignments.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                      Toán Lớp {task.grade}
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      +{task.starReward} Sao
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                </div>

                <button
                  onClick={() => setActiveTab("planets")}
                  className="px-5 py-2.5 bg-[#3478F6] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                >
                  Bắt đầu làm bài
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Mistake Review Callout */}
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-1">
                <RotateCcw className="w-4 h-4 text-[#8957F6]" />
                Luyện Lại Câu Sai Để Nhận "Sao Vượt Khó"
              </div>
              <p className="text-xs text-slate-600">
                Em có {currentStudent.incorrectQuestions.length} câu hỏi cần củng cố lại để nắm chắc kiến thức 100%.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("planets")}
              className="px-4 py-2 bg-[#8957F6] hover:bg-[#7844eb] text-white text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0"
            >
              Ôn Lại Câu Sai
            </button>
          </div>

          {/* Supplementary Learning Materials Callout */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Học Liệu Bổ Trợ & Vở Bài Tập NXB Giáo Dục
              </div>
              <p className="text-xs text-blue-700">
                Ôn tập kiến thức trọng tâm, làm phiếu củng cố kiến thức theo chuẩn <code>hoclieubotro.nxbgd.vn</code>.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("resources")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0"
            >
              Xem Học Liệu Bổ Trợ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
