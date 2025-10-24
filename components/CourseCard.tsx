
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onStartQuiz: (topic: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onStartQuiz }) => {
  const gradient = `from-${course.color}-500 to-${course.color}-600`;
  const text = `text-${course.color}-300`;
  const progressBg = `bg-${course.color}-500`;

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className={`p-5 bg-gradient-to-br ${gradient}`}>
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
        <p className="text-sm text-white opacity-80 mt-1">{course.instructor}</p>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <p className={`text-sm font-medium ${text} mb-2`}>Progress</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`${progressBg} h-2.5 rounded-full`} style={{ width: `${course.progress}%` }}></div>
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{course.progress}% Complete</p>
        </div>
        <button
          onClick={() => onStartQuiz(course.quizTopic)}
          className={`mt-6 w-full py-2 px-4 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200`}
        >
          Impulse Quiz
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
