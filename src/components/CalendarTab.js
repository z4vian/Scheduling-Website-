import React from 'react';
import { Play, Download } from 'lucide-react';
import WeekNavigator from './WeekNavigator';
import StoreClosedSection from './StoreClosedSection';
import AvailabilityTable from './AvailabilityTable';
import ScheduleTable from './ScheduleTable';
import WeeklyHoursSummary from './WeeklyHoursSummary';

const CalendarTab = ({
  currentWeekStart,
  onWeekChange,
  weekDates,
  employees,
  dayAvailability,
  onToggleDayAvailability,
  closedDates,
  onToggleStoreClosed,
  isStoreClosed,
  schedule,
  shiftTemplates,
  getShiftTimes,
  onGenerateSchedule,
  onExportSchedule,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <WeekNavigator
          currentWeekStart={currentWeekStart}
          onWeekChange={onWeekChange}
        />

        <div className="flex gap-3">
          <button
            onClick={onGenerateSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
          >
            <Play size={18} />
            Generate Schedule
          </button>
          <button
            onClick={onExportSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <StoreClosedSection
        weekDates={weekDates}
        closedDates={closedDates}
        onToggleStoreClosed={onToggleStoreClosed}
      />

      <AvailabilityTable
        employees={employees}
        weekDates={weekDates}
        dayAvailability={dayAvailability}
        onToggleDayAvailability={onToggleDayAvailability}
        isStoreClosed={isStoreClosed}
      />

      {Object.keys(schedule).length > 0 && (
        <div className="space-y-6">
          <ScheduleTable
            schedule={schedule}
            employees={employees}
            shiftTemplates={shiftTemplates}
            weekDates={weekDates}
            getShiftTimes={getShiftTimes}
            isStoreClosed={isStoreClosed}
          />

          <WeeklyHoursSummary
            employees={employees}
            schedule={schedule}
            currentWeekStart={currentWeekStart}
            shiftTemplates={shiftTemplates}
            getShiftTimes={getShiftTimes}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarTab;

