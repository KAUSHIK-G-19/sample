import React, { useState } from 'react';
import { ActiveView, User, Course, ScheduleEvent } from './types';
import { courses as initialCourses, scheduleEvents as initialEvents } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import TeamCall from './components/TeamCall';
import ImpulseQuizModal from './components/ImpulseQuizModal';
import Settings from './components/Settings';
import Calendar from './components/Calendar';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Dashboard);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState<string>('');
  
  const [user, setUser] = useState<User>({
    name: 'Alex Johnson',
    avatarUrl: 'https://picsum.photos/seed/student/200',
  });

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);

  const handleAddEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  
  const handleUpdateEvent = (updatedEvent: ScheduleEvent) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };
  
  const handleStartQuiz = (topic: string) => {
    setQuizTopic(topic);
    setIsQuizModalOpen(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizModalOpen(false);
    setQuizTopic('');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case ActiveView.Dashboard:
      case ActiveView.Courses:
        return <Dashboard courses={courses} setCourses={setCourses} onStartQuiz={handleStartQuiz} />;
      case ActiveView.Assignments:
        return <FileUpload />;
      case ActiveView.Calendar:
        return <Calendar 
                  events={events} 
                  courses={courses} 
                  onAddEvent={handleAddEvent}
                  onUpdateEvent={handleUpdateEvent}
                  onDeleteEvent={handleDeleteEvent}
                />;
      case ActiveView.Calls:
        return <TeamCall scheduleEvents={events} courses={courses} />;
      case ActiveView.Settings:
        return <Settings user={user} setUser={setUser} />;
      default:
        return <Dashboard courses={courses} setCourses={setCourses} onStartQuiz={handleStartQuiz} />;
    }
  };
  
  const viewTitles: Record<ActiveView, string> = {
    [ActiveView.Dashboard]: 'Dashboard',
    [ActiveView.Courses]: 'My Courses',
    [ActiveView.Assignments]: 'Assignments',
    [ActiveView.Calendar]: 'Calendar',
    [ActiveView.Calls]: 'Team Calls',
    [ActiveView.Settings]: 'Settings',
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1">
        <Header user={user} title={viewTitles[activeView]} />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
      {isQuizModalOpen && <ImpulseQuizModal topic={quizTopic} onClose={handleCloseQuiz} />}
    </div>
  );
};

export default App;