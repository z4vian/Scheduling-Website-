import React from 'react';
import { formatDate, formatDisplayDate, getDayName, calculateShiftHours } from '../utils/dateUtils';

const ScheduleTable = ({
  schedule,
  employees,
  shiftTemplates,
  weekDates,
  getShiftTimes,
  isStoreClosed,
}) => {
  const getScheduledEmployee = (date, shiftKey) => {
    const dateStr = formatDate(date);
    const employeeId = schedule[dateStr]?.[shiftKey];

    if (employeeId === 'CLOSED') return 'CLOSED';
    if (!employeeId) return null;

    return employees.find((emp) => emp.id === employeeId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Generated Schedule</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Shift</th>
              {weekDates.map((date) => (
                <th
                  key={formatDate(date)}
                  className={`px-4 py-3 text-center font-semibold text-gray-700 ${
                    isStoreClosed(date) ? 'bg-gray-100' : ''
                  }`}
                >
                  <div>{getDayName(date)}</div>
                  <div className="text-xs text-gray-500 font-normal">{formatDisplayDate(date)}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {Object.entries(shiftTemplates).map(([shiftKey, shift]) => (
              <tr key={shiftKey} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{shift.name}</td>

                {weekDates.map((date) => {
                  const emp = getScheduledEmployee(date, shiftKey);
                  const shiftTimes = getShiftTimes(date, shiftKey);
                  const hours = calculateShiftHours(shiftTimes.start, shiftTimes.end);

                  return (
                    <td key={formatDate(date)} className="px-4 py-3 text-center">
                      {emp === 'CLOSED' ? (
                        <span className="inline-block px-3 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold text-sm">
                          CLOSED
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <div
                            className={`px-3 py-2 rounded-lg font-medium text-sm ${
                              emp
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {emp ? emp.name : 'UNASSIGNED'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {shiftTimes.start} - {shiftTimes.end} ({hours}h)
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;

