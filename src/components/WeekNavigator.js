import React from 'react';
import { startOfWeekSunday, formatDisplayDate } from '../utils/dateUtils';

const WeekNavigator = ({ currentWeekStart, onWeekChange }) => {
  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(startOfWeekSunday(newDate));
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(startOfWeekSunday(newDate));
  };

  return (
    <div className="flex items-center gap-3">
      <button
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
        onClick={handlePreviousWeek}
      >
        ← Previous Week
      </button>

      <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-semibold text-blue-600">Week of</div>
        <div className="text-sm font-bold text-gray-900">
          {formatDisplayDate(currentWeekStart)}
        </div>
      </div>

      <button
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
        onClick={handleNextWeek}
      >
        Next Week →
      </button>
    </div>
  );
};

export default WeekNavigator;

