import { ref, computed } from 'vue';
import { formatDate, getWeekDates, calculateShiftHours } from '../utils/dateUtils';

// Helper function to determine which block a shift belongs to
const getShiftBlock = (shiftKey) => {
  if (shiftKey.startsWith('morning')) {
    return 'morning';
  }
  if (shiftKey.startsWith('dinner')) {
    return 'dinner';
  }
  // Default: each shift is its own block if not morning/dinner
  return shiftKey;
};

// Helper function to check if an employee is already assigned to a shift in the same block for a given date
const isAlreadyAssignedInBlock = (employeeId, dateStr, shiftKey, schedule, shiftTemplates) => {
  const block = getShiftBlock(shiftKey);
  const daySchedule = schedule[dateStr] || {};
  
  // Check all shifts in the same block
  return Object.keys(shiftTemplates).some((otherShiftKey) => {
    if (otherShiftKey === shiftKey) return false; // Don't check the same shift
    if (getShiftBlock(otherShiftKey) !== block) return false; // Different block
    
    const assignedEmployeeId = daySchedule[otherShiftKey];
    return assignedEmployeeId === employeeId;
  });
};

// Helper function to check if an employee can work a specific shift based on their day availability preference
const canWorkShiftBlock = (employeeId, dateStr, shiftKey, dayAvailability) => {
  const key = `${employeeId}-${dateStr}`;
  const availability = dayAvailability.value[key] || 'all';
  const shiftBlock = getShiftBlock(shiftKey);
  
  // If availability is 'unavailable', they cannot work any shift
  if (availability === 'unavailable') return false;
  
  // If availability is 'all', they can work any shift
  if (availability === 'all') return true;
  
  // If availability is 'morning', they can only work morning shifts
  if (availability === 'morning') return shiftBlock === 'morning';
  
  // If availability is 'dinner', they can only work dinner shifts
  if (availability === 'dinner') return shiftBlock === 'dinner';
  
  // Default: allow
  return true;
};

export function useSchedule(employees, shiftTemplates, currentWeekStart, dayAvailability, closedDates) {
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
    // This function is kept for backward compatibility but now checks day availability
    const dateStr = formatDate(date);
    const key = `${employeeId}-${dateStr}`;
    const availability = dayAvailability.value[key] || 'all';
    // If availability is explicitly set to something other than 'all', they're not "unavailable"
    // but their availability is restricted. This function now returns false (available)
    // since we handle restrictions in canWorkShiftBlock
    return false;
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
          (emp) => 
            canWorkShiftBlock(emp.id, dateStr, shiftKey, dayAvailability) &&
            canWorkShift(emp.id, shiftKey) &&
            !isAlreadyAssignedInBlock(emp.id, dateStr, shiftKey, newSchedule, shiftTemplates.value)
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

