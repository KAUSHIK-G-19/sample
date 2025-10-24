import React, { useState } from 'react';
import { Course } from '../types';
import CourseCard from './CourseCard';
import CreateCourseModal from './CreateCourseModal';
import { PlusIcon } from './icons/IconComponents';

interface DashboardProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  onStartQuiz: (topic: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ courses, setCourses, onStartQuiz }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCourse = (newCourseData: Omit<Course, 'id' | 'progress' | 'quizTopic'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: Date.now().toString(),
      progress: 0,
      quizTopic: newCourseData.title, // Default quiz topic to course title
    };
    setCourses(prev => [...prev, newCourse]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">My Courses</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} onStartQuiz={onStartQuiz} />
        ))}
      </div>
      {isCreateModalOpen && (
        <CreateCourseModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateCourse}
        />
      )}
    </div>
  );
};

export default Dashboard;