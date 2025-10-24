export enum ActiveView {
  Dashboard = 'DASHBOARD',
  Courses = 'COURSES',
  Assignments = 'ASSIGNMENTS',
  Calendar = 'CALENDAR',
  Calls = 'CALLS',
  Settings = 'SETTINGS',
}

export interface User {
  name: string;
  avatarUrl: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  color: string;
  quizTopic: string;
}

export interface ScheduleEvent {
  id: string;
  courseId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  type: 'meeting' | 'deadline' | 'lecture';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
