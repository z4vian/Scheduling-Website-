import { ref, computed } from 'vue';
import { formatDate, getWeekDates, calculateShiftHours } from '../utils/dateUtils';

export function useSchedule(employees, shiftTemplates, currentWeekStart, unavailability, closedDates) {
  const schedule = ref({});

  const canWorkShift = (employeeId, shiftKey) => {
    const employee = employees.value.find((emp) => emp.id === employeeId);
    if (!employee || !employee.shiftAvailability) return true;
    if (employee.shiftAvailability.hasOwnProperty(shiftKey)) {
      return employee.shiftAvailability[shiftKey];
    }
    return true;
  };

  const isUnavailable = (employeeId, date) => {
    const dateStr = formatDate(date);
    const key = `${employeeId}-${dateStr}`;
    return unavailability.value[key] || false;
  };

  const isStoreClosed = (date) => {
    const dateStr = formatDate(date);
    return closedDates.value[dateStr] || false;
  };

  const generateSchedule = (getShiftTimes) => {
    const newSchedule = {};
    const weekDates = getWeekDates(currentWeekStart.value);
    const employeeHours = {};

    employees.value.forEach((emp) => {
      employeeHours[emp.id] = 0;
    });

    const shiftKeys = Object.keys(shiftTemplates.value);

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
        const availableEmployees = employees.value.filter(
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

    schedule.value = newSchedule;
  };

  return {
    schedule,
    generateSchedule,
    canWorkShift,
    isUnavailable,
    isStoreClosed,
  };
}

