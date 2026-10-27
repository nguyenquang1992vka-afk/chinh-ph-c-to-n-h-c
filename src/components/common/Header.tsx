import { Star, Volume2, VolumeX, Shield, Award, Sparkles, User, School, Compass, Gamepad2, LogOut, GraduationCap, BookOpen } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Header: React.FC = () => {
  const {
    role,
    activeTab,
    setActiveTab,
    currentStudent,
    soundOn,
    toggleSound,
    logout,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3478F6] to-[#8957F6] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#FFFDF7] rounded-[14px] flex items-center justify-center">
              <Star className="w-6 h-6 text-[#FFC83D] fill-[#FFC83D] star-glow" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
              HÀNH TRÌNH TỎA SÁNG
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-wide mt-1">
              {role === "teacher" ? "Cổng Giáo Viên · Quản Trị Sư Phạm Số" : "Cổng Học Sinh · Chinh Phục Toán AI"}
            </span>
          </div>
        </div>

        {/* Zone 2: Role-based Navigation Links (Strict RBAC) */}
        <nav className="hidden lg:flex items-center gap-6 text-base font-semibold text-slate-700 whitespace-nowrap shrink-0">
          <button
            onClick={() => setActiveTab("home")}
            className={`transition-colors py-1 hover:text-[#3478F6] ${
              activeTab === "home" ? "text-[#3478F6] border-b-2 border-[#3478F6]" : ""
            }`}
          >
            Trang Chủ
          </button>

          {/* Teacher Navigation */}
          {role === "teacher" && (
            <button
              onClick={() => setActiveTab("workshop")}
              className={`transition-colors py-1 hover:text-[#8957F6] flex items-center gap-1.5 ${
                activeTab === "workshop" ? "text-[#8957F6] border-b-2 border-[#8957F6]" : ""
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#8957F6]" />
              Xưởng Đề AI & Quản Lí
            </button>
          )}

          <button
            onClick={() => setActiveTab("planets")}
            className={`transition-colors py-1 hover:text-[#3478F6] ${
              activeTab === "planets" ? "text-[#3478F6] border-b-2 border-[#3478F6]" : ""
            }`}
          >
            Hành Tinh Toán Học
          </button>

          {/* Student Navigation */}
          {role === "student" && (
            <button
              onClick={() => setActiveTab("student_profile")}
              className={`transition-colors py-1 hover:text-[#3478F6] ${
                activeTab === "student_profile" ? "text-[#3478F6] border-b-2 border-[#3478F6]" : ""
              }`}
            >
              Nhiệm Vụ Của Em
            </button>
          )}

          <button
            onClick={() => setActiveTab("games")}
            className={`transition-colors py-1 hover:text-[#FF6B9C] flex items-center gap-1.5 ${
              activeTab === "games" ? "text-[#FF6B9C] border-b-2 border-[#FF6B9C]" : ""
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-[#FF6B9C]" />
            Thế Giới Trò Chơi
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`transition-colors py-1 hover:text-[#3478F6] flex items-center gap-1.5 ${
              activeTab === "resources" ? "text-[#3478F6] border-b-2 border-[#3478F6]" : ""
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#3478F6]" />
            Mục Lục SGK & Củng Cố
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`transition-colors py-1 hover:text-[#FFC83D] flex items-center gap-1.5 ${
              activeTab === "leaderboard" ? "text-amber-600 border-b-2 border-amber-500" : ""
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            Bảng Vàng
          </button>
        </nav>

        {/* Zone 3: User Identity & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-[#3478F6]" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* User Info Badge */}
          {role === "student" ? (
            <button
              onClick={() => setActiveTab("student_profile")}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300 rounded-full hover:shadow-xs transition-shadow"
            >
              <img src={currentStudent.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
              <span className="font-bold text-amber-900 text-xs hidden sm:inline">
                {currentStudent.fullName}
              </span>
              <div className="flex items-center gap-1 bg-amber-200/60 px-1.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                <span className="font-black text-amber-950 text-xs tabular-nums">
                  {currentStudent.totalStars}
                </span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-purple-900 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-[#8957F6]" />
              <span className="hidden sm:inline">Cô Nguyễn Thị Mai</span>
              <span className="bg-purple-200/80 px-1.5 py-0.5 rounded text-[10px]">Giáo viên</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Đăng xuất khỏi tài khoản"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 px-2 py-2 bg-white/90 text-xs font-bold text-slate-700">
        <button
          onClick={() => setActiveTab("home")}
          className={`py-1 px-2 rounded-md ${activeTab === "home" ? "text-[#3478F6] bg-blue-50" : ""}`}
        >
          Trang Chủ
        </button>

        {role === "teacher" ? (
          <button
            onClick={() => setActiveTab("workshop")}
            className={`py-1 px-2 rounded-md ${activeTab === "workshop" ? "text-[#8957F6] bg-purple-50" : ""}`}
          >
            Xưởng Đề AI
          </button>
        ) : (
          <button
            onClick={() => setActiveTab("student_profile")}
            className={`py-1 px-2 rounded-md ${activeTab === "student_profile" ? "text-[#3478F6] bg-blue-50" : ""}`}
          >
            Nhiệm Vụ
          </button>
        )}

        <button
          onClick={() => setActiveTab("planets")}
          className={`py-1 px-2 rounded-md ${activeTab === "planets" ? "text-[#3478F6] bg-blue-50" : ""}`}
        >
          Hành Tinh
        </button>

        <button
          onClick={() => setActiveTab("games")}
          className={`py-1 px-2 rounded-md ${activeTab === "games" ? "text-[#FF6B9C] bg-pink-50" : ""}`}
        >
          Trò Chơi
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`py-1 px-2 rounded-md ${activeTab === "resources" ? "text-[#3478F6] bg-blue-50" : ""}`}
        >
          Mục Lục SGK
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`py-1 px-2 rounded-md ${activeTab === "leaderboard" ? "text-amber-600 bg-amber-50" : ""}`}
        >
          Bảng Vàng
        </button>
      </div>
    </header>
  );
};
