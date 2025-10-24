import React, { useState } from 'react';
import { ScheduleEvent, Course } from '../types';
import EventModal from './ScheduleMeetingModal';
import { PlusIcon } from './icons/IconComponents';

interface CalendarProps {
  events: ScheduleEvent[];
  courses: Course[];
  onAddEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  onUpdateEvent: (event: ScheduleEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, courses, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | undefined>(undefined);

  const courseMap = courses.reduce((acc, course) => {
    acc[course.id] = course;
    return acc;
  }, {} as Record<string, Course>);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const isToday = (day: number) => 
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();
    
  const isSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentDate.getMonth() &&
    selectedDate.getFullYear() === currentDate.getFullYear();

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);
  
  const selectedDateString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
  const eventsForSelectedDay = (eventsByDate[selectedDateString] || []).sort((a,b) => a.time.localeCompare(b.time));

  const handleOpenModalForNew = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };
  
  const handleSaveEvent = (eventData: ScheduleEvent) => {
    if (editingEvent) {
      onUpdateEvent(eventData);
    } else {
      const { id, ...newEventData } = eventData;
      onAddEvent(newEventData);
    }
    setIsModalOpen(false);
    setEditingEvent(undefined);
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent(eventId);
    setIsModalOpen(false);
    setEditingEvent(undefined);
  };

  return (
    <div className="p-6 h-full flex flex-col md:flex-row gap-6">
      <div className="flex-grow bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-700">&lt;</button>
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-700">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {daysArray.map(day => {
            const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayEvents = eventsByDate[dateString] || [];
            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`relative p-2 h-20 md:h-24 border border-transparent rounded-lg cursor-pointer transition-colors ${isSelected(day) ? 'bg-blue-500/20 border-blue-500' : 'hover:bg-gray-700'}`}
              >
                <span className={`flex items-center justify-center h-6 w-6 rounded-full text-sm ${isToday(day) ? 'bg-blue-600 text-white' : ''}`}>
                  {day}
                </span>
                 <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1">
                    {dayEvents.slice(0, 3).map(event => (
                       <div key={event.id} className={`w-2 h-2 rounded-full bg-${courseMap[event.courseId]?.color || 'gray'}-500`}></div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-gray-800 rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
                {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <button onClick={handleOpenModalForNew} className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors">
              <PlusIcon className="w-4 h-4 mr-1"/>
              Schedule
            </button>
        </div>
        <div className="space-y-4 overflow-y-auto h-[calc(100%-2.5rem)] pr-2">
            {eventsForSelectedDay.length > 0 ? (
                eventsForSelectedDay.map(event => {
                    const course = courseMap[event.courseId];
                    const borderColor = `border-${course?.color || 'gray'}-500`;
                    return (
                        <div key={event.id} onClick={() => handleOpenModalForEdit(event)} className={`p-3 bg-gray-700 rounded-lg border-l-4 ${borderColor} cursor-pointer hover:bg-gray-600 transition-colors`}>
                            <p className="font-semibold text-white">{event.title}</p>
                            <p className="text-sm text-gray-300">{course?.title || 'General'}</p>
                            <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                        </div>
                    )
                })
            ) : (
                <p className="text-gray-400 text-center mt-8">No events scheduled for this day.</p>
            )}
        </div>
      </div>
      {isModalOpen && (
        <EventModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          eventToEdit={editingEvent}
          selectedDate={selectedDateString}
          courses={courses}
        />
      )}
    </div>
  );
};

export default Calendar;