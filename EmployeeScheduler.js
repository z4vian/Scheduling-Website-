import React, { useState } from 'react';
import { Calendar, Clock, Users, Play, Download, XCircle } from 'lucide-react';

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

  const startOfWeekSunday = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };

  const [shiftOverrides, setShiftOverrides] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeekSunday(new Date()));
  const [unavailability, setUnavailability] = useState({});
  const [closedDates, setClosedDates] = useState({});
  const [schedule, setSchedule] = useState({});
  const [activeTab, setActiveTab] = useState('calendar');

  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const formatDisplayDate = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getDayName = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short' });

  const toggleUnavailability = (employeeId, date) => {
    const dateStr = formatDate(date);
    const key = `${employeeId}-${dateStr}`;
    setUnavailability((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isUnavailable = (employeeId, date) => {
    const dateStr = formatDate(date);
    const key = `${employeeId}-${dateStr}`;
    return unavailability[key] || false;
  };

  const canWorkShift = (employeeId, shiftKey) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee || !employee.shiftAvailability) return true;
    if (employee.shiftAvailability.hasOwnProperty(shiftKey)) {
      return employee.shiftAvailability[shiftKey];
    }
    return true;
  };

  const toggleShiftAvailability = (employeeId, shiftKey) => {
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
  };

  const toggleStoreClosed = (date) => {
    const dateStr = formatDate(date);
    setClosedDates((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  const isStoreClosed = (date) => {
    const dateStr = formatDate(date);
    return closedDates[dateStr] || false;
  };

  const getShiftTimes = (date, shiftKey) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;

    if (shiftOverrides[overrideKey]) return shiftOverrides[overrideKey];

    return {
      start: shiftTemplates[shiftKey].defaultStart,
      end: shiftTemplates[shiftKey].defaultEnd,
    };
  };

  const calculateShiftHours = (start, end) => {
    const startHour = parseInt(start.split(':')[0]) + parseInt(start.split(':')[1]) / 60;
    const endHour = parseInt(end.split(':')[0]) + parseInt(end.split(':')[1]) / 60;
    return Math.max(0, endHour - startHour);
  };

  const setShiftOverride = (date, shiftKey, field, value) => {
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
  };

  const clearShiftOverride = (date, shiftKey) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;

    setShiftOverrides((prev) => {
      const updated = { ...prev };
      delete updated[overrideKey];
      return updated;
    });
  };

  const hasShiftOverride = (date, shiftKey) => {
    const dateStr = formatDate(date);
    const overrideKey = `${dateStr}-${shiftKey}`;
    return !!shiftOverrides[overrideKey];
  };

  const generateSchedule = () => {
    const newSchedule = {};
    const weekDates = getWeekDates(currentWeekStart);
    const employeeHours = {};

    employees.forEach((emp) => {
      employeeHours[emp.id] = 0;
    });

    const shiftKeys = Object.keys(shiftTemplates);

    weekDates.forEach((date) => {
      const dateStr = formatDate(date);
      newSchedule[dateStr] = {};

      if (isStoreClosed(date)) {
        shiftKeys.forEach((shiftKey) => {
          newSchedule[dateStr][shiftKey] = 'CLOSED';
        });
        return;
      }

      shiftKeys.forEach((shiftKey) => {
        const availableEmployees = employees.filter(
          (emp) => !isUnavailable(emp.id, date) && canWorkShift(emp.id, shiftKey)
        );

        if (availableEmployees.length > 0) {
          availableEmployees.sort((a, b) => employeeHours[a.id] - employeeHours[b.id]);
          const assignedEmployee = availableEmployees[0];
          newSchedule[dateStr][shiftKey] = assignedEmployee.id;

          const shiftTimes = getShiftTimes(date, shiftKey);
          const hours = calculateShiftHours(shiftTimes.start, shiftTimes.end);
          employeeHours[assignedEmployee.id] += hours;
        } else {
          newSchedule[dateStr][shiftKey] = null;
        }
      });
    });

    setSchedule(newSchedule);
  };

  const getScheduledEmployee = (date, shiftKey) => {
    const dateStr = formatDate(date);
    const employeeId = schedule[dateStr]?.[shiftKey];

    if (employeeId === 'CLOSED') return 'CLOSED';
    if (!employeeId) return null;

    return employees.find((emp) => emp.id === employeeId);
  };

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

  const updateDefaultShiftTemplate = (shiftKey, field, value) => {
    setShiftTemplates((prev) => ({
      ...prev,
      [shiftKey]: {
        ...prev[shiftKey],
        [field]: value,
      },
    }));
  };

  const addEmployee = () => {
    const name = prompt('Enter employee name:');
    if (name) {
      setEmployees((prev) => [
        ...prev,
        { id: Date.now(), name, shiftAvailability: {} },
      ]);
    }
  };

  const exportSchedule = () => {
    const weekDates = getWeekDates(currentWeekStart);
    let csv =
      'Date,Day,' + Object.values(shiftTemplates).map((s) => s.name).join(',') + '\n';

    weekDates.forEach((date) => {
      const dateStr = formatDate(date);
      let row = `${formatDisplayDate(date)},${getDayName(date)},`;
      Object.keys(shiftTemplates).forEach((shiftKey) => {
        const emp = getScheduledEmployee(date, shiftKey);
        if (emp === 'CLOSED') row += 'STORE CLOSED,';
        else row += (emp ? emp.name : 'UNASSIGNED') + ',';
      });
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule_${formatDate(currentWeekStart)}.csv`;
    a.click();
  };

  const weekDates = getWeekDates(currentWeekStart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Employee Scheduler
          </h1>
          <p className="mt-2 text-gray-600">
            Manage shifts and availability for your team
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'calendar'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Calendar size={18} />
                Calendar & Availability
              </button>
              <button
                onClick={() => setActiveTab('shifts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'shifts'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Clock size={18} />
                Shift Times
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'employees'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users size={18} />
                Employees
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                      onClick={() => {
                        const newDate = new Date(currentWeekStart);
                        newDate.setDate(newDate.getDate() - 7);
                        setCurrentWeekStart(startOfWeekSunday(newDate));
                      }}
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
                      onClick={() => {
                        const newDate = new Date(currentWeekStart);
                        newDate.setDate(newDate.getDate() + 7);
                        setCurrentWeekStart(startOfWeekSunday(newDate));
                      }}
                    >
                      Next Week →
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={generateSchedule}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                    >
                      <Play size={18} />
                      Generate Schedule
                    </button>
                    <button
                      onClick={exportSchedule}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      <Download size={18} />
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Store Closed Days
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {weekDates.map((date) => (
                      <button
                        key={formatDate(date)}
                        onClick={() => toggleStoreClosed(date)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
                          isStoreClosed(date)
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {isStoreClosed(date) && <XCircle size={16} />}
                        {getDayName(date)} {formatDisplayDate(date)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">
                      Employee Availability
                    </h3>
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
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {employee.name}
                            </td>

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
                                    onClick={() => toggleUnavailability(employee.id, date)}
                                    className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition ${
                                      isUnavailable(employee.id, date)
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                  >
                                    {isUnavailable(employee.id, date) ? 'Unavailable' : 'Available'}
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

                {Object.keys(schedule).length > 0 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">
                          Generated Schedule
                        </h3>
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
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  {shift.name}
                                </td>

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

                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">
                        Weekly Hours Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {employees.map((emp) => {
                          const hours = calculateEmployeeHours(emp.id);
                          return (
                            <div key={emp.id} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="text-sm font-medium text-gray-600">{emp.name}</div>
                              <div className="mt-1 text-2xl font-bold text-gray-900">
                                {hours.toFixed(1)}h
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shifts' && (
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
                            onChange={(e) => updateDefaultShiftTemplate(key, 'defaultStart', e.target.value)}
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
                            onChange={(e) => updateDefaultShiftTemplate(key, 'defaultEnd', e.target.value)}
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
                                    onChange={(e) => setShiftOverride(date, shiftKey, 'start', e.target.value)}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />

                                  <input
                                    type="time"
                                    value={shiftTimes.end}
                                    onChange={(e) => setShiftOverride(date, shiftKey, 'end', e.target.value)}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />

                                  <div className="text-sm font-bold text-blue-600">
                                    {hours.toFixed(1)} hours
                                  </div>

                                  <div>
                                    {isOverridden && (
                                      <button
                                        onClick={() => clearShiftOverride(date, shiftKey)}
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
            )}

            {activeTab === 'employees' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Employee Management</h3>
                  <button
                    onClick={addEmployee}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    + Add Employee
                  </button>
                </div>

                <div className="space-y-6">
                  {employees.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-bold text-gray-900 text-lg">{emp.name}</div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Remove ${emp.name}?`)) {
                              setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
                          Shift Type Availability
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(shiftTemplates).map(([shiftKey, shift]) => {
                            const canWork = canWorkShift(emp.id, shiftKey);
                            return (
                              <button
                                key={shiftKey}
                                onClick={() => toggleShiftAvailability(emp.id, shiftKey)}
                                className={`rounded-lg p-4 text-left border-2 transition ${
                                  canWork
                                    ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                    : 'bg-red-50 border-red-300 hover:bg-red-100'
                                }`}
                              >
                                <div className="font-bold text-sm text-gray-900">{shift.name}</div>
                                <div
                                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    canWork
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {canWork ? '✓ Can work' : '✗ Cannot work'}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeScheduler;