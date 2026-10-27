import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { AuthGateway } from "./components/auth/AuthGateway";
import { HomeView } from "./components/home/HomeView";
import { PlanetsView } from "./components/planets/PlanetsView";
import { TeacherWorkshop } from "./components/teacher/TeacherWorkshop";
import { StudentPortalView } from "./components/student/StudentPortalView";
import { MathGamesHub } from "./components/games/MathGamesHub";
import { StarLeaderboard } from "./components/leaderboard/StarLeaderboard";
import { SupplementaryLearningHub } from "./components/resources/SupplementaryLearningHub";
import { SaoSangRobot } from "./components/assistant/SaoSangRobot";
import { Star, ShieldCheck, Heart } from "lucide-react";

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, role } = useApp();

  // 1. Unauthenticated Gateway: Mandatory first screen
  if (!isAuthenticated) {
    return <AuthGateway />;
  }

  // 2. Strict RBAC protection: Students cannot enter Teacher Workshop
  const isWorkshopAllowed = role === "teacher";
  const currentTab =
    (activeTab === "workshop" && !isWorkshopAllowed) || activeTab === "competition"
      ? "home"
      : activeTab;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-slate-800">
      <Header />

      <main className="flex-1">
        {currentTab === "home" && <HomeView />}
        {currentTab === "planets" && <PlanetsView />}
        {currentTab === "workshop" && isWorkshopAllowed && <TeacherWorkshop />}
        {currentTab === "student_profile" && <StudentPortalView />}
        {currentTab === "resources" && <SupplementaryLearningHub />}
        {currentTab === "games" && <MathGamesHub />}
        {currentTab === "leaderboard" && <StarLeaderboard />}
      </main>

      {/* Global Floating Robot Assistant when not on planets page */}
      {activeTab !== "planets" && <SaoSangRobot />}

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-xl font-black tracking-tight text-white">
                HÀNH TRÌNH TỎA SÁNG
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              CHINH PHỤC TOÁN TIỂU HỌC CÙNG AI · Chuẩn Chương trình Giáo dục Phổ thông 2018 Việt Nam.
            </p>
            <p className="text-xs text-amber-300/90 font-medium">
              "Mỗi bài toán – Một thử thách. Mỗi nhiệm vụ – Một ngôi sao. Mỗi ngày – Một bước tiến."
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-2 text-xs text-slate-400">
            <div className="flex items-center justify-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("resources")}
                className="hover:text-amber-300 transition-colors"
              >
                Học Liệu Bổ Trợ NXBGD
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className="hover:text-amber-300 transition-colors"
              >
                Bảng Vàng Tuần
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab("games")}
                className="hover:text-amber-300 transition-colors"
              >
                Trò Chơi Toán
              </button>
            </div>
            <p className="flex items-center justify-center gap-1">
              Bảo mật dữ liệu học sinh <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> · Thiết kế vì trẻ em Việt Nam
            </p>
            <p className="text-[11px] text-slate-500">
              Bản quyền © 2026 HÀNH TRÌNH TỎA SÁNG EdTech. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
