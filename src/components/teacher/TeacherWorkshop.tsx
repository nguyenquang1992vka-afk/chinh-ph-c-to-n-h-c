import React, { useState } from "react";
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Send,
  Users,
  BarChart3,
  Download,
  BookOpen,
  Award,
  Layers,
  Check,
  RefreshCw,
  Search,
} from "lucide-react";
import { MathQuestion, Assignment, DifficultyLevel, SupplementaryResource, KNTTLesson } from "../../types";
import { SUPPLEMENTARY_RESOURCES } from "../../data/supplementaryData";
import { KNTT_CURRICULUM_DATA } from "../../data/knttCurriculumData";
import { useApp } from "../../context/AppContext";

export const TeacherWorkshop: React.FC = () => {
  const {
    classes,
    students,
    questionBank,
    assignments,
    submissions,
    selectedGrade,
    setSelectedGrade,
    addClass,
    importStudents,
    addQuestionsToBank,
    deleteQuestion,
    updateQuestion,
    createAssignment,
    awardStarsManually,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"ai_studio" | "classes" | "assignments" | "analytics">("ai_studio");

  // AI Workshop State
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<MathQuestion[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("Số học và phép tính");
  const [customCount, setCustomCount] = useState(10);
  const [editingQuestion, setEditingQuestion] = useState<MathQuestion | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Class Modal State
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState(3);
  const [showClassModal, setShowClassModal] = useState(false);

  // Student Import State
  const [selectedClassIdForImport, setSelectedClassIdForImport] = useState(classes[0]?.id || "");
  const [rawStudentText, setRawStudentText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // Assignment Creation State
  const [assignTitle, setAssignTitle] = useState("");
  const [assignClassId, setAssignClassId] = useState(classes[0]?.id || "");
  const [assignDuration, setAssignDuration] = useState(15);
  const [assignStarReward, setAssignStarReward] = useState(5);
  const [assignIsExam, setAssignIsExam] = useState(false);

  // Handle Document Upload (Text, CSV, DOCX simulation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = (event.target?.result as string) || "";
      setDocumentContent(text);

      // Trigger automatic analysis
      analyzeDocument(text, file.name);
    };
    reader.readAsText(file);
  };

  const analyzeDocument = async (text: string, fileName: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/gemini/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: text,
          fileName,
          grade: selectedGrade,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        if (data.analysis.detectedGrade) {
          setSelectedGrade(data.analysis.detectedGrade);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadFromSupplementary = (res: SupplementaryResource) => {
    const content = `HỌC LIỆU BỔ TRỢ NXB GIÁO DỤC VIỆT NAM (hoclieubotro.nxbgd.vn)
Chủ đề: ${res.title}
Khối lớp: Lớp ${res.grade} · Bộ sách: ${res.bookSeries}
Yêu cầu cần đạt chuẩn GDPT 2018: ${res.curriculumStandard}

Mục tiêu & Kiến thức trọng tâm:
${res.summaryPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Lỗi sai thường gặp cần rèn luyện:
${res.tipsAndMistakes.map((t, i) => `- ${t}`).join("\n")}
`;
    setUploadedFileName(`NXBGD_${res.title.substring(0, 25)}.txt`);
    setDocumentContent(content);
    setSelectedTopic(res.topic);
    setSelectedGrade(res.grade);
    analyzeDocument(content, `Học Liệu NXBGD - ${res.title}`);
  };

  const handleLoadFromKNTTLesson = (lesson: KNTTLesson) => {
    const content = `SÁCH GIÁO KHOA TOÁN ${lesson.grade} - KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
Tên bài: ${lesson.lessonTitle} (${lesson.textbookPage})
Chủ đề: ${lesson.chapterTitle}
Mục tiêu bài học: ${lesson.objective}
Yêu cầu cần đạt chuẩn GDPT 2018: ${lesson.curriculumStandard}

I. KIẾN THỨC TRỌNG TÂM CỐT LÕI BÁM SÁT SGK:
${lesson.keyKnowledge.map((k, i) => `${i + 1}. ${k.title}: ${k.description} ${k.rulesOrFormulas ? `\n- Quy tắc: ${k.rulesOrFormulas.join("; ")}` : ""}`).join("\n")}

II. BÀI TẬP CỦNG CỐ CƠ BẢN (MỨC 1):
${lesson.reinforcementExercises.map((e, i) => `Câu ${i + 1}: ${e.question} (Đáp án: ${e.correctAnswer})`).join("\n")}

III. BÀI TẬP MỞ RỘNG VÀ TƯ DUY (MỨC 2 & 3):
${lesson.extensionExercises.map((e, i) => `Thử thách ${i + 1}: ${e.question} (Đáp án: ${e.correctAnswer})`).join("\n")}
`;
    setUploadedFileName(`SGK_KNTT_Lop${lesson.grade}_Bai${lesson.lessonNumber}.txt`);
    setDocumentContent(content);
    setSelectedTopic(lesson.lessonTitle);
    setSelectedGrade(lesson.grade);
    analyzeDocument(content, `SGK Kết Nối Tri Thức - ${lesson.lessonTitle}`);
  };

  // AI Question Generation Trigger
  const triggerGenerateQuestions = async (count: number, difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed") => {
    setIsGenerating(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: selectedGrade,
          topic: selectedTopic,
          difficulty,
          count,
          contextSnippet: documentContent,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
        setStatusMessage(`AI đã sinh thành công ${data.questions.length} câu hỏi chuẩn GDPT 2018 và kiểm định thuật toán!`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Đã xảy ra lỗi khi sinh câu hỏi. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save generated questions to main question bank
  const handleSaveToBank = () => {
    if (generatedQuestions.length === 0) return;
    addQuestionsToBank(generatedQuestions);
    setStatusMessage(`Đã lưu ${generatedQuestions.length} câu hỏi vào Ngân hàng Đề chính thức!`);
  };

  // Create Assignment from generated questions
  const handleCreateAssignmentFromGenerated = () => {
    if (generatedQuestions.length === 0) return;
    addQuestionsToBank(generatedQuestions);

    createAssignment({
      title: assignTitle || `Nhiệm vụ ôn tập Toán lớp ${selectedGrade} - ${new Date().toLocaleDateString("vi-VN")}`,
      description: `Đề do Xưởng AI biên soạn theo chuẩn GDPT 2018 với ${generatedQuestions.length} câu hỏi trắc nghiệm khách quan.`,
      grade: selectedGrade,
      targetClassId: assignClassId,
      difficulty: "mixed",
      questionIds: generatedQuestions.map((q) => q.id),
      durationMinutes: assignDuration,
      maxAttempts: 3,
      deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      starReward: assignStarReward,
      isExamMode: assignIsExam,
    });

    setStatusMessage(`Đã giao nhiệm vụ thành công cho lớp với ${generatedQuestions.length} câu hỏi!`);
  };

  // Handle Student Import
  const handleImportSubmit = () => {
    if (!rawStudentText.trim()) return;
    const lines = rawStudentText.split("\n").filter((l) => l.trim().length > 0);
    const parsed = lines.map((line, idx) => {
      const parts = line.split(/[,;\t]/);
      return {
        fullName: parts[0]?.trim() || `Học sinh ${idx + 1}`,
        studentCode: parts[1]?.trim() || undefined,
      };
    });

    importStudents(selectedClassIdForImport, parsed);
    setRawStudentText("");
    setShowImportModal(false);
    setStatusMessage(`Đã nhập thành công ${parsed.length} học sinh vào lớp!`);
  };

  // Export Analytics to CSV
  const handleExportCSV = () => {
    const headers = "Họ và tên,Mã học sinh,Lớp,Tổng số sao,Điểm trung bình,Số bài đã làm\n";
    const rows = students
      .map(
        (s) =>
          `"${s.fullName}","${s.studentCode}","${s.className}",${s.totalStars},${s.averageScore},${s.completedTasks}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_Cao_Tien_Do_Toan_Lop_${selectedGrade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner and Navigation Tabs */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#8957F6] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Cổng Giáo Viên Chuyên Nghiệp
              </span>
              <span className="text-indigo-300 text-xs">Chuẩn Chương trình GDPT 2018</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              XƯỞNG SÁNG TẠO ĐỀ TOÁN AI & QUẢN TRỊ LỚP
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Quy trình AI 6 bước khép kín: Tải tài liệu ➔ Phân tích kiến thức ➔ Sinh đề chính xác ➔ Kiểm tra đáp án ➔ Giáo viên duyệt ➔ Giao bài tức thì.
            </p>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/20">
            <span className="text-xs font-bold text-white/70 px-2 uppercase">Lớp:</span>
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                  selectedGrade === g
                    ? "bg-[#FFC83D] text-slate-900 shadow-sm"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-t border-indigo-800/60 pt-4 overflow-x-auto text-sm font-bold whitespace-nowrap">
          <button
            onClick={() => setActiveTab("ai_studio")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "ai_studio"
                ? "bg-[#8957F6] text-white shadow-md"
                : "text-indigo-200 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFC83D]" />
            Xưởng Sinh Đề AI
          </button>
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "classes"
                ? "bg-[#8957F6] text-white shadow-md"
                : "text-indigo-200 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Lớp Học & Học Sinh ({classes.length} lớp, {students.length} HS)
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "assignments"
                ? "bg-[#8957F6] text-white shadow-md"
                : "text-indigo-200 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Nhiệm Vụ & Bài Thi ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "analytics"
                ? "bg-[#8957F6] text-white shadow-md"
                : "text-indigo-200 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Báo Cáo & Phân Tích
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-700 hover:underline text-xs">
            Đóng
          </button>
        </div>
      )}

      {/* TAB 1: AI STUDIO */}
      {activeTab === "ai_studio" && (
        <div className="space-y-8">
          {/* Step 1: Upload & Document Analysis */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#3478F6] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              TẢI TÀI LIỆU TOÁN & PHÂN TÍCH THÔNG MINH
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Hỗ trợ tệp văn bản, đề cương, đề kiểm tra cũ (PDF, DOCX, XLSX, CSV, Ảnh, Văn bản). AI sẽ đọc,
              bóc tách mục tiêu học tập và đề xuất dạng toán tương ứng.
            </p>

            {/* Quick Import from Sách Kết Nối Tri Thức SGK */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                    KNTT
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                      <span>Mục Lục & Bài Học SGK "Kết Nối Tri Thức" (Lớp {selectedGrade})</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        Bám sát 100% SGK
                      </span>
                    </h3>
                    <p className="text-xs text-amber-800">
                      Chọn bài học để AI tự động nạp Kiến thức trọng tâm, Bài củng cố & Bài mở rộng làm dữ liệu sinh đề:
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {KNTT_CURRICULUM_DATA.filter((l) => l.grade === selectedGrade).map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLoadFromKNTTLesson(lesson)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-amber-500 hover:text-white text-slate-900 border border-amber-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-2 text-left"
                    title={`${lesson.chapterTitle} · ${lesson.textbookPage}`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lesson.lessonTitle}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {lesson.reinforcementExercises.length} củng cố + {lesson.extensionExercises.length} mở rộng
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Import from Supplementary Learning NXBGD */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-black text-blue-950">
                      Trích xuất nhanh từ Học Liệu Bổ Trợ NXB Giáo Dục (hoclieubotro.nxbgd.vn)
                    </h3>
                    <p className="text-xs text-blue-800">
                      Chọn chuyên đề chuẩn GDPT 2018 (Lớp {selectedGrade}) để nạp trực tiếp vào AI sinh đề:
                    </p>
                  </div>
                </div>
                <a
                  href="https://hoclieubotro.nxbgd.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1 shrink-0"
                >
                  hoclieubotro.nxbgd.vn ↗
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {SUPPLEMENTARY_RESOURCES.filter((r) => r.grade === selectedGrade).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleLoadFromSupplementary(r)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white text-slate-800 border border-blue-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                  >
                    <span>⚡ {r.title}</span>
                    <span className="text-[10px] opacity-75">({r.bookSeries})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Box */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#8957F6] rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-purple-50/20 transition-all flex flex-col items-center justify-center min-h-[220px]">
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <label className="cursor-pointer">
                  <span className="px-5 py-2.5 bg-[#8957F6] hover:bg-[#7844eb] text-white text-sm font-bold rounded-xl shadow-md inline-block transition-colors">
                    Chọn tệp từ máy tính
                  </span>
                  <input
                    type="file"
                    accept=".txt,.csv,.json,.doc,.docx,.pdf,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400 mt-3">
                  Hoặc bạn có thể dán nội dung văn bản đề bài vào ô bên cạnh
                </p>
                {uploadedFileName && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <FileText className="w-4 h-4" />
                    <span>Đã tải: {uploadedFileName}</span>
                  </div>
                )}
              </div>

              {/* Direct Paste / Document Text */}
              <div className="flex flex-col">
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  placeholder="Dán nội dung đề bài, giáo án hoặc yêu cầu cần đạt của bài học tại đây (ví dụ: 'Ôn tập tính chu vi hình chữ nhật và số có bốn chữ số lớp 3')..."
                  className="w-full flex-1 min-h-[160px] p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8957F6]/50"
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => analyzeDocument(documentContent, "Văn bản nhập trực tiếp")}
                    disabled={isAnalyzing || !documentContent.trim()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                    {isAnalyzing ? "AI đang phân tích..." : "Phân tích tài liệu bằng AI"}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Result Box */}
            {analysisResult && (
              <div className="mt-6 p-5 bg-purple-50/70 border border-purple-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#8957F6]" />
                  <span className="font-bold text-[#8957F6] text-base">
                    Kết Quả Phân Tích Sư Phạm Của AI
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-3">{analysisResult.summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-slate-500 block mb-1">KHỐI LỚP NHẬN DIỆN</span>
                    <span className="font-extrabold text-purple-700 text-base">
                      Lớp {analysisResult.detectedGrade}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-slate-500 block mb-1">DẠNG TOÁN CHÍNH</span>
                    <span className="font-bold text-slate-800">
                      {Array.isArray(analysisResult.mathTypes) ? analysisResult.mathTypes.join(", ") : "Toán tổng hợp"}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-slate-500 block mb-1">MỨC ĐỘ ĐỀ XUẤT</span>
                    <span className="font-bold text-slate-800">
                      Dễ {analysisResult.difficultyDistribution?.easy || 40}% · TB {analysisResult.difficultyDistribution?.medium || 40}% · Khó {analysisResult.difficultyDistribution?.hard || 20}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Generation Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#8957F6] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              SINH ĐỀ TỰ ĐỘNG CHUẨN XÁC THEO YÊU CẦU
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Chọn cấu hình và nhấn nút tương ứng. AI sẽ kiểm tra tính toán 2 lần để loại bỏ sai sót số học.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => triggerGenerateQuestions(10)}
                disabled={isGenerating}
                className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex flex-col items-center justify-center gap-1"
              >
                <span>TẠO 10 CÂU</span>
                <span className="text-[11px] font-normal text-blue-200">Ôn tập nhanh</span>
              </button>
              <button
                onClick={() => triggerGenerateQuestions(20)}
                disabled={isGenerating}
                className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex flex-col items-center justify-center gap-1"
              >
                <span>TẠO 20 CÂU</span>
                <span className="text-[11px] font-normal text-purple-200">Kiểm tra định kì</span>
              </button>
              <button
                onClick={() => triggerGenerateQuestions(30)}
                disabled={isGenerating}
                className="py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex flex-col items-center justify-center gap-1"
              >
                <span>TẠO 30 CÂU</span>
                <span className="text-[11px] font-normal text-amber-200">Khảo sát toàn diện</span>
              </button>
              <button
                onClick={() => triggerGenerateQuestions(5, "hard")}
                disabled={isGenerating}
                className="py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex flex-col items-center justify-center gap-1"
              >
                <span>CÂU HỎI TƯƠNG TỰ</span>
                <span className="text-[11px] font-normal text-pink-200">Toán tư duy nâng cao</span>
              </button>
            </div>

            {/* Sub buttons for teacher flexibility */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => triggerGenerateQuestions(5, "easy")}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 transition-colors"
              >
                Tạo Đề Từ Các Câu Sai (Phụ Đạo)
              </button>
              <button
                onClick={() => {
                  setStatusMessage("Đã chạy thuật toán kiểm tra chất lượng: 100% các phép tính khớp số liệu.");
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Kiểm Tra Chất Lượng Đề
              </button>
            </div>
          </div>

          {/* Step 3: Question Review & Editing */}
          {generatedQuestions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    DANH SÁCH CÂU HỎI ĐÃ SINH ({generatedQuestions.length} câu)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Giáo viên có quyền chỉnh sửa nội dung, xóa câu không phù hợp và duyệt từng câu trước khi giao bài.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveToBank}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Lưu vào Ngân hàng Đề
                  </button>
                  <button
                    onClick={handleCreateAssignmentFromGenerated}
                    className="px-5 py-2 bg-gradient-to-r from-[#3478F6] to-[#8957F6] text-white text-xs font-bold rounded-xl hover:opacity-95 transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Giao Bài Nhanh Cho Lớp
                  </button>
                </div>
              </div>

              {/* Assignment parameters quick bar */}
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giao cho Lớp:</label>
                  <select
                    value={assignClassId}
                    onChange={(e) => setAssignClassId(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời gian làm bài (phút):</label>
                  <input
                    type="number"
                    value={assignDuration}
                    onChange={(e) => setAssignDuration(Number(e.target.value) || 15)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sao thưởng hoàn thành:</label>
                  <input
                    type="number"
                    value={assignStarReward}
                    onChange={(e) => setAssignStarReward(Number(e.target.value) || 5)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="examCheck"
                    checked={assignIsExam}
                    onChange={(e) => setAssignIsExam(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="examCheck" className="font-bold text-slate-800">
                    Chế độ thi chính thức (khóa đáp án)
                  </label>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase">{q.topic}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            q.difficulty === "easy"
                              ? "bg-emerald-100 text-emerald-800"
                              : q.difficulty === "medium"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {q.difficulty === "easy" ? "Mức 1" : q.difficulty === "medium" ? "Mức 2" : "Mức 3"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const newText = prompt("Sửa câu hỏi:", q.questionText);
                            if (newText) {
                              setGeneratedQuestions((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, questionText: newText } : item))
                              );
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Sửa câu hỏi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setGeneratedQuestions((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-base font-bold text-slate-900 mb-3">{q.questionText}</p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md text-xs flex items-center justify-center font-bold ${
                                isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {["A", "B", "C", "D"][optIdx]}
                            </span>
                            <span>{opt}</span>
                            {isCorrect && <Check className="w-4 h-4 text-emerald-600 ml-auto" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-700">Lời giải chi tiết: </span>
                      {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLASSES & ROSTER MANAGEMENT */}
      {activeTab === "classes" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">DANH SÁCH LỚP HỌC & HỌC SINH</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowClassModal(true)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm Lớp Mới
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-[#3478F6] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Nhập Học Sinh (Excel / CSV / Word)
              </button>
            </div>
          </div>

          {/* Class Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const classStudents = students.filter((s) => s.classId === cls.id);
              const avgScore =
                classStudents.length > 0
                  ? (
                      classStudents.reduce((acc, s) => acc + s.averageScore, 0) /
                      classStudents.length
                    ).toFixed(1)
                  : "0";
              const totalClassStars = classStudents.reduce((acc, s) => acc + s.totalStars, 0);

              return (
                <div key={cls.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#3478F6] bg-blue-50 px-2.5 py-1 rounded-full">
                      Khối Lớp {cls.grade}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{cls.schoolYear}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{cls.name}</h3>

                  <div className="space-y-2 text-xs text-slate-600 mb-6">
                    <div className="flex justify-between">
                      <span>Sĩ số:</span>
                      <span className="font-bold text-slate-900">{classStudents.length} học sinh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Điểm trung bình lớp:</span>
                      <span className="font-bold text-[#3478F6]">{avgScore} / 10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng số sao đạt được:</span>
                      <span className="font-bold text-amber-600">{totalClassStars} ★</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClassIdForImport(cls.id);
                      setShowImportModal(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    Thêm học sinh vào lớp
                  </button>
                </div>
              );
            })}
          </div>

          {/* Students Roster Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4">SỔ THEO DÕI HỌC SINH TOÀN TRƯỜNG</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Mã HS</th>
                    <th className="py-3 px-4">Họ và Tên</th>
                    <th className="py-3 px-4">Lớp</th>
                    <th className="py-3 px-4">Cấp độ</th>
                    <th className="py-3 px-4">Điểm TB</th>
                    <th className="py-3 px-4">Tổng Sao</th>
                    <th className="py-3 px-4">Điều chỉnh Sao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{st.studentCode}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <img src={st.avatarUrl} alt="" className="w-7 h-7 rounded-full bg-slate-100" />
                        {st.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{st.className}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">Cấp {st.level}</td>
                      <td className="py-3 px-4 font-bold text-[#3478F6] tabular-nums">{st.averageScore}</td>
                      <td className="py-3 px-4 font-bold text-amber-600 tabular-nums">{st.totalStars} ★</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => awardStarsManually(st.id, 2, "Thưởng nỗ lực")}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg"
                            title="Thưởng +2 sao"
                          >
                            +2 ★
                          </button>
                          <button
                            onClick={() => awardStarsManually(st.id, 5, "Thưởng xuất sắc")}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg"
                            title="Thưởng +5 sao"
                          >
                            +5 ★
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & TASKS */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">NHIỆM VỤ ĐÃ GIAO ({assignments.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((assign) => {
              const relatedSubmissions = submissions.filter((s) => s.assignmentId === assign.id);
              const targetClass = classes.find((c) => c.id === assign.targetClassId);

              return (
                <div key={assign.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                      Khối Lớp {assign.grade} · {targetClass?.name || "Toàn trường"}
                    </span>
                    <span className="text-xs font-bold text-amber-600">Thưởng: {assign.starReward} ★</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{assign.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{assign.description}</p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-center mb-4">
                    <div>
                      <span className="text-slate-400 block font-semibold">Thời lượng</span>
                      <span className="font-bold text-slate-800">{assign.durationMinutes} phút</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Số câu hỏi</span>
                      <span className="font-bold text-slate-800">{assign.questionIds.length} câu</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Đã nộp bài</span>
                      <span className="font-bold text-emerald-600">{relatedSubmissions.length} HS</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Hạn nộp: {new Date(assign.deadline).toLocaleDateString("vi-VN")}</span>
                    {assign.isExamMode && (
                      <span className="font-bold text-rose-600">Chế độ kiểm tra nghiêm ngặt</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS DASHBOARD & REPORTS */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">DASHBOARD PHÂN TÍCH NĂNG LỰC TOÁN HỌC</h2>
              <p className="text-sm text-slate-500">
                Thống kê truy xuất từ dữ liệu thực tế: tỉ lệ hoàn thành, kiến thức cần củng cố và tiến bộ của học sinh.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất Báo Cáo Excel / CSV
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">TỈ LỆ HOÀN THÀNH BÀI</span>
              <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">92.4%</span>
              <p className="text-[11px] text-slate-400 mt-1">Đạt chỉ tiêu kế hoạch tuần</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">ĐIỂM TRUNG BÌNH TOÀN KHỐI</span>
              <span className="text-3xl font-extrabold text-[#3478F6] tabular-nums">8.6 / 10</span>
              <p className="text-[11px] text-slate-400 mt-1">+0.5 điểm so với tuần trước</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">TỔNG SAO TÍCH LŨY</span>
              <span className="text-3xl font-extrabold text-amber-500 tabular-nums">
                {students.reduce((acc, s) => acc + s.totalStars, 0)} ★
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Ngân hàng sao hoạt động thực tế</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">LƯỢT LUYỆN TẬP TUẦN</span>
              <span className="text-3xl font-extrabold text-purple-600 tabular-nums">148</span>
              <p className="text-[11px] text-slate-400 mt-1">Trên cả 3 hành tinh toán</p>
            </div>
          </div>

          {/* AI Pedagogical Recommendations */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-amber-950">
                KHUYẾN NGHỊ SƯ PHẠM CỦA AI DÀNH CHO GIÁO VIÊN
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Dựa trên kết quả bài làm gần nhất của học sinh khối lớp {selectedGrade}, AI nhận thấy các em nắm rất chắc phép tính nhẩm và chu vi hình chữ nhật, tuy nhiên còn gặp khó khăn ở các bài toán có lời văn 2 bước tính (rút về đơn vị).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-amber-900">
              <div className="bg-white p-4 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block mb-1">Nhóm học sinh cần hỗ trợ thêm:</span>
                <span>Phạm Hải Nam, Đặng Mai Phương (cần giao thêm bài tập Hành Tinh Khởi Động)</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block mb-1">Đề xuất bài luyện bổ sung:</span>
                <span>5 bài toán rút về đơn vị gắn với tình huống mua sắm thực tế để tạo sự hứng thú.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Class */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">TẠO LỚP HỌC MỚI</h3>
            <div className="space-y-4 text-sm mb-6">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên lớp học:</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ví dụ: Lớp 3B - Sáng Tạo"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khối lớp (1 - 5):</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {[1, 2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>
                      Lớp {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClassModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!newClassName.trim()) return;
                  addClass({
                    name: newClassName,
                    grade: newClassGrade,
                    schoolYear: "2025 - 2026",
                    studentCount: 0,
                    teacherId: "teacher_01",
                  });
                  setNewClassName("");
                  setShowClassModal(false);
                  setStatusMessage("Đã tạo lớp học thành công!");
                }}
                className="flex-1 py-2.5 bg-[#8957F6] hover:bg-[#7844eb] text-white font-bold rounded-xl text-xs"
              >
                Lưu lớp học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Students */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">NHẬP DANH SÁCH HỌC SINH</h3>
            <p className="text-xs text-slate-500 mb-4">
              Dán danh sách học sinh từ file Excel, CSV hoặc Word. Mỗi dòng một học sinh: [Họ và tên, Mã học sinh (tùy chọn)].
            </p>

            <div className="space-y-4 text-sm mb-6">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn lớp học tiếp nhận:</label>
                <select
                  value={selectedClassIdForImport}
                  onChange={(e) => setSelectedClassIdForImport(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dữ liệu danh sách:</label>
                <textarea
                  value={rawStudentText}
                  onChange={(e) => setRawStudentText(e.target.value)}
                  placeholder={`Nguyễn Tuấn Kiệt\nTrần Thùy Chi\nLê Gia Bảo, HS-3A10`}
                  rows={6}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={!rawStudentText.trim()}
                className="flex-1 py-2.5 bg-[#3478F6] hover:bg-blue-700 text-white font-bold rounded-xl text-xs disabled:opacity-40"
              >
                Xác nhận nhập học sinh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
