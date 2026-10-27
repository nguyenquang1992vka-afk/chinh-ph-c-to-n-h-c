import React, { useState } from "react";
import { Bot, X, Send, Volume2, Sparkles, HelpCircle, Lightbulb, MessageCircle } from "lucide-react";
import { APP_IMAGES } from "../../data/assets";
import { speakVietnamese, stopSpeaking } from "../../utils/audio";
import { useApp } from "../../context/AppContext";

interface Props {
  currentQuestion?: any;
  isExamMode?: boolean;
  hasAnswered?: boolean;
}

export const SaoSangRobot: React.FC<Props> = ({
  currentQuestion,
  isExamMode = false,
  hasAnswered = false,
}) => {
  const { robotOpen, setRobotOpen, selectedGrade } = useApp();
  const [messages, setMessages] = useState<Array<{ sender: "user" | "robot"; text: string }>>([
    {
      sender: "robot",
      text: "Xin chào bạn nhỏ! Mình là Robot Sao Sáng AI. Em hãy đọc kĩ đề bài và chọn phương án trả lời nhé. Sau khi em trả lời xong, Sao Sáng sẽ lập tức hướng dẫn cách làm chi tiết và phân tích từng bước cho em!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintStage, setHintStage] = useState(1);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || loading) return;

    // Check if user is asking for hints or how to solve before answering
    if (currentQuestion && !hasAnswered) {
      const waitMsg = "Em hãy tự tin chọn một đáp án (A, B, C hoặc D) trên màn hình trước đã nhé! Ngay khi em chọn xong, Sao Sáng sẽ mở khóa gợi ý tư duy và hướng dẫn cách làm chi tiết cho em!";
      setMessages((prev) => [
        ...prev,
        { sender: "user" as const, text },
        { sender: "robot" as const, text: waitMsg },
      ]);
      if (!textToSend) setInputVal("");
      speakVietnamese(waitMsg);
      return;
    }

    const userMsg = { sender: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/robot-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentMessage: text,
          currentQuestion,
          grade: selectedGrade,
          isExamMode,
          hintStage,
          hasAnswered,
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Sao Sáng luôn bên cạnh em, hãy bình tĩnh suy nghĩ và tính toán cẩn thận nhé!";
      setMessages((prev) => [...prev, { sender: "robot", text: reply }]);
      speakVietnamese(reply);
      setHintStage((prev) => prev + 1);
    } catch {
      const fallback = "Sao Sáng đang suy nghĩ cùng em! Em hãy kiểm tra lại từng bước tính toán theo hướng dẫn nhé!";
      setMessages((prev) => [...prev, { sender: "robot", text: fallback }]);
      speakVietnamese(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleReadQuestion = () => {
    if (!currentQuestion) {
      speakVietnamese("Hiện tại chưa có câu hỏi nào được chọn, em hãy vào một hành tinh luyện tập nhé!");
      return;
    }
    const readText = `Câu hỏi: ${currentQuestion.questionText}. Phương án A: ${currentQuestion.options[0]}. Phương án B: ${currentQuestion.options[1]}. Phương án C: ${currentQuestion.options[2]}. Phương án D: ${currentQuestion.options[3]}. Em hãy chọn đáp án đúng nhé!`;
    speakVietnamese(readText);
  };

  return (
    <>
      {/* Floating Mascot Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!robotOpen && (
          <div className="mb-2 bg-white/95 text-slate-800 text-xs py-1.5 px-3 rounded-2xl shadow-md border border-amber-200 animate-gentle-float flex items-center gap-1.5 pointer-events-none select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC83D]" />
            <span className="font-bold">Sao Sáng AI sẵn sàng giúp em!</span>
          </div>
        )}

        <button
          onClick={() => setRobotOpen(!robotOpen)}
          className="relative group p-1 bg-gradient-to-tr from-[#3478F6] via-[#8957F6] to-[#FF6B9C] rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform"
          aria-label="Mở Robot Trợ Lí Sao Sáng AI"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-white">
            <img
              src={APP_IMAGES.mascot}
              alt="Robot Sao Sáng AI"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* Robot Dialog Modal */}
      {robotOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-92 sm:w-96 max-h-[520px] bg-[#FFFDF7] rounded-3xl shadow-2xl border-2 border-[#8957F6]/40 flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3478F6] to-[#8957F6] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white">
                <img
                  src={APP_IMAGES.mascot}
                  alt="Sao Sáng"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Robot Sao Sáng AI</h3>
                <p className="text-[11px] text-white/80">Gia sư Toán Tiểu Học GDPT 2018</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stopSpeaking()}
                title="Dừng đọc âm thanh"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRobotOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-purple-50/80 px-3 py-2 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap">
            {currentQuestion && (
              <button
                onClick={handleReadQuestion}
                className="px-2.5 py-1 bg-white rounded-full text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3 text-[#3478F6]" />
                Đọc câu hỏi
              </button>
            )}
            <button
              onClick={() => handleSendMessage("Cho em gợi ý bước 1 để giải bài này ạ!")}
              className="px-2.5 py-1 bg-white rounded-full text-slate-700 font-medium hover:bg-amber-50 hover:text-amber-800 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Gợi ý tư duy
            </button>
            <button
              onClick={() => handleSendMessage("Nhắc lại công thức và quy tắc toán này giúp em với!")}
              className="px-2.5 py-1 bg-white rounded-full text-slate-700 font-medium hover:bg-purple-50 hover:text-purple-800 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-[#8957F6]" />
              Nhắc công thức
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[300px] text-sm bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "robot" && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mt-1 border border-purple-200">
                    <img src={APP_IMAGES.mascot} alt="bot" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#3478F6] text-white rounded-tr-xs shadow-xs"
                      : "bg-white text-slate-800 rounded-tl-xs shadow-xs border border-slate-200"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.sender === "robot" && (
                    <button
                      onClick={() => speakVietnamese(m.text)}
                      className="mt-1 text-[11px] text-[#3478F6] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3 h-3" /> Nghe đọc
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                <Sparkles className="w-4 h-4 text-[#8957F6] animate-spin" />
                Sao Sáng đang phân tích và chuẩn bị lời khuyên...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Hỏi Sao Sáng bất kì điều gì về bài toán..."
              className="flex-1 text-sm px-3 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8957F6]/50 border border-slate-200"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputVal.trim() || loading}
              className="p-2.5 bg-[#8957F6] text-white rounded-xl hover:bg-[#7844eb] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
