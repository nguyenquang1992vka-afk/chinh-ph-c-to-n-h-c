import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Bell,
  Sparkles,
  Trophy,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Zap,
  Gift,
  Key,
  Compass,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { playCorrectSound, playIncorrectSound, playStarSound, playFanfareSound } from "../../utils/audio";

interface GameInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  starReward: number;
  color: string;
  icon: string;
}

const GAMES_LIST: GameInfo[] = [
  {
    id: "rung_chuong_vang",
    name: "RUNG CHUÔNG VÀNG",
    category: "Đấu trí thời gian",
    description: "Vượt qua 5 câu hỏi nhanh liên tiếp trong vòng 15 giây mỗi câu để rung chiếc chuông vàng danh giá!",
    starReward: 4,
    color: "#FFC83D",
    icon: "Bell",
  },
  {
    id: "ai_la_trieu_phu",
    name: "AI LÀ TRIỆU PHÚ TOÁN HỌC",
    category: "Thang điểm đỉnh cao",
    description: "Chinh phục các mốc điểm với quyền trợ giúp 50:50 và hỏi ý kiến Robot Sao Sáng AI.",
    starReward: 5,
    color: "#3478F6",
    icon: "Trophy",
  },
  {
    id: "vuot_chuong_ngai_vat",
    name: "VƯỢT CHƯỚNG NGẠI VẬT",
    category: "Phản xạ nhanh",
    description: "Tính nhẩm thần tốc để nhảy qua các rào cản trên đường đua số học kỳ thú.",
    starReward: 3,
    color: "#FF914D",
    icon: "Flame",
  },
  {
    id: "duong_dua_toan_hoc",
    name: "ĐƯỜNG ĐUA TOÁN HỌC",
    category: "Tốc độ đường đua",
    description: "Đua xe cùng hai đối thủ AI máy chủ; trả lời đúng và nhanh để tăng tốc về đích đầu tiên.",
    starReward: 3,
    color: "#8957F6",
    icon: "Zap",
  },
  {
    id: "vong_quay_may_man",
    name: "VÒNG QUAY MAY MẮN",
    category: "Thử vận may sao",
    description: "Giải đúng 2 câu đố để nhận chìa khóa quay vòng quay kim cương tích lũy thêm sao vàng.",
    starReward: 4,
    color: "#20C9B5",
    icon: "Gift",
  },
  {
    id: "ghep_doi_than_toc",
    name: "GHÉP ĐÔI THẦN TỐC",
    category: "Trí nhớ siêu phàm",
    description: "Lật các thẻ bài để tìm cặp ghép tương ứng giữa phép tính và kết quả trong thời gian ngắn nhất.",
    starReward: 3,
    color: "#FF6B9C",
    icon: "Sparkles",
  },
  {
    id: "giai_cuu_ngoi_sao",
    name: "GIẢI CỨU NGÔI SAO",
    category: "Giải mật mã vũ trụ",
    description: "Mở 3 ổ khóa bảo vệ bằng các phép tính tư duy để giải cứu Ngôi Sao Thiên Hà bị mắc kẹt.",
    starReward: 4,
    color: "#3478F6",
    icon: "Key",
  },
  {
    id: "san_kho_bau_tri_thuc",
    name: "SĂN KHO BÁU TRI THỨC",
    category: "Phiêu lưu bản đồ",
    description: "Đi theo bản đồ kho báu qua 3 chặng đố vui toán học để mở hòm kho báu vàng rực rỡ.",
    starReward: 4,
    color: "#FFC83D",
    icon: "Compass",
  },
];

