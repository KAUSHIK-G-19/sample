import React, { useState } from 'react';
import { User } from '../types';
import { BellIcon, LockClosedIcon, LogoutIcon, MoonIcon, SunIcon, UploadIcon, UserCircleIcon } from './icons/IconComponents';

interface SettingsProps {
  user: User;
  setUser: (user: User) => void;
}

const SettingsCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <div className="bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center p-4 border-b border-gray-700">
            {icon}
            <h3 className="text-xl font-semibold ml-3">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ label: string; description: string; enabled: boolean; onToggle: () => void; }> = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-medium text-gray-200">{label}</p>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button
            type="button"
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
            aria-label={`Toggle ${label}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
    const [profileData, setProfileData] = useState({ name: user.name, email: 'alex.j@example.com' });
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        reminders: true,
        calls: true,
    });
    const [theme, setTheme] = useState('dark');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({ name: profileData.name, avatarUrl: avatarPreview || user.avatarUrl });
        // Here you would typically make an API call to save the data
        alert("Profile saved!");
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <SettingsCard title="Profile Settings" icon={<UserCircleIcon className="w-6 h-6 text-blue-400" />}>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <img className="h-20 w-20 rounded-full object-cover" src={avatarPreview || user.avatarUrl} alt={user.name} />
                        <div>
                            <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center transition-colors">
                                <UploadIcon className="w-5 h-5 mr-2" />
                                <span>Upload New Picture</span>
                            </label>
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB.</p>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" id="name" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </SettingsCard>

            <SettingsCard title="Notification Settings" icon={<BellIcon className="w-6 h-6 text-purple-400" />}>
                <div className="space-y-4">
                    <ToggleSwitch label="Email Notifications" description="Receive updates and summaries via email." enabled={notifications.email} onToggle={() => handleNotificationToggle('email')} />
                    <ToggleSwitch label="Push Notifications" description="Get real-time alerts on your devices." enabled={notifications.push} onToggle={() => handleNotificationToggle('push')} />
                    <ToggleSwitch label="Assignment Reminders" description="Get reminders for upcoming deadlines." enabled={notifications.reminders} onToggle={() => handleNotificationToggle('reminders')} />
                    <ToggleSwitch label="Team Call Alerts" description="Notify me when a team call starts." enabled={notifications.calls} onToggle={() => handleNotificationToggle('calls')} />
                </div>
            </SettingsCard>

            <SettingsCard title="Theme" icon={theme === 'dark' ? <MoonIcon className="w-6 h-6 text-green-400" /> : <SunIcon className="w-6 h-6 text-orange-400" />}>
                 <div className="flex items-center space-x-4">
                    <button onClick={() => setTheme('light')} className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        Light
                    </button>
                    <button onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        Dark
                    </button>
                </div>
            </SettingsCard>
            
            <SettingsCard title="Account" icon={<LockClosedIcon className="w-6 h-6 text-red-400" />}>
                <div className="space-y-4">
                    <button className="w-full text-left font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">Change Password</button>
                    <button className="w-full text-left font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors flex items-center">
                        <LogoutIcon className="w-5 h-5 mr-3" /> Log Out
                    </button>
                     <button className="w-full text-left font-medium text-red-400 hover:bg-red-500/20 p-3 rounded-lg transition-colors">Delete Account</button>
                </div>
            </SettingsCard>
        </div>
    );
};

export default Settings;
