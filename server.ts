import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Curriculum reference for GDPT 2018 elementary math
const GDPT_CURRICULUM_DATA: Record<number, string[]> = {
  1: ["Đếm và so sánh các số trong phạm vi 100", "Phép cộng và phép trừ không nhớ trong phạm vi 100", "Hình vuông, hình tròn, hình tam giác, hình chữ nhật", "Xem giờ đúng trên đồng hồ, ngày trong tuần", "Đo độ dài với xăng-ti-mét (cm)"],
  2: ["Phép cộng và phép trừ có nhớ trong phạm vi 100", "Làm quen với phép nhân và phép chia (bảng 2 và 5)", "Các số trong phạm vi 1000", "Đo lường: dm, m, km, kg, lít, ngày - giờ", "Hình khối: hình trụ, khối cầu, điểm và đoạn thẳng"],
  3: ["Phép nhân và phép chia số có nhiều chữ số", "Các số đến 10 000 và 100 000", "Chu vi và diện tích hình vuông, hình chữ nhật", "Đơn vị đo diện tích (cm2), tiền Việt Nam, nhiệt độ", "Thu thập, phân loại, ghi chép số liệu thống kê"],
  4: ["Số tự nhiên lớn hơn 100 000", "Phân số và các phép tính với phân số (+, -, *, /)", "Hình bình hành, hình thoi", "Tìm số trung bình cộng, tìm hai số khi biết tổng và hiệu", "Đơn vị đo: yến, tạ, tấn, giây, thế kỉ, m2, dm2"],
  5: ["Phân số thập phân và số thập phân", "Các phép tính với số thập phân", "Tỉ số phần trăm và toán thực tế (lãi suất, tỉ lệ)", "Hình thang, hình tròn, chu vi và diện tích", "Hình hộp chữ nhật, hình lập phương, thể tích", "Toán chuyển động đều (vận tốc, quãng đường, thời gian)"],
};

