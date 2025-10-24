import React, { useState, useEffect } from 'react';
import { Course, ScheduleEvent } from '../types';
import { CloseIcon } from './icons/IconComponents';

interface EventModalProps {
  onClose: () => void;
  onSave: (event: ScheduleEvent) => void;
  onDelete: (eventId: string) => void;
  eventToEdit?: ScheduleEvent;
  selectedDate: string;
  courses: Course[];
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSave, onDelete, eventToEdit, selectedDate, courses }) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [time, setTime] = useState('12:00');
  const [type, setType] = useState<ScheduleEvent['type']>('meeting');
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setCourseId(eventToEdit.courseId);
      // Convert HH:MM AM/PM to 24-hour format for input
      const [timePart, ampm] = eventToEdit.time.split(' ');
      let [hours, minutes] = timePart.split(':');
      if (ampm === 'PM' && hours !== '12') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      if (ampm === 'AM' && hours === '12') {
        hours = '00';
      }
      setTime(`${hours.padStart(2, '0')}:${minutes}`);
      setType(eventToEdit.type);
    }
  }, [eventToEdit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      setError('Title and course are required.');
      return;
    }
    setError('');
    
    // Convert 24-hour time to HH:MM AM/PM
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = ((h + 11) % 12 + 1);
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;

    onSave({
      id: eventToEdit?.id || `temp-${Date.now()}`,
      title,
      courseId,
      date: selectedDate,
      time: formattedTime,
      type,
    });
  };

  const handleDelete = () => {
    if (eventToEdit) {
      if(window.confirm(`Are you sure you want to delete "${eventToEdit.title}"?`)) {
        onDelete(eventToEdit.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{eventToEdit ? 'Edit Event' : 'Schedule Event'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Event Title</label>
            <input
              type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Project Sync-up"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-400 mb-1">Course</label>
              <select id="course" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500">
                {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-400 mb-1">Time</label>
              <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">Event Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as ScheduleEvent['type'])} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500">
              <option value="meeting">Meeting</option>
              <option value="lecture">Lecture</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="pt-4 flex justify-between items-center">
             <div>
              {eventToEdit && (
                <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-semibold rounded-lg transition-colors">
                  Delete
                </button>
              )}
            </div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">
                Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                {eventToEdit ? 'Save Changes' : 'Save Event'}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;