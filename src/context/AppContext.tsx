import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Assignment,
  Badge,
  ClassRoom,
  LeaderboardEntry,
  MathQuestion,
  StudentProfile,
  Submission,
  TeacherProfile,
  UserRole,
} from "../types";
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_BADGES,
  INITIAL_CLASSES,
  INITIAL_LEADERBOARD,
  INITIAL_QUESTIONS,
  INITIAL_STUDENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_TEACHER,
} from "../data/mockData";
import { isSoundEnabled, playFanfareSound, playStarSound, setSoundEnabled } from "../utils/audio";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentTeacher: TeacherProfile;
  currentStudent: StudentProfile;
  setCurrentStudentId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGrade: number;
  setSelectedGrade: (grade: number) => void;
  classes: ClassRoom[];
  students: StudentProfile[];
  assignments: Assignment[];
  submissions: Submission[];
  questionBank: MathQuestion[];
  leaderboard: LeaderboardEntry[];
  badges: Badge[];
  soundOn: boolean;
  toggleSound: () => void;
  robotOpen: boolean;
  setRobotOpen: (val: boolean) => void;

  // Authentication State & RBAC
  isAuthenticated: boolean;
  loginAsTeacher: (email: string, password?: string) => { success: boolean; message?: string };
  loginAsStudent: (studentCode: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;

  // Actions
  addClass: (cls: Omit<ClassRoom, "id">) => void;
  importStudents: (classId: string, newStudents: Array<{ fullName: string; studentCode?: string }>) => void;
  addQuestionsToBank: (questions: MathQuestion[]) => void;
  updateQuestion: (question: MathQuestion) => void;
  deleteQuestion: (questionId: string) => void;
  createAssignment: (assignment: Omit<Assignment, "id" | "createdAt">) => void;
  submitStudentWork: (submission: Omit<Submission, "id" | "submittedAt">) => void;
  awardStarsManually: (studentId: string, amount: number, reason: string) => void;
  resetAllData: () => void;
  triggerStarCelebration: (starsCount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem("app_auth_role");
      return (savedRole as UserRole) || "student";
    } catch {
      return "student";
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem("app_auth_session") === "true";
    } catch {
      return false;
    }
  });

  const [currentTeacher] = useState<TeacherProfile>(INITIAL_TEACHER);
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem("app_auth_student_id") || "student_01";
    } catch {
      return "student_01";
    }
  });
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [robotOpen, setRobotOpen] = useState<boolean>(false);

  // Persistent storage state with default mock fallbacks
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem("app_classes");
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem("app_students");
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem("app_assignments");
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem("app_submissions");
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [questionBank, setQuestionBank] = useState<MathQuestion[]>(() => {
    try {
      const saved = localStorage.getItem("app_questions");
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem("app_leaderboard");
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  const [badges] = useState<Badge[]>(INITIAL_BADGES);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("app_classes", JSON.stringify(classes));
      localStorage.setItem("app_students", JSON.stringify(students));
      localStorage.setItem("app_assignments", JSON.stringify(assignments));
      localStorage.setItem("app_submissions", JSON.stringify(submissions));
      localStorage.setItem("app_questions", JSON.stringify(questionBank));
      localStorage.setItem("app_leaderboard", JSON.stringify(leaderboard));
    } catch {}
  }, [classes, students, assignments, submissions, questionBank, leaderboard]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const triggerStarCelebration = (starsCount: number) => {
    playStarSound();
    if (starsCount >= 5) {
      playFanfareSound();
    }
    try {
      confetti({
        particleCount: Math.min(starsCount * 25, 120),
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFC83D", "#FF914D", "#3478F6", "#8957F6", "#FF6B9C"],
      });
    } catch {}
  };

  const addClass = (cls: Omit<ClassRoom, "id">) => {
    const newClass: ClassRoom = {
      ...cls,
      id: `class_${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const importStudents = (classId: string, newStudents: Array<{ fullName: string; studentCode?: string }>) => {
    const targetClass = classes.find((c) => c.id === classId);
    const className = targetClass ? targetClass.name : "Lớp học mới";

    const created = newStudents.map((item, idx) => ({
      id: `student_${Date.now()}_${idx}`,
      studentCode: item.studentCode || `HS-${classId.slice(-2).toUpperCase()}${String(students.length + idx + 1).padStart(2, "0")}`,
      fullName: item.fullName,
      classId,
      className,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(item.fullName)}`,
      totalStars: 5, // initial bonus
      level: 1,
      streakDays: 1,
      completedTasks: 0,
      averageScore: 0,
      badges: ["badge_cham_chi"],
      incorrectQuestions: [],
    }));

    setStudents((prev) => [...prev, ...created]);
    // update class studentCount
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, studentCount: c.studentCount + created.length } : c))
    );
  };

  const addQuestionsToBank = (questions: MathQuestion[]) => {
    setQuestionBank((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      const fresh = questions.filter((q) => !existingIds.has(q.id));
      return [...prev, ...fresh];
    });
  };

  const updateQuestion = (question: MathQuestion) => {
    setQuestionBank((prev) => prev.map((q) => (q.id === question.id ? question : q)));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestionBank((prev) => prev.filter((q) => q.id !== questionId));
  };

  const createAssignment = (assignmentData: Omit<Assignment, "id" | "createdAt">) => {
    const newAssign: Assignment = {
      ...assignmentData,
      id: `assign_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [newAssign, ...prev]);
  };

  const submitStudentWork = (subData: Omit<Submission, "id" | "submittedAt">) => {
    const newSub: Submission = {
      ...subData,
      id: `sub_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Update student stars, completed tasks, and average score
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === subData.studentId) {
          const newTotalStars = s.totalStars + subData.starsAwarded;
          const newCompleted = s.completedTasks + 1;
          const newAvg = Number(
            ((s.averageScore * s.completedTasks + subData.score) / newCompleted).toFixed(1)
          );
          const newLevel = Math.floor(newTotalStars / 12) + 1;
          return {
            ...s,
            totalStars: newTotalStars,
            completedTasks: newCompleted,
            averageScore: newAvg,
            level: Math.max(s.level, newLevel),
          };
        }
        return s;
      })
    );

    // Update leaderboard
    setLeaderboard((prev) => {
      const existing = prev.find((entry) => entry.studentId === subData.studentId);
      if (existing) {
        return prev
          .map((entry) =>
            entry.studentId === subData.studentId
              ? {
                  ...entry,
                  weeklyStars: entry.weeklyStars + subData.starsAwarded,
                  totalStars: entry.totalStars + subData.starsAwarded,
                }
              : entry
          )
          .sort((a, b) => b.weeklyStars - a.weeklyStars)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));
      }
      return prev;
    });

    triggerStarCelebration(subData.starsAwarded);
  };

  const awardStarsManually = (studentId: string, amount: number, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newStars = Math.max(0, s.totalStars + amount);
          return { ...s, totalStars: newStars };
        }
        return s;
      })
    );

    setLeaderboard((prev) =>
      prev
        .map((e) =>
          e.studentId === studentId
            ? {
                ...e,
                weeklyStars: Math.max(0, e.weeklyStars + amount),
                totalStars: Math.max(0, e.totalStars + amount),
              }
            : e
        )
        .sort((a, b) => b.weeklyStars - a.weeklyStars)
        .map((item, idx) => ({ ...item, rank: idx + 1 }))
    );

    if (amount > 0) {
      triggerStarCelebration(amount);
    }
  };

  const loginAsTeacher = (email: string, _password?: string) => {
    setRole("teacher");
    setIsAuthenticated(true);
    setActiveTab("workshop");
    try {
      localStorage.setItem("app_auth_session", "true");
      localStorage.setItem("app_auth_role", "teacher");
    } catch {}
    triggerStarCelebration(2);
    return { success: true };
  };

  const loginAsStudent = (studentCode: string, _password?: string) => {
    const codeClean = studentCode.trim().toUpperCase();
    const matched = students.find(
      (s) => s.studentCode.toUpperCase() === codeClean || s.id === studentCode
    );

    if (matched) {
      setCurrentStudentId(matched.id);
      const studentClass = classes.find((c) => c.id === matched.classId);
      if (studentClass) {
        setSelectedGrade(studentClass.grade);
      }
    } else {
      setCurrentStudentId(students[0]?.id || "student_01");
    }

    setRole("student");
    setIsAuthenticated(true);
    setActiveTab("home");
    try {
      localStorage.setItem("app_auth_session", "true");
      localStorage.setItem("app_auth_role", "student");
      localStorage.setItem("app_auth_student_id", matched ? matched.id : "student_01");
    } catch {}
    triggerStarCelebration(2);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab("home");
    try {
      localStorage.removeItem("app_auth_session");
      localStorage.removeItem("app_auth_role");
      localStorage.removeItem("app_auth_student_id");
    } catch {}
  };

  const resetAllData = () => {
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setQuestionBank(INITIAL_QUESTIONS);
    setLeaderboard(INITIAL_LEADERBOARD);
    setIsAuthenticated(false);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentTeacher,
        currentStudent,
        setCurrentStudentId,
        activeTab,
        setActiveTab,
        selectedGrade,
        setSelectedGrade,
        classes,
        students,
        assignments,
        submissions,
        questionBank,
        leaderboard,
        badges,
        soundOn,
        toggleSound,
        robotOpen,
        setRobotOpen,
        isAuthenticated,
        loginAsTeacher,
        loginAsStudent,
        logout,
        addClass,
        importStudents,
        addQuestionsToBank,
        updateQuestion,
        deleteQuestion,
        createAssignment,
        submitStudentWork,
        awardStarsManually,
        resetAllData,
        triggerStarCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