export const MathGamesHub: React.FC = () => {
  const { questionBank, selectedGrade, currentStudent, awardStarsManually } = useApp();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Filter pool questions
  const gamePool = questionBank.filter((q) => q.grade === selectedGrade) || questionBank;

  // Generic Game Session State
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameFinished, setGameFinished] = useState(false);
  const [used5050, setUsed5050] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [racePosition, setRacePosition] = useState(10); // for racing
  const [aiPos1, setAiPos1] = useState(10);
  const [aiPos2, setAiPos2] = useState(10);
  const [wheelDegree, setWheelDegree] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchingCards, setMatchingCards] = useState<Array<{ id: number; text: string; matchId: number; flipped: boolean; matched: boolean }>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Start a specific game
  const startGame = (gameId: string) => {
    setActiveGameId(gameId);
    setRound(0);
    setScore(0);
    setTimeLeft(15);
    setGameFinished(false);
    setUsed5050(false);
    setDisabledOptions([]);
    setRacePosition(10);
    setAiPos1(10);
    setAiPos2(10);

    if (gameId === "ghep_doi_than_toc") {
      initMemoryCards();
    }
  };

  const initMemoryCards = () => {
    const rawPairs = [
      { textA: "4 x 6", textB: "24" },
      { textA: "9 x 5", textB: "45" },
      { textA: "56 : 8", textB: "7" },
      { textA: "100 - 35", textB: "65" },
    ];
    let cardsArr: any[] = [];
    rawPairs.forEach((p, idx) => {
      cardsArr.push({ id: idx * 2, text: p.textA, matchId: idx, flipped: false, matched: false });
      cardsArr.push({ id: idx * 2 + 1, text: p.textB, matchId: idx, flipped: false, matched: false });
    });
    // Shuffle
    cardsArr.sort(() => Math.random() - 0.5);
    setMatchingCards(cardsArr);
    setSelectedCards([]);
  };

  // Timer tick for timed games
  useEffect(() => {
    if (!activeGameId || gameFinished) return;
    if (activeGameId === "rung_chuong_vang" || activeGameId === "vuot_chuong_ngai_vat" || activeGameId === "duong_dua_toan_hoc") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 15;
          }
          return prev - 1;
        });

        // AI cars creeping forward in racing game
        if (activeGameId === "duong_dua_toan_hoc") {
          setAiPos1((p) => Math.min(p + 3, 90));
          setAiPos2((p) => Math.min(p + 2.5, 90));
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeGameId, round, gameFinished]);

  const handleTimeUp = () => {
    playIncorrectSound();
    if (round < 4) {
      setRound((r) => r + 1);
      setTimeLeft(15);
    } else {
      finishGame(score);
    }
  };

  const handleAnswerClick = (optionIdx: number) => {
    const currentQ = gamePool[round % gamePool.length];
    if (!currentQ) return;

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      playCorrectSound();
      const newScore = score + 1;
      setScore(newScore);

      if (activeGameId === "duong_dua_toan_hoc") {
        setRacePosition((p) => Math.min(p + 20, 100));
      }

      if (round < 4) {
        setRound((r) => r + 1);
        setTimeLeft(15);
        setDisabledOptions([]);
      } else {
        finishGame(newScore);
      }
    } else {
      playIncorrectSound();
      if (activeGameId === "ai_la_trieu_phu") {
        // Elimination in Millionaire
        finishGame(score);
      } else {
        if (round < 4) {
          setRound((r) => r + 1);
          setTimeLeft(15);
        } else {
          finishGame(score);
        }
      }
    }
  };

  const handleUse5050 = () => {
    if (used5050) return;
    const currentQ = gamePool[round % gamePool.length];
    if (!currentQ) return;

    const wrongs = [0, 1, 2, 3].filter((idx) => idx !== currentQ.correctIndex);
    const shuffled = wrongs.sort(() => Math.random() - 0.5);
    setDisabledOptions([shuffled[0], shuffled[1]]);
    setUsed5050(true);
  };

  // Lucky wheel spin
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    playStarSound();

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    setWheelDegree((d) => d + randomDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      const earnedBonus = 3;
      awardStarsManually(currentStudent.id, earnedBonus, "Vòng quay may mắn");
      playFanfareSound();
      setGameFinished(true);
    }, 3500);
  };

  // Memory card click
  const handleCardClick = (cardId: number) => {
    if (selectedCards.length === 2) return;
    const card = matchingCards.find((c) => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const updated = matchingCards.map((c) => (c.id === cardId ? { ...c, flipped: true } : c));
    setMatchingCards(updated);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const first = matchingCards.find((c) => c.id === newSelected[0]);
      const second = card;

      if (first && second && first.matchId === second.matchId) {
        playCorrectSound();
        setTimeout(() => {
          setMatchingCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, matched: true } : c))
          );
          setSelectedCards([]);

          // Check if all matched
          const remaining = updated.filter((c) => !c.matched && c.id !== first.id && c.id !== second.id);
          if (remaining.length === 0) {
            finishGame(4);
          }
        }, 500);
      } else {
        playIncorrectSound();
        setTimeout(() => {
          setMatchingCards((prev) =>
            prev.map((c) => (c.id === newSelected[0] || c.id === newSelected[1] ? { ...c, flipped: false } : c))
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const finishGame = (finalScore: number) => {
    setGameFinished(true);
    const currentGame = GAMES_LIST.find((g) => g.id === activeGameId);
    const starsToGive = finalScore >= 3 ? currentGame?.starReward || 2 : 1;
    awardStarsManually(currentStudent.id, starsToGive, `Trò chơi ${currentGame?.name}`);
  };

  const currentQ = gamePool[round % gamePool.length];
  const currentGame = GAMES_LIST.find((g) => g.id === activeGameId);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#FF6B9C] text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase">
              Gamified EdTech 2026
            </span>
            <span className="text-xs text-slate-400">8 trò chơi Toán học tương tác thực tế</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            THẾ GIỚI TRÒ CHƠI TOÁN HỌC TỎA SÁNG
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Mỗi trò chơi được tích hợp câu hỏi thật từ Ngân hàng đề GDPT 2018, giúp rèn phản xạ và nhận sao thưởng thật.
          </p>
        </div>

        {activeGameId && (
          <button
            onClick={() => setActiveGameId(null)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 text-xs font-bold transition-colors"
          >
            ← Trở về danh sách trò chơi
          </button>
        )}
      </div>

      {/* VIEW 1: GAME SELECTION LOBBY */}
      {!activeGameId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {GAMES_LIST.map((game, idx) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-[#3478F6] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Game 0{idx + 1}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    +{game.starReward} Sao
                  </span>
                </div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white font-bold shadow-md"
                  style={{ backgroundColor: game.color }}
                >
                  <Gamepad2 className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3478F6] transition-colors mb-2">
                  {game.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {game.description}
                </p>
              </div>

              <button
                onClick={() => startGame(game.id)}
                className="w-full py-2.5 bg-slate-900 group-hover:bg-[#3478F6] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Chơi Ngay
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: ACTIVE PLAYING ARENA */}
      {activeGameId && currentGame && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden mb-12">
          {/* Game Top HUD */}
          <div
            className="p-6 text-white flex flex-wrap items-center justify-between gap-4"
            style={{ backgroundColor: currentGame.color }}
          >
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
                {currentGame.category}
              </span>
              <h2 className="text-2xl font-black mt-1">{currentGame.name}</h2>
            </div>

            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Điểm: {score} / 5</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
                Thời gian: <span className="tabular-nums font-mono text-base">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* GAME SPECIFIC SCREEN */}
          {!gameFinished ? (
            <div className="p-6 sm:p-10">
              {/* GAME 4: RACING VISUALIZER */}
              {activeGameId === "duong_dua_toan_hoc" && (
                <div className="mb-8 p-4 bg-slate-900 rounded-2xl text-white">
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Đường Đua F1 Toán Học</div>
                  {/* Player Car */}
                  <div className="relative h-9 bg-slate-800 rounded-lg mb-2 overflow-hidden flex items-center px-2">
                    <div
                      className="absolute top-1 bottom-1 bg-blue-500 rounded transition-all duration-300 flex items-center px-2 text-xs font-bold text-white shadow-md"
                      style={{ left: `${racePosition}%`, width: "40px" }}
                    >
                      🏎️ Bạn
                    </div>
                  </div>
                  {/* AI Car 1 */}
                  <div className="relative h-9 bg-slate-800 rounded-lg mb-2 overflow-hidden flex items-center px-2">
                    <div
                      className="absolute top-1 bottom-1 bg-rose-500 rounded transition-all duration-300 flex items-center px-2 text-xs font-bold text-white shadow-md"
                      style={{ left: `${aiPos1}%`, width: "40px" }}
                    >
                      🚗 AI 1
                    </div>
                  </div>
                  {/* AI Car 2 */}
                  <div className="relative h-9 bg-slate-800 rounded-lg overflow-hidden flex items-center px-2">
                    <div
                      className="absolute top-1 bottom-1 bg-amber-500 rounded transition-all duration-300 flex items-center px-2 text-xs font-bold text-white shadow-md"
                      style={{ left: `${aiPos2}%`, width: "40px" }}
                    >
                      🚙 AI 2
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 5: LUCKY WHEEL VISUALIZER */}
              {activeGameId === "vong_quay_may_man" && (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">VÒNG QUAY NGÔI SAO MAY MẮN</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Bấm quay để thử tài vận may và cộng thêm sao vào ngân hàng của em!
                  </p>
                  <div className="relative w-64 h-64 mx-auto mb-6">
                    <div
                      className="w-full h-full rounded-full border-8 border-amber-300 shadow-2xl transition-transform duration-3000 ease-out flex items-center justify-center font-bold text-white"
                      style={{
                        transform: `rotate(${wheelDegree}deg)`,
                        background: "conic-gradient(#FF6B9C 0deg 90deg, #3478F6 90deg 180deg, #FFC83D 180deg 270deg, #8957F6 270deg 360deg)",
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md font-black text-xs">
                        QUAY
                      </div>
                    </div>
                    {/* Arrow pointer */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600"></div>
                  </div>

                  <button
                    onClick={handleSpinWheel}
                    disabled={isSpinning}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl shadow-lg hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {isSpinning ? "Đang quay..." : "BẤM ĐỂ QUAY VÒNG QUAY!"}
                  </button>
                </div>
              )}

              {/* GAME 6: SPEED MATCH MEMORY */}
              {activeGameId === "ghep_doi_than_toc" && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">LẬT THẺ GHÉP PHÉP TÍNH VỚI ĐÁP ÁN</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Tìm các cặp tương ứng (Ví dụ: 4 x 6 ghép với 24)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {matchingCards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        disabled={card.flipped || card.matched}
                        className={`h-28 rounded-2xl font-extrabold text-xl transition-all border-2 flex items-center justify-center shadow-md ${
                          card.matched
                            ? "bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60"
                            : card.flipped
                            ? "bg-blue-600 border-blue-700 text-white"
                            : "bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {card.flipped || card.matched ? card.text : "★"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STANDARD QUESTION GAME PLAY (Rung Chuông Vàng, Triệu Phú, Chướng Ngại Vật, Giải Cứu, Kho Báu) */}
              {activeGameId !== "vong_quay_may_man" && activeGameId !== "ghep_doi_than_toc" && currentQ && (
                <div>
                  {/* Lifelines for Millionaire */}
                  {activeGameId === "ai_la_trieu_phu" && (
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={handleUse5050}
                        disabled={used5050}
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold rounded-xl disabled:opacity-40"
                      >
                        Quyền 50:50 {used5050 ? "(Đã dùng)" : ""}
                      </button>
                      <button
                        onClick={() => {
                          alert(`Gợi ý từ Sao Sáng AI: "Đối với câu hỏi này, em hãy chú ý chữ số hàng đơn vị hoặc công thức tính chu vi nhé!"`);
                        }}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold rounded-xl"
                      >
                        Hỏi Robot Sao Sáng AI
                      </button>
                    </div>
                  )}

                  <div className="mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      VÒNG {round + 1} / 5
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                      {currentQ.questionText}
                    </h3>
                  </div>

                  {/* 4 Clickable Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQ.options.map((opt, optIdx) => {
                      const isDisabled = disabledOptions.includes(optIdx);
                      return (
                        <button
                          key={optIdx}
                          disabled={isDisabled}
                          onClick={() => handleAnswerClick(optIdx)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                            isDisabled
                              ? "opacity-20 border-slate-200 cursor-not-allowed bg-slate-50"
                              : "border-slate-200 hover:border-[#3478F6] hover:bg-blue-50/50"
                          }`}
                        >
                          <span className="w-9 h-9 rounded-xl bg-slate-100 font-bold flex items-center justify-center text-slate-700">
                            {["A", "B", "C", "D"][optIdx]}
                          </span>
                          <span className="text-lg font-bold text-slate-900">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* GAME OVER SCREEN */
            <div className="p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-500 flex items-center justify-center mb-4 shadow-md">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">
                HOÀN THÀNH TRÒ CHƠI TOÁN HỌC!
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Em đã thể hiện phản xạ tính toán và tinh thần học hỏi rất xuất sắc!
              </p>

              <div className="inline-block p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-8">
                <span className="text-xs font-bold text-amber-800 block mb-1">SAO VÀNG ĐÃ NHẬN</span>
                <span className="text-4xl font-black text-amber-600 flex items-center justify-center gap-1">
                  +{currentGame.starReward} <Star className="w-8 h-8 fill-amber-400" />
                </span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => startGame(activeGameId)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                >
                  Chơi Lại Trò Này
                </button>
                <button
                  onClick={() => setActiveGameId(null)}
                  className="px-6 py-2.5 bg-[#3478F6] text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors"
                >
                  Chọn Trò Chơi Khác
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
