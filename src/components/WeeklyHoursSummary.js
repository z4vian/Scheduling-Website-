import React from 'react';
import { getWeekDates, formatDate, calculateShiftHours } from '../utils/dateUtils';

const WeeklyHoursSummary = ({
  employees,
  schedule,
  currentWeekStart,
  shiftTemplates,
  getShiftTimes,
}) => {
  const calculateEmployeeHours = (employeeId) => {
    let totalHours = 0;
    const weekDates = getWeekDates(currentWeekStart);

    weekDates.forEach((date) => {
      const dateStr = formatDate(date);
      Object.keys(shiftTemplates).forEach((shiftKey) => {
        if (schedule[dateStr]?.[shiftKey] === employeeId) {
          const shiftTimes = getShiftTimes(date, shiftKey);
          totalHours += calculateShiftHours(shiftTimes.start, shiftTimes.end);
        }
      });
    });

    return totalHours;
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h4 className="text-sm font-bold text-gray-900 mb-3">Weekly Hours Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {employees.map((emp) => {
          const hours = calculateEmployeeHours(emp.id);
          return (
            <div key={emp.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600">{emp.name}</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">{hours.toFixed(1)}h</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyHoursSummary;

