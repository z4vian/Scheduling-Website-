import React from 'react';
import { formatDate, formatDisplayDate, getDayName, calculateShiftHours } from '../utils/dateUtils';

const ShiftsTab = ({
  shiftTemplates,
  onUpdateDefaultShiftTemplate,
  weekDates,
  shiftOverrides,
  onSetShiftOverride,
  onClearShiftOverride,
  hasShiftOverride,
  getShiftTimes,
  isStoreClosed,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Default Shift Times</h3>
        <p className="mt-1 text-gray-600">
          Set default times for each shift. You can override these for specific days below.
        </p>
      </div>

      <div className="space-y-3">
        {Object.entries(shiftTemplates).map(([key, shift]) => (
          <div key={key} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="font-bold text-gray-900">{shift.name}</div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Default Start
                </label>
                <input
                  type="time"
                  value={shift.defaultStart}
                  onChange={(e) => onUpdateDefaultShiftTemplate(key, 'defaultStart', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Default End
                </label>
                <input
                  type="time"
                  value={shift.defaultEnd}
                  onChange={(e) => onUpdateDefaultShiftTemplate(key, 'defaultEnd', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900">Day-Specific Shift Overrides</h3>
        <p className="mt-1 text-gray-600">Customize shift times for specific days of the week.</p>
      </div>

      <div className="space-y-4">
        {weekDates.map((date) => (
          <div key={formatDate(date)} className="bg-white rounded-lg border border-gray-200 p-5">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              {getDayName(date)} {formatDisplayDate(date)}
              {isStoreClosed(date) && (
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  Store Closed
                </span>
              )}
            </h4>

            {!isStoreClosed(date) && (
              <div className="space-y-3">
                {Object.entries(shiftTemplates).map(([shiftKey, shift]) => {
                  const shiftTimes = getShiftTimes(date, shiftKey);
                  const isOverridden = hasShiftOverride(date, shiftKey);
                  const hours = calculateShiftHours(shiftTimes.start, shiftTimes.end);

                  return (
                    <div
                      key={shiftKey}
                      className={`rounded-lg p-4 border ${
                        isOverridden ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                        <div className="font-medium text-gray-900 text-sm">{shift.name}</div>

                        <input
                          type="time"
                          value={shiftTimes.start}
                          onChange={(e) => onSetShiftOverride(date, shiftKey, 'start', e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                          type="time"
                          value={shiftTimes.end}
                          onChange={(e) => onSetShiftOverride(date, shiftKey, 'end', e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="text-sm font-bold text-blue-600">{hours.toFixed(1)} hours</div>

                        <div>
                          {isOverridden && (
                            <button
                              onClick={() => onClearShiftOverride(date, shiftKey)}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftsTab;

