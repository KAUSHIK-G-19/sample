import React, { useState } from 'react';
import { Course } from '../types';
import { CloseIcon } from './icons/IconComponents';

interface CreateCourseModalProps {
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'id' | 'progress' | 'quizTopic'>) => void;
}

const courseColors = ['blue', 'purple', 'green', 'orange', 'red', 'pink'];

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [color, setColor] = useState(courseColors[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructor.trim()) {
      setError('Both title and instructor are required.');
      return;
    }
    setError('');
    onSave({ title, instructor, color });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create New Course</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Introduction to Astrophysics"
            />
          </div>
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-400 mb-1">Instructor Name</label>
            <input
              type="text"
              id="instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Dr. Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Course Color</label>
            <div className="flex space-x-2">
              {courseColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full bg-${c}-500 transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;