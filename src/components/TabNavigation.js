import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'calendar', label: 'Calendar & Availability', icon: Calendar },
    { id: 'shifts', label: 'Shift Times', icon: Clock },
    { id: 'employees', label: 'Employees', icon: Users },
  ];

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="flex gap-1 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;