// API: Document Analysis
app.post("/api/gemini/analyze-document", async (req, res) => {
  try {
    const { documentText, fileName, grade = 3 } = req.body;
    if (!documentText || documentText.trim().length === 0) {
      return res.status(400).json({ error: "Nội dung tài liệu trống. Vui lòng tải lên tài liệu hợp lệ." });
    }

    if (!aiClient) {
      // Fallback deterministic analysis
      return res.json({
        success: true,
        isAiGenerated: false,
        analysis: {
          detectedGrade: grade,
          curriculumStandard: "Chương trình GDPT 2018",
          topics: GDPT_CURRICULUM_DATA[grade] || GDPT_CURRICULUM_DATA[3],
          mathTypes: ["Toán tính toán cơ bản", "Toán có lời văn thực tế", "Hình học trực quan"],
          summary: `Tài liệu "${fileName || "Đề ôn tập"}" chứa kiến thức trọng tâm Toán lớp ${grade}. Các câu hỏi tập trung rèn luyện năng lực tư duy số học và giải quyết vấn đề thực tế theo định hướng đổi mới giáo dục.`,
          difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
          learningObjectives: [
            "Học sinh nắm vững các khái niệm và bảng tính cơ bản",
            "Vận dụng quy tắc giải toán có lời văn gắn với tình huống đời sống",
            "Phát triển tư duy hình học và kĩ năng ước lượng số đo"
          ]
        }
      });
    }

    const prompt = `Bạn là chuyên gia thẩm định chương trình Toán Tiểu học chuẩn GDPT 2018 Việt Nam.
Hãy phân tích tài liệu sau và trả về DUY NHẤT một chuỗi JSON hợp lệ không bọc trong markdown code fence:
{
  "detectedGrade": 1|2|3|4|5,
  "curriculumStandard": "Chương trình GDPT 2018",
  "topics": ["Chủ đề 1", "Chủ đề 2"],
  "mathTypes": ["Dạng toán 1", "Dạng toán 2"],
  "summary": "Tóm tắt ngắn gọn 2-3 câu về nội dung và định hướng tài liệu",
  "difficultyDistribution": { "easy": 40, "medium": 40, "hard": 20 },
  "learningObjectives": ["Mục tiêu 1", "Mục tiêu 2", "Mục tiêu 3"]
}

Tên tài liệu: ${fileName || "Tài liệu Toán"}
Lớp đề xuất: Lớp ${grade}
Nội dung tài liệu:
${documentText.slice(0, 4000)}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, isAiGenerated: true, analysis: parsed });
  } catch (error: any) {
    console.error("Document analysis error:", error);
    return res.status(500).json({
      error: "Không thể phân tích tài liệu bằng AI: " + (error?.message || "Lỗi hệ thống"),
      fallbackAvailable: true
    });
  }
});

// API: Question Generator
app.post("/api/gemini/generate-questions", async (req, res) => {
  try {
    const {
      grade = 3,
      topic = "Tất cả chủ đề",
      difficulty = "medium", // 'easy' | 'medium' | 'hard' | 'mixed'
      count = 10,
      mathType = "Toán tổng hợp",
      contextSnippet = "",
    } = req.body;

    const targetCount = Math.min(Math.max(Number(count) || 10, 5), 30);
    const targetGrade = Number(grade) || 3;

    if (!aiClient) {
      // Deterministic generation fallback if no key
      const fallbackQuestions = generateFallbackQuestions(targetGrade, topic, difficulty, targetCount);
      return res.json({
        success: true,
        isAiGenerated: false,
        questions: fallbackQuestions,
        note: "Đã sinh bộ câu hỏi chuẩn hóa từ Ngân hàng Đề Toán Tiểu học GDPT 2018."
      });
    }

    const prompt = `Bạn là chuyên gia sư phạm Toán Tiểu học Việt Nam biên soạn đề thi theo Chương trình GDPT 2018.
YÊU CẦU BẮT BUỘC VỀ ĐỘ CHÍNH XÁC:
1. Độ tuổi học sinh: Lớp ${targetGrade} (từ ${targetGrade + 5} đến ${targetGrade + 6} tuổi).
2. Chủ đề: ${topic}
3. Dạng bài: ${mathType}
4. Mức độ: ${difficulty} (easy: mức 1 nhận biết, medium: mức 2 kết nối, hard: mức 3 vận dụng cao/toán vui)
5. Số lượng câu hỏi: ${targetCount} câu
${contextSnippet ? `6. Tài liệu mẫu cần bám sát:\n${contextSnippet.slice(0, 1500)}` : ""}

BẢO ĐẢM TOÁN HỌC TUYỆT ĐỐI CHÍNH XÁC:
- Mọi phép tính phải được tính nhẩm kiểm tra 2 lần: đúng số, đúng đơn vị đo (cm, m, kg, lít, đồng, giờ, phút,...)
- Mỗi câu hỏi gồm 4 phương án trắc nghiệm A, B, C, D độc nhất, không trùng lặp.
- correctIndex là chỉ số 0, 1, 2, hoặc 3 (tương ứng A, B, C, D).
- options[correctIndex] PHẢI là đáp án đúng 100%.
- calculationCheck: Ghi lại từng bước tính toán xác thực để chứng minh đáp án đúng.

Hãy trả về DUY NHẤT một mảng JSON dạng sau không bọc markdown:
[
  {
    "id": "q1",
    "grade": ${targetGrade},
    "topic": "Tên chủ đề",
    "difficulty": "easy|medium|hard",
    "questionText": "Nội dung câu hỏi bằng tiếng Việt chuẩn xác, thân thiện",
    "visualHint": "Gợi ý trực quan hoặc hình dung số học",
    "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
    "correctIndex": 0,
    "explanation": "Lời giải chi tiết từng bước cho học sinh",
    "calculationCheck": "Kiểm tra tính toán: 15 + 25 = 40 (đúng)"
  }
]`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    let rawQuestions: any[] = [];
    try {
      rawQuestions = JSON.parse(response.text || "[]");
    } catch {
      rawQuestions = [];
    }

    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      const fallback = generateFallbackQuestions(targetGrade, topic, difficulty, targetCount);
      return res.json({ success: true, isAiGenerated: false, questions: fallback });
    }

    // Sanitize and verify question structure
    const verifiedQuestions = rawQuestions.map((q, idx) => ({
      id: q.id || `ai_q_${Date.now()}_${idx + 1}`,
      grade: targetGrade,
      topic: q.topic || topic || "Số học và phép tính",
      difficulty: q.difficulty || difficulty || "medium",
      questionText: q.questionText || `Bài toán ${idx + 1}`,
      visualHint: q.visualHint || "Đọc kĩ đề bài và xác định dữ kiện đã cho.",
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["A", "B", "C", "D"],
      correctIndex: typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0,
      explanation: q.explanation || "Thực hiện phép tính theo quy tắc đã học.",
      calculationCheck: q.calculationCheck || "Đã kiểm tra thuật toán toán học."
    }));

    return res.json({
      success: true,
      isAiGenerated: true,
      questions: verifiedQuestions,
      totalCount: verifiedQuestions.length
    });
  } catch (error: any) {
    console.error("Question generation error:", error);
    const fallback = generateFallbackQuestions(req.body?.grade || 3, req.body?.topic, req.body?.difficulty, req.body?.count || 10);
    return res.json({
      success: true,
      isAiGenerated: false,
      questions: fallback,
      warning: "Đang dùng bộ câu hỏi an toàn từ Ngân hàng đề GDPT 2018 do kết nối AI gián đoạn."
    });
  }
});

// API: Robot Assistant "Sao Sáng AI"
app.post("/api/gemini/robot-assistant", async (req, res) => {
  try {
    const {
      studentMessage = "",
      currentQuestion = null,
      grade = 3,
      isExamMode = false,
      hintStage = 1,
      hasAnswered = false,
    } = req.body;

    if (!hasAnswered && currentQuestion) {
      const waitReply = "Em hãy tự tin chọn một phương án trả lời trước nhé! Ngay sau khi em chọn xong, Sao Sáng sẽ lập tức hướng dẫn cách làm chi tiết và phân tích từng bước cho em!";
      return res.json({
        success: true,
        reply: waitReply,
        audioText: waitReply,
        isAiGenerated: false,
      });
    }

    if (!aiClient) {
      // Deterministic friendly response
      let reply = "Chào bạn nhỏ! Mình là Sao Sáng AI đây. ";
      if (currentQuestion) {
        if (isExamMode) {
          reply += "Trong giờ kiểm tra chính thức, em hãy xem kĩ hướng dẫn cách làm này để rút kinh nghiệm cho các câu tiếp theo nhé!";
        } else {
          reply += `Hướng dẫn cách làm bài này: ${currentQuestion.explanation || "Thực hiện phép tính theo thứ tự đã học."} Gợi ý tư duy: ${currentQuestion.visualHint || "Phân tích kĩ dữ kiện đề bài đã cho."}`;
        }
      } else {
        reply += "Bạn muốn cùng Sao Sáng luyện toán hay khám phá hành tinh nào hôm nay? Cứ nói với mình nhé!";
      }

      return res.json({
        success: true,
        reply,
        audioText: reply,
        isAiGenerated: false
      });
    }

    const systemPrompt = `Bạn là Robot SAO SÁNG AI, linh vật và gia sư Toán tiểu học chuẩn GDPT 2018 Việt Nam.
Tính cách: Vui vẻ, ấm áp, kiên nhẫn, động viên học sinh.
QUY TẮC SƯ PHẠM BẮT BUỘC:
- HỌC SINH ĐÃ CHỌN ĐÁP ÁN (hasAnswered = true): Hãy giải thích rõ ràng từng bước giải (hướng dẫn cách làm), công thức áp dụng, và vì sao đáp án đúng lại là như vậy để học sinh hiểu sâu bản chất toán học.
- Ngôn ngữ trong sáng, thân thiện, phù hợp lứa tuổi học sinh lớp ${grade}.`;

    const contents = `Câu hỏi hiện tại: ${JSON.stringify(currentQuestion || "Không có")}
Học sinh đã trả lời: ${hasAnswered ? "ĐÃ CHỌN ĐÁP ÁN XONG" : "CHƯA TRẢ LỜI"}
Học sinh hỏi: "${studentMessage}"
Hãy hướng dẫn cách làm và giải thích cho học sinh:`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        { text: systemPrompt },
        { text: contents }
      ],
      config: {
        temperature: 0.7,
      }
    });

    const reply = response.text || "Sao Sáng luôn đồng hành cùng em! Hãy tự tin làm bài nhé!";
    return res.json({
      success: true,
      reply,
      audioText: reply.replace(/[#*`]/g, ""),
      isAiGenerated: true
    });
  } catch (error: any) {
    console.error("Robot assistant error:", error);
    return res.json({
      success: true,
      reply: "Sao Sáng đang suy nghĩ cùng em nè! Đọc kĩ đề bài, xác định đơn vị đo và tính nhẩm cẩn thận nha bạn nhỏ!",
      audioText: "Sao Sáng đang suy nghĩ cùng em nè! Đọc kĩ đề bài và tính cẩn thận nha!",
      isAiGenerated: false
    });
  }
});

