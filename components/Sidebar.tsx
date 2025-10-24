import React from 'react';
import { ActiveView } from '../types';
import { DashboardIcon, CoursesIcon, AssignmentsIcon, CallsIcon, SettingsIcon, CalendarIcon } from './icons/IconComponents';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const baseClasses = "flex items-center px-4 py-3 my-1 transition-colors duration-200 transform rounded-lg";
  const activeClasses = "bg-gray-700 text-white";
  const inactiveClasses = "text-gray-400 hover:bg-gray-800 hover:text-gray-200";

  return (
    <a
      href="#"
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {icon}
      <span className="mx-4 font-medium">{label}</span>
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          VibeLearn
        </h1>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <nav>
          <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={activeView === ActiveView.Dashboard}
            onClick={() => setActiveView(ActiveView.Dashboard)}
          />
          <NavItem
            icon={<CoursesIcon />}
            label="Courses"
            isActive={activeView === ActiveView.Courses}
            onClick={() => setActiveView(ActiveView.Courses)}
          />
          <NavItem
            icon={<AssignmentsIcon />}
            label="Assignments"
            isActive={activeView === ActiveView.Assignments}
            onClick={() => setActiveView(ActiveView.Assignments)}
          />
          <NavItem
            icon={<CalendarIcon />}
            label="Calendar"
            isActive={activeView === ActiveView.Calendar}
            onClick={() => setActiveView(ActiveView.Calendar)}
          />
          <NavItem
            icon={<CallsIcon />}
            label="Team Calls"
            isActive={activeView === ActiveView.Calls}
            onClick={() => setActiveView(ActiveView.Calls)}
          />
        </nav>
        <div className="mt-auto">
          <NavItem
            icon={<SettingsIcon />}
            label="Settings"
            isActive={activeView === ActiveView.Settings}
            onClick={() => setActiveView(ActiveView.Settings)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
