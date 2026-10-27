import React, { useState } from "react";
import { Award, Trophy, Star, TrendingUp, Flame, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const StarLeaderboard: React.FC = () => {
  const { leaderboard, classes } = useApp();
  const [selectedClassFilter, setSelectedClassFilter] = useState("all");

  const filtered = selectedClassFilter === "all"
    ? leaderboard
    : leaderboard.filter((item) => item.className.includes(selectedClassFilter));

  const top3 = filtered.slice(0, 3);
  const others = filtered.slice(3, 10);

  // Vietnam Timezone (GMT+7) calculation for weekly closing
  const now = new Date();
  const closingDate = new Date(now);
  closingDate.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  closingDate.setHours(23, 59, 59, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Vinh Danh Hàng Tuần
              </span>
              <span className="text-amber-100 text-xs">Múi giờ Việt Nam (GMT+7)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              BẢNG VÀNG TỎA SÁNG TOÁN HỌC
            </h1>
            <p className="text-amber-100 text-sm mt-1 max-w-xl">
              Tuyên dương các bạn nhỏ có nỗ lực học tập xuất sắc, hoàn thành nhiệm vụ và tích lũy ngôi sao kiên trì nhất tuần.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-xs">
            <div className="flex items-center gap-1.5 text-amber-200 mb-1 font-semibold">
              <Calendar className="w-4 h-4" />
              Thời gian chốt tuần:
            </div>
            <div className="font-bold text-white text-sm">
              23:59 Chủ Nhật ({closingDate.toLocaleDateString("vi-VN")})
            </div>
          </div>
        </div>
      </div>

      {/* Class filter segmented control */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase px-3">Lọc theo lớp:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedClassFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedClassFilter === "all"
                ? "bg-[#3478F6] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Toàn Trường
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassFilter(cls.name.split(" - ")[0])}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedClassFilter === cls.name.split(" - ")[0]
                  ? "bg-[#3478F6] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cls.name.split(" - ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
          {/* Top 2: Silver */}
          <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm text-center relative pt-10">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-extrabold text-sm flex items-center justify-center border-2 border-white shadow-md">
              2
            </span>
            <img
              src={top3[1].avatarUrl}
              alt=""
              className="w-20 h-20 mx-auto rounded-full bg-slate-100 border-4 border-slate-200 mb-3 shadow-md"
            />
            <h3 className="font-extrabold text-lg text-slate-900">{top3[1].studentName}</h3>
            <p className="text-xs text-slate-500 mb-3">{top3[1].className}</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full font-bold text-slate-700 text-sm">
              <Star className="w-4 h-4 fill-slate-400 text-slate-500" />
              <span>{top3[1].weeklyStars} Sao tuần</span>
            </div>
            <div className="mt-3 text-[11px] font-bold text-emerald-600">
              Tổng tích lũy: {top3[1].totalStars} ★
            </div>
          </div>

          {/* Top 1: Gold Champion */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl text-center relative pt-12 transform md:-translate-y-4">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFC83D] text-amber-950 font-black text-lg flex items-center justify-center border-4 border-white shadow-lg star-glow">
              1
            </span>
            <div className="relative inline-block mb-3">
              <img
                src={top3[0].avatarUrl}
                alt=""
                className="w-24 h-24 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full">
                <Trophy className="w-4 h-4 fill-white" />
              </span>
            </div>
            <h3 className="font-black text-2xl text-slate-900">{top3[0].studentName}</h3>
            <p className="text-xs text-amber-800 font-bold mb-3">{top3[0].className}</p>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full font-black text-base shadow-sm">
              <Star className="w-4 h-4 fill-white" />
              <span>{top3[0].weeklyStars} Sao tuần</span>
            </div>
            <div className="mt-4 text-xs font-extrabold text-amber-900 bg-amber-100/70 py-1 px-3 rounded-lg inline-block">
              {top3[0].tag || "Siêu Sao Tuần"} · Tổng: {top3[0].totalStars} ★
            </div>
          </div>

          {/* Top 3: Bronze */}
          <div className="order-3 bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm text-center relative pt-10">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center border-2 border-white shadow-md">
              3
            </span>
            <img
              src={top3[2].avatarUrl}
              alt=""
              className="w-20 h-20 mx-auto rounded-full bg-amber-50 border-4 border-amber-200 mb-3 shadow-md"
            />
            <h3 className="font-extrabold text-lg text-slate-900">{top3[2].studentName}</h3>
            <p className="text-xs text-slate-500 mb-3">{top3[2].className}</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full font-bold text-amber-800 text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>{top3[2].weeklyStars} Sao tuần</span>
            </div>
            <div className="mt-3 text-[11px] font-bold text-amber-700">
              Tổng tích lũy: {top3[2].totalStars} ★
            </div>
          </div>
        </div>
      )}

      {/* TOP 4 - 10 LEADERBOARD TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          TOP 10 CHINH PHỤC VÀ TIẾN BỘ TUẦN NÀY
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Hạng</th>
                <th className="py-3 px-4">Học Sinh</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4">Danh Hiệu</th>
                <th className="py-3 px-4">Sao Tuần Này</th>
                <th className="py-3 px-4">Tổng Sao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {others.map((entry, idx) => (
                <tr key={entry.studentId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-600">#{idx + 4}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
                    {entry.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{entry.className}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {entry.tag || "Ngôi Sao Chăm Chỉ"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-600 tabular-nums">
                    +{entry.weeklyStars} ★
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-800 tabular-nums">
                    {entry.totalStars} ★
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety & Educational Privacy Note */}
      <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Bảo mật giáo dục: Bảng vàng chỉ hiển thị sao thưởng khích lệ và danh hiệu tích cực. Điểm số kiểm tra chính thức và thông tin cá nhân của học sinh luôn được bảo mật tuyệt đối.
        </span>
      </div>
    </div>
  );
};