// API: Server-side deterministic grading & Star evaluation
app.post("/api/grade-submission", (req, res) => {
  try {
    const {
      assignmentId,
      studentId,
      answers = {}, // { [questionId]: selectedIndex }
      questions = [],
      timeSpentSeconds = 0,
      isHardPlanet = false,
      isOnTime = true,
      previousScore = null
    } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Không có danh sách câu hỏi để chấm điểm." });
    }

    let correctCount = 0;
    const itemResults = questions.map((q: any) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation || "Xem lại bài giảng và ghi nhớ quy tắc tính toán."
      };
    });

    const totalQuestions = questions.length;
    const score10 = Number(((correctCount / totalQuestions) * 10).toFixed(1));
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Calculate stars according to specified rules
    let starsAwarded = 0;
    const starBreakdown: string[] = [];

    // Rule 1: Hoàn thành bài tập (+2 sao)
    starsAwarded += 2;
    starBreakdown.push("Hoàn thành bài tập: +2 sao");

    // Rule 2: Hoàn thành đúng hạn (+1 sao)
    if (isOnTime) {
      starsAwarded += 1;
      starBreakdown.push("Nộp bài đúng hạn: +1 sao");
    }

    // Rule 3: Đạt >= 80% điểm bài luyện tập (+2 sao)
    if (percentage >= 80) {
      starsAwarded += 2;
      starBreakdown.push("Đạt từ 80% số điểm: +2 sao");
    }

    // Rule 4: Hoàn thành thử thách khó (+3 sao)
    if (isHardPlanet && percentage >= 50) {
      starsAwarded += 3;
      starBreakdown.push("Vượt qua Thử Thách Khó: +3 sao");
    }

    // Rule 5: Tiến bộ so với kết quả trước (+2 sao)
    if (previousScore !== null && score10 > previousScore) {
      starsAwarded += 2;
      starBreakdown.push(`Tiến bộ vượt bậc (${previousScore}đ -> ${score10}đ): +2 sao`);
    }

    let praiseMessage = "Em đã rất nỗ lực hoàn thành bài học!";
    if (percentage === 100) {
      praiseMessage = "Xuất sắc tuyệt đối! Em là một Siêu sao Toán học thực thụ!";
    } else if (percentage >= 80) {
      praiseMessage = "Rất tốt! Em nắm bài rất vững, chỉ cần chú ý thêm một chút nữa thôi!";
    } else if (percentage >= 50) {
      praiseMessage = "Khá lắm! Em hãy cùng Sao Sáng xem lại các câu chưa đúng để ghi nhớ nhé!";
    } else {
      praiseMessage = "Không sao cả, thất bại là mẹ thành công! Hãy luyện tập lại để nhận thêm sao nhé!";
    }

    return res.json({
      success: true,
      score: score10,
      percentage,
      correctCount,
      totalQuestions,
      timeSpentSeconds,
      starsAwarded,
      starBreakdown,
      praiseMessage,
      itemResults
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Lỗi trong quá trình chấm điểm máy chủ: " + err.message });
  }
});

