export type UserRole = "teacher" | "student";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface MathQuestion {
  id: string;
  grade: number;
  topic: string;
  difficulty: DifficultyLevel;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  visualHint?: string;
  calculationCheck?: string;
  isApprovedByTeacher?: boolean;
}

export interface StudentProfile {
  id: string;
  studentCode: string;
  fullName: string;
  classId: string;
  className: string;
  avatarUrl: string;
  totalStars: number;
  level: number;
  streakDays: number;
  completedTasks: number;
  averageScore: number;
  badges: string[]; // badge IDs
  incorrectQuestions: string[]; // question IDs
}

export interface TeacherProfile {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  avatarUrl: string;
  managedClassIds: string[];
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  schoolYear: string;
  studentCount: number;
  teacherId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  grade: number;
  targetClassId: string;
  difficulty: DifficultyLevel | "mixed";
  questionIds: string[];
  durationMinutes: number;
  maxAttempts: number;
  deadline: string; // ISO string
  starReward: number;
  isExamMode: boolean; // if true, answer reveal is restricted
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  score: number; // 0 - 10
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  starsAwarded: number;
  starBreakdown: string[];
  answers: Record<string, number>; // { [qId]: selectedIndex }
  submittedAt: string;
}

export interface StarTransaction {
  id: string;
  studentId: string;
  amount: number;
  reason: string;
  timestamp: string;
  badgeEarned?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  criteria: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  className: string;
  avatarUrl: string;
  weeklyStars: number;
  totalStars: number;
  progressPercent: number;
  tag?: string;
}

export type BookSeries = "Kết nối tri thức" | "Chân trời sáng tạo" | "Cánh diều" | "Chuẩn GDPT 2018";

export type ResourceCategory =
  | "Vở bài tập bổ trợ số"
  | "Phiếu củng cố kiến thức"
  | "Video mô phỏng tương tác"
  | "Toán tư duy thực tế"
  | "Chuyên đề ôn luyện";

export interface SupplementaryExercise {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint: string;
  method: string;
}

export interface SupplementaryResource {
  id: string;
  title: string;
  grade: number;
  bookSeries: BookSeries;
  category: ResourceCategory;
  topic: string;
  curriculumStandard: string;
  description: string;
  summaryPoints: string[];
  tipsAndMistakes: string[];
  exercises: SupplementaryExercise[];
  externalUrl: string;
  officialSource: string;
  downloadableTitle: string;
}

export interface KNTTKeyKnowledge {
  title: string;
  description: string;
  rulesOrFormulas?: string[];
  visualExample?: string;
  commonMistakes?: string[];
}

export interface KNTTLesson {
  id: string;
  grade: number;
  semester: 1 | 2;
  chapterNumber: number;
  chapterTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  textbookPage: string;
  curriculumStandard: string;
  objective: string;
  keyKnowledge: KNTTKeyKnowledge[];
  reinforcementExercises: SupplementaryExercise[];
  extensionExercises: SupplementaryExercise[];
}

