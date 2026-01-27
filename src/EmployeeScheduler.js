import React, { useState, useCallback } from 'react';
import { formatDate, formatDisplayDate, getDayName, getWeekDates, startOfWeekSunday } from './utils/dateUtils';
import { useSchedule } from './hooks/useSchedule';
import TabNavigation from './components/TabNavigation';
import CalendarTab from './components/CalendarTab';
import ShiftsTab from './components/ShiftsTab';
import EmployeesTab from './components/EmployeesTab';

const EmployeeScheduler = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Yuki', shiftAvailability: {} },
    { id: 2, name: 'Jesse', shiftAvailability: {} },
    { id: 3, name: 'Fred', shiftAvailability: {} },
    { id: 4, name: 'Andrea', shiftAvailability: {} },
    { id: 5, name: 'Zavian', shiftAvailability: {} },
    { id: 6, name: 'Trey', shiftAvailability: {} },
    { id: 7, name: 'Ysa', shiftAvailability: {} },
  ]);

  const [shiftTemplates, setShiftTemplates] = useState({
    morningA: { name: 'Morning A (Opening)', defaultStart: '6:00', defaultEnd: '11:00' },
    morningB: { name: 'Morning B (Closing)', defaultStart: '8:00', defaultEnd: '14:00' },
    dinnerA: { name: 'Dinner A (Early)', defaultStart: '15:00', defaultEnd: '19:00' },
    dinnerB: { name: 'Dinner B (Middle)', defaultStart: '16:00', defaultEnd: '21:00' },
    dinnerC: { name: 'Dinner C (Closing)', defaultStart: '17:00', defaultEnd: '23:00' },
  });

  const [shiftOverrides, setShiftOverrides] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeekSunday(new Date()));
  // dayAvailability: { "employeeId-dateStr": "all" | "morning" | "dinner" }
  // undefined/null means "all" (default)
  const [dayAvailability, setDayAvailability] = useState({});
  const [closedDates, setClosedDates] = useState({});
  const [activeTab, setActiveTab] = useState('calendar');

  const weekDates = getWeekDates(currentWeekStart);

  const {
    schedule,
    generateSchedule: generateScheduleHook,
    canWorkShift,
    isUnavailable,
    isStoreClosed,
  } = useSchedule(employees, shiftTemplates, currentWeekStart, dayAvailability, closedDates);

  const toggleDayAvailability = useCallback((employeeId, date) => {
    const dateStr = formatDate(date);
    const key = `${employeeId}-${dateStr}`;
    const currentValue = dayAvailability[key] || 'all';
    
    // Cycle through: all -> morning -> dinner -> all
    const nextValue = 
      currentValue === 'all' ? 'morning' :
      currentValue === 'morning' ? 'dinner' :
      'all';
    
    if (nextValue === 'all') {
      // Remove the key if it's back to 'all' (default state)
      setDayAvailability((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } else {
      setDayAvailability((prev) => ({ ...prev, [key]: nextValue }));
    }
  }, [dayAvailability]);

  const toggleStoreClosed = useCallback((date) => {
    const dateStr = formatDate(date);
    setClosedDates((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  }, []);

  const getShiftTimes = useCallback((date, shiftKey) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;

    if (shiftOverrides[overrideKey]) return shiftOverrides[overrideKey];

    return {
      start: shiftTemplates[shiftKey].defaultStart,
      end: shiftTemplates[shiftKey].defaultEnd,
    };
  }, [shiftOverrides, shiftTemplates]);

  const setShiftOverride = useCallback((date, shiftKey, field, value) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;

    setShiftOverrides((prev) => {
      const current = prev[overrideKey] || getShiftTimes(date, shiftKey);
      return {
        ...prev,
        [overrideKey]: {
          ...current,
          [field]: value,
        },
      };
    });
  }, [getShiftTimes]);

  const clearShiftOverride = useCallback((date, shiftKey) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;

    setShiftOverrides((prev) => {
      const updated = { ...prev };
      delete updated[overrideKey];
      return updated;
    });
  }, []);

  const hasShiftOverride = useCallback((date, shiftKey) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;
    return !!shiftOverrides[overrideKey];
  }, [shiftOverrides]);

  const updateDefaultShiftTemplate = useCallback((shiftKey, field, value) => {
    setShiftTemplates((prev) => ({
      ...prev,
      [shiftKey]: {
        ...prev[shiftKey],
        [field]: value,
      },
    }));
  }, []);

  const toggleShiftAvailability = useCallback((employeeId, shiftKey) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const currentAvailability = emp.shiftAvailability || {};
          const currentValue = currentAvailability.hasOwnProperty(shiftKey)
            ? currentAvailability[shiftKey]
            : true;

          return {
            ...emp,
            shiftAvailability: {
              ...currentAvailability,
              [shiftKey]: !currentValue,
            },
          };
        }
        return emp;
      })
    );
  }, []);

  const addEmployee = useCallback(() => {
    const name = prompt('Enter employee name:');
    if (name) {
      setEmployees((prev) => [
        ...prev,
        { id: Date.now(), name, shiftAvailability: {} },
      ]);
    }
  }, []);

  const removeEmployee = useCallback((employeeId) => {
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
  }, []);

  const handleGenerateSchedule = useCallback(() => {
    generateScheduleHook(getShiftTimes);
  }, [generateScheduleHook, getShiftTimes]);

  const exportSchedule = useCallback(() => {
    let csv =
      'Date,Day,' + Object.values(shiftTemplates).map((s) => s.name).join(',') + '\n';

    weekDates.forEach((date) => {
      const dateStr = formatDate(date);
      let row = `${formatDisplayDate(date)},${getDayName(date)},`;
      Object.keys(shiftTemplates).forEach((shiftKey) => {
        const employeeId = schedule[dateStr]?.[shiftKey];
        if (employeeId === 'CLOSED') row += 'STORE CLOSED,';
        else {
          const emp = employeeId ? employees.find((e) => e.id === employeeId) : null;
          row += (emp ? emp.name : 'UNASSIGNED') + ',';
        }
      });
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule_${formatDate(currentWeekStart)}.csv`;
    a.click();
  }, [schedule, employees, shiftTemplates, weekDates, currentWeekStart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Employee Scheduler</h1>
          <p className="mt-2 text-gray-600">Manage shifts and availability for your team</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-6">
            {activeTab === 'calendar' && (
              <CalendarTab
                currentWeekStart={currentWeekStart}
                onWeekChange={setCurrentWeekStart}
                weekDates={weekDates}
                employees={employees}
                dayAvailability={dayAvailability}
                onToggleDayAvailability={toggleDayAvailability}
                closedDates={closedDates}
                onToggleStoreClosed={toggleStoreClosed}
                isStoreClosed={isStoreClosed}
                schedule={schedule}
                shiftTemplates={shiftTemplates}
                getShiftTimes={getShiftTimes}
                onGenerateSchedule={handleGenerateSchedule}
                onExportSchedule={exportSchedule}
              />
            )}

            {activeTab === 'shifts' && (
              <ShiftsTab
                shiftTemplates={shiftTemplates}
                onUpdateDefaultShiftTemplate={updateDefaultShiftTemplate}
                weekDates={weekDates}
                shiftOverrides={shiftOverrides}
                onSetShiftOverride={setShiftOverride}
                onClearShiftOverride={clearShiftOverride}
                hasShiftOverride={hasShiftOverride}
                getShiftTimes={getShiftTimes}
                isStoreClosed={isStoreClosed}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesTab
                employees={employees}
                shiftTemplates={shiftTemplates}
                onAddEmployee={addEmployee}
                onRemoveEmployee={removeEmployee}
                canWorkShift={canWorkShift}
                onToggleShiftAvailability={toggleShiftAvailability}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeScheduler;