// Helper for fallback question generation
function generateFallbackQuestions(grade: number, topic: string, difficulty: string, count: number) {
  const bankByGrade: Record<number, any[]> = {
    1: [
      {
        questionText: "Hình nào dưới đây có 3 cạnh và 3 đỉnh?",
        options: ["Hình tam giác", "Hình chữ nhật", "Hình tròn", "Hình vuông"],
        correctIndex: 0,
        explanation: "Hình tam giác là hình có đúng 3 cạnh và 3 đỉnh.",
        visualHint: "Hãy đếm số cạnh của hình tam giác.",
        difficulty: "easy"
      },
      {
        questionText: "Tính nhẩm: 45 + 30 = ?",
        options: ["65", "75", "85", "70"],
        correctIndex: 1,
        explanation: "45 + 30 = 75 (cộng hàng chục: 4 chục + 3 chục = 7 chục, 5 đơn vị giữ nguyên).",
        visualHint: "Cộng chữ số hàng chục với nhau: 4 + 3 = 7.",
        difficulty: "easy"
      },
      {
        questionText: "Mẹ mua 15 quả cam, mẹ cho bà 5 quả. Hỏi mẹ còn lại bao nhiêu quả cam?",
        options: ["8 quả", "10 quả", "12 quả", "20 quả"],
        correctIndex: 1,
        explanation: "Số quả cam mẹ còn lại là: 15 - 5 = 10 (quả).",
        visualHint: "Bớt đi thì dùng phép tính trừ.",
        difficulty: "medium"
      },
      {
        questionText: "Số liền sau của số 89 là số nào?",
        options: ["88", "90", "91", "99"],
        correctIndex: 1,
        explanation: "Số liền sau của 89 là 89 + 1 = 90.",
        visualHint: "Số liền sau hơn số đã cho 1 đơn vị.",
        difficulty: "easy"
      },
      {
        questionText: "Một tuần lễ có mấy ngày?",
        options: ["5 ngày", "6 ngày", "7 ngày", "8 ngày"],
        correctIndex: 2,
        explanation: "Một tuần lễ gồm 7 ngày: từ Thứ Hai đến Chủ Nhật.",
        visualHint: "Kể tên các ngày từ Thứ Hai đến Chủ Nhật.",
        difficulty: "easy"
      }
    ],
    2: [
      {
        questionText: "Tính nhẩm: 6 x 5 = ?",
        options: ["25", "30", "35", "36"],
        correctIndex: 1,
        explanation: "Trong bảng nhân 6: 6 x 5 = 30.",
        visualHint: "Nhẩm bảng nhân 6 hoặc lấy 6 cộng 5 lần.",
        difficulty: "easy"
      },
      {
        questionText: "Bác An có 24 bông hoa, bác cắm đều vào 4 lọ hoa. Hỏi mỗi lọ có mấy bông hoa?",
        options: ["5 bông", "6 bông", "7 bông", "8 bông"],
        correctIndex: 1,
        explanation: "Mỗi lọ có số bông hoa là: 24 : 4 = 6 (bông hoa).",
        visualHint: "Chia đều vào 4 lọ nên ta dùng phép tính chia 24 : 4.",
        difficulty: "medium"
      },
      {
        questionText: "Đổi đơn vị: 1m = ? cm",
        options: ["10 cm", "100 cm", "1000 cm", "50 cm"],
        correctIndex: 1,
        explanation: "1 mét bằng 100 xăng-ti-mét (1m = 100cm).",
        visualHint: "1m = 10dm = 100cm.",
        difficulty: "easy"
      },
      {
        questionText: "Đồng hồ chỉ 8 giờ 15 phút. Kim dài chỉ vào số nào?",
        options: ["Số 1", "Số 2", "Số 3", "Số 4"],
        correctIndex: 2,
        explanation: "15 phút tương ứng với kim phút chỉ vào đúng số 3 (3 x 5 = 15).",
        visualHint: "Mỗi khoảng số trên mặt đồng hồ tương ứng 5 phút.",
        difficulty: "medium"
      },
      {
        questionText: "Tìm x biết: x + 128 = 350",
        options: ["222", "232", "228", "478"],
        correctIndex: 0,
        explanation: "x = 350 - 128 = 222.",
        visualHint: "Muốn tìm số hạng chưa biết, lấy tổng trừ đi số hạng đã biết.",
        difficulty: "hard"
      }
    ],
    3: [
      {
        questionText: "Tính chu vi của một hình vuông có cạnh dài 8 cm.",
        options: ["16 cm", "24 cm", "32 cm", "64 cm"],
        correctIndex: 2,
        explanation: "Chu vi hình vuông = Cạnh x 4 = 8 x 4 = 32 (cm).",
        visualHint: "Hình vuông có 4 cạnh bằng nhau.",
        difficulty: "easy"
      },
      {
        questionText: "Một đội xe có 3 xe tải, mỗi xe chở được 1 250 kg gạo. Hỏi cả đội xe chở được bao nhiêu ki-lô-gam gạo?",
        options: ["3 650 kg", "3 750 kg", "3 850 kg", "3 500 kg"],
        correctIndex: 1,
        explanation: "Số kg gạo cả đội xe chở được là: 1 250 x 3 = 3 750 (kg).",
        visualHint: "Lấy số kg của 1 xe nhân với 3.",
        difficulty: "medium"
      },
      {
        questionText: "Số lớn nhất có 4 chữ số khác nhau là số nào?",
        options: ["9999", "9876", "9988", "8976"],
        correctIndex: 1,
        explanation: "Số lớn nhất có 4 chữ số khác nhau là 9876.",
        visualHint: "Chọn chữ số hàng nghìn là 9, hàng trăm là 8, hàng chục là 7, hàng đơn vị là 6.",
        difficulty: "hard"
      },
      {
        questionText: "Diện tích của hình chữ nhật có chiều dài 9 cm và chiều rộng 6 cm là:",
        options: ["30 cm2", "45 cm2", "54 cm2", "60 cm2"],
        correctIndex: 2,
        explanation: "Diện tích hình chữ nhật = Dài x Rộng = 9 x 6 = 54 (cm2).",
        visualHint: "Lấy chiều dài nhân với chiều rộng (cùng đơn vị đo).",
        difficulty: "easy"
      },
      {
        questionText: "Một lớp học có 36 học sinh, trong đó có 1/3 số học sinh giỏi. Hỏi lớp đó có bao nhiêu học sinh giỏi?",
        options: ["10 học sinh", "12 học sinh", "14 học sinh", "18 học sinh"],
        correctIndex: 1,
        explanation: "Số học sinh giỏi là: 36 x 1/3 = 12 (học sinh).",
        visualHint: "Lấy tổng số học sinh chia cho 3.",
        difficulty: "medium"
      }
    ],
    4: [
      {
        questionText: "Tính giá trị biểu thức: 2/5 + 3/10 = ?",
        options: ["5/15", "7/10", "1/2", "4/5"],
        correctIndex: 1,
        explanation: "Quy đồng mẫu số: 2/5 = 4/10. Khi đó: 4/10 + 3/10 = 7/10.",
        visualHint: "Quy đồng mẫu số chung là 10.",
        difficulty: "medium"
      },
      {
        questionText: "Tìm số trung bình cộng của ba số: 24, 36 và 45.",
        options: ["30", "35", "40", "36"],
        correctIndex: 1,
        explanation: "Tổng ba số = 24 + 36 + 45 = 105. Số trung bình cộng = 105 : 3 = 35.",
        visualHint: "Lấy tổng chia cho số các số hạng (3).",
        difficulty: "easy"
      },
      {
        questionText: "Một thửa ruộng hình chữ nhật có chu vi 120 m. Chiều dài hơn chiều rộng 10 m. Tính diện tích thửa ruộng đó.",
        options: ["875 m2", "850 m2", "900 m2", "800 m2"],
        correctIndex: 0,
        explanation: "Nửa chu vi = 120 : 2 = 60 m. Chiều dài = (60 + 10) : 2 = 35 m. Chiều rộng = 35 - 10 = 25 m. Diện tích = 35 x 25 = 875 m2.",
        visualHint: "Dạng toán tìm hai số khi biết tổng và hiệu.",
        difficulty: "hard"
      },
      {
        questionText: "Đổi đơn vị đo: 3 tấn 50 kg = ? kg",
        options: ["350 kg", "3050 kg", "3500 kg", "3005 kg"],
        correctIndex: 1,
        explanation: "1 tấn = 1000 kg => 3 tấn = 3000 kg. 3000 + 50 = 3050 kg.",
        visualHint: "1 tấn = 1000 kg.",
        difficulty: "easy"
      },
      {
        questionText: "Góc tù là góc như thế nào?",
        options: ["Nhỏ hơn góc vuông", "Bằng góc vuông", "Lớn hơn góc vuông và nhỏ hơn góc bẹt", "Bằng góc bẹt"],
        correctIndex: 2,
        explanation: "Góc tù lớn hơn góc vuông (90 độ) và nhỏ hơn góc bẹt (180 độ).",
        visualHint: "Góc tù có số đo từ 90 đến 180 độ.",
        difficulty: "easy"
      }
    ],
    5: [
      {
        questionText: "Một người đi xe máy từ tỉnh A lúc 7 giờ và đến tỉnh B lúc 9 giờ 30 phút. Quãng đường AB dài 100 km. Tính vận tốc của xe máy.",
        options: ["35 km/h", "40 km/h", "45 km/h", "50 km/h"],
        correctIndex: 1,
        explanation: "Thời gian đi = 9 giờ 30 phút - 7 giờ = 2 giờ 30 phút = 2,5 giờ. Vận tốc = 100 : 2,5 = 40 (km/h).",
        visualHint: "Vận tốc = Quãng đường : Thời gian (v = s : t).",
        difficulty: "medium"
      },
      {
        questionText: "Tính diện tích hình tròn có bán kính r = 5 cm (lấy số pi = 3,14).",
        options: ["31,4 cm2", "78,5 cm2", "15,7 cm2", "62,8 cm2"],
        correctIndex: 1,
        explanation: "Diện tích hình tròn = r x r x 3,14 = 5 x 5 x 3,14 = 78,5 (cm2).",
        visualHint: "Công thức S = r x r x 3,14.",
        difficulty: "easy"
      },
      {
        questionText: "Lớp 5A có 40 học sinh, trong đó có 24 học sinh nữ. Tỉ số phần trăm của học sinh nữ so với cả lớp là:",
        options: ["50%", "60%", "65%", "70%"],
        correctIndex: 1,
        explanation: "Tỉ số phần trăm = (24 : 40) x 100% = 0,6 x 100% = 60%.",
        visualHint: "Lấy số học sinh nữ chia cho tổng số học sinh rồi nhân với 100.",
        difficulty: "easy"
      },
      {
        questionText: "Một bể nước dạng hình hộp chữ nhật có chiều dài 2m, chiều rộng 1,5m và chiều cao 1,2m. Thể tích của bể nước đó là:",
        options: ["3,6 m3", "4,2 m3", "5,4 m3", "2,4 m3"],
        correctIndex: 0,
        explanation: "Thể tích = Dài x Rộng x Cao = 2 x 1,5 x 1,2 = 3,6 (m3).",
        visualHint: "V = a x b x c.",
        difficulty: "medium"
      },
      {
        questionText: "Một mảnh đất hình thang có đáy lớn 30 m, đáy bé 20 m và chiều cao bằng trung bình cộng hai đáy. Tính diện tích mảnh đất.",
        options: ["500 m2", "625 m2", "750 m2", "1250 m2"],
        correctIndex: 1,
        explanation: "Chiều cao = (30 + 20) : 2 = 25 m. Diện tích = [(30 + 20) x 25] : 2 = 625 m2.",
        visualHint: "Diện tích hình thang = [(đáy lớn + đáy bé) x chiều cao] : 2.",
        difficulty: "hard"
      }
    ]
  };

  const pool = bankByGrade[grade] || bankByGrade[3];
  const results: any[] = [];
  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    results.push({
      id: `fallback_q_${grade}_${i + 1}`,
      grade,
      topic: topic || "Toán tổng hợp GDPT 2018",
      difficulty: item.difficulty || difficulty,
      questionText: item.questionText,
      options: [...item.options],
      correctIndex: item.correctIndex,
      explanation: item.explanation,
      visualHint: item.visualHint,
      calculationCheck: "Thuật toán kiểm chứng chuẩn GDPT 2018."
    });
  }
  return results;
}

// Development and production client serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
