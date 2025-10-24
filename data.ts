import { Course, ScheduleEvent } from './types';

export const courses: Course[] = [
    { id: '1', title: 'Quantum Physics', instructor: 'Dr. Evelyn Reed', progress: 75, color: 'blue', quizTopic: 'Quantum Mechanics' },
    { id: '2', title: 'Advanced Algebra', instructor: 'Prof. David Chen', progress: 45, color: 'purple', quizTopic: 'Linear Algebra' },
    { id: '3', title: 'World History: 1900-Present', instructor: 'Dr. Maria Garcia', progress: 90, color: 'green', quizTopic: 'The Cold War' },
    { id: '4', title: 'Creative Writing', instructor: 'Mr. Samuel Jones', progress: 60, color: 'orange', quizTopic: 'Literary Devices' },
];

const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');

// Helper to format date strings
const d = (day: number) => `${year}-${month}-${day.toString().padStart(2, '0')}`;

export const scheduleEvents: ScheduleEvent[] = [
    { id: 'e1', courseId: '1', title: 'Quantum Physics Lecture', date: d(3), time: '10:00 AM', type: 'lecture' },
    { id: 'e2', courseId: '2', title: 'Algebra Problem Set Due', date: d(5), time: '11:59 PM', type: 'deadline' },
    { id: 'e3', courseId: '3', title: 'History Mid-term Study Group', date: d(8), time: '02:00 PM', type: 'meeting' },
    { id: 'e4', courseId: '4', title: 'Poetry Workshop', date: d(10), time: '04:30 PM', type: 'meeting' },
    { id: 'e5', courseId: '1', title: 'Lab Report Submission', date: d(12), time: '05:00 PM', type: 'deadline' },
    { id: 'e6', courseId: '1', title: 'Team Meeting: Project Alpha', date: d(15), time: '11:00 AM', type: 'meeting' },
    { id: 'e7', courseId: '2', title: 'Guest Lecture: Dr. Smith', date: d(17), time: '01:00 PM', type: 'lecture' },
    { id: 'e8', courseId: '3', title: 'Essay Outline Due', date: d(20), time: '11:59 PM', type: 'deadline' },
    { id: 'e9', courseId: '4', title: 'Short Story Draft Review', date: d(22), time: '03:00 PM', type: 'meeting' },
    { id: 'e10', courseId: '2', title: 'Final Exam Review Session', date: d(25), time: '06:00 PM', type: 'meeting' },
    { id: 'e11', courseId: '3', title: 'Final Paper Due', date: d(28), time: '11:59 PM', type: 'deadline' },
];
