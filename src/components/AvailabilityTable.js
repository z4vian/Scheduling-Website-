import React from 'react';
import { formatDate, formatDisplayDate, getDayName } from '../utils/dateUtils';

const AvailabilityTable = ({
  employees,
  weekDates,
  unavailability,
  onToggleUnavailability,
  isStoreClosed,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Employee Availability</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
              {weekDates.map((date) => (
                <th
                  key={formatDate(date)}
                  className={`px-4 py-3 text-center font-semibold text-gray-700 ${
                    isStoreClosed(date) ? 'bg-gray-100' : ''
                  }`}
                >
                  <div>{getDayName(date)}</div>
                  <div className="text-xs text-gray-500 font-normal">{formatDisplayDate(date)}</div>
                  {isStoreClosed(date) && (
                    <div className="text-xs font-bold text-gray-600 mt-1">CLOSED</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{employee.name}</td>

                {weekDates.map((date) => (
                  <td
                    key={formatDate(date)}
                    className={`px-4 py-3 text-center ${
                      isStoreClosed(date) ? 'bg-gray-50' : ''
                    }`}
                  >
                    {isStoreClosed(date) ? (
                      <span className="inline-block px-3 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium text-sm">
                        N/A
                      </span>
                    ) : (
                      <button
                        onClick={() => onToggleUnavailability(employee.id, date)}
                        className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition ${
                          unavailability[`${employee.id}-${formatDate(date)}`]
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {unavailability[`${employee.id}-${formatDate(date)}`]
                          ? 'Unavailable'
                          : 'Available'}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailabilityTable;

