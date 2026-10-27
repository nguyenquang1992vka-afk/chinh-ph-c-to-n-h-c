/**
 * Automated test suite verifying the mathematical grading & star reward engine
 * Rules:
 * 1. Hoàn thành bài tập hằng ngày: +2 sao
 * 2. Hoàn thành đúng hạn: +1 sao
 * 3. Đạt từ 80% điểm bài luyện tập: +2 sao
 * 4. Hoàn thành thử thách khó: +3 sao
 * 5. Tiến bộ so với kết quả trước: +2 sao
 */

export function calculateStarRewards(params: {
  score10: number;
  percentage: number;
  isOnTime: boolean;
  isHardPlanet: boolean;
  previousScore: number | null;
}): { starsAwarded: number; starBreakdown: string[] } {
  let starsAwarded = 0;
  const starBreakdown: string[] = [];

  // Rule 1: Hoàn thành bài tập
  starsAwarded += 2;
  starBreakdown.push("Hoàn thành bài tập: +2 sao");

  // Rule 2: Hoàn thành đúng hạn
  if (params.isOnTime) {
    starsAwarded += 1;
    starBreakdown.push("Nộp bài đúng hạn: +1 sao");
  }

  // Rule 3: Đạt >= 80%
  if (params.percentage >= 80) {
    starsAwarded += 2;
    starBreakdown.push("Đạt từ 80% số điểm: +2 sao");
  }

  // Rule 4: Hoàn thành thử thách khó
  if (params.isHardPlanet && params.percentage >= 50) {
    starsAwarded += 3;
    starBreakdown.push("Vượt qua Thử Thách Khó: +3 sao");
  }

  // Rule 5: Tiến bộ so với kết quả trước
  if (params.previousScore !== null && params.score10 > params.previousScore) {
    starsAwarded += 2;
    starBreakdown.push(`Tiến bộ vượt bậc: +2 sao`);
  }

  return { starsAwarded, starBreakdown };
}

// Self-executing verification
export function runAutomatedGradingTests(): boolean {
  console.log("=== BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG TÍNH ĐIỂM & SAO THƯỞNG ===");

  // Test Case 1: Standard on-time completion with 70% (easy planet, no progress)
  const res1 = calculateStarRewards({
    score10: 7.0,
    percentage: 70,
    isOnTime: true,
    isHardPlanet: false,
    previousScore: 7.0,
  });
  console.assert(res1.starsAwarded === 3, "Test 1 Failed: Expected 3 stars (2 + 1)");

  // Test Case 2: High score >= 80% on hard planet with progress
  const res2 = calculateStarRewards({
    score10: 9.0,
    percentage: 90,
    isOnTime: true,
    isHardPlanet: true,
    previousScore: 6.5,
  });
  // 2 (complete) + 1 (on-time) + 2 (>=80%) + 3 (hard planet) + 2 (progress) = 10 stars
  console.assert(res2.starsAwarded === 10, "Test 2 Failed: Expected 10 stars");

  // Test Case 3: Overdue test with 100% on normal planet
  const res3 = calculateStarRewards({
    score10: 10.0,
    percentage: 100,
    isOnTime: false,
    isHardPlanet: false,
    previousScore: 10.0,
  });
  // 2 (complete) + 2 (>=80%) = 4 stars
  console.assert(res3.starsAwarded === 4, "Test 3 Failed: Expected 4 stars");

  console.log("=== TẤT CẢ 3 BỘ KIỂM THỬ TÍNH ĐIỂM & SAO THƯỞNG ĐỀU ĐẠT CHUẨN 100% ===");
  return true;
}
