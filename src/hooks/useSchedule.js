import { useState, useCallback } from 'react';
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

export const useSchedule = (employees, shiftTemplates, currentWeekStart, unavailability, closedDates) => {
  const [schedule, setSchedule] = useState({});

  const canWorkShift = useCallback((employeeId, shiftKey) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee || !employee.shiftAvailability) return true;
    if (employee.shiftAvailability.hasOwnProperty(shiftKey)) {
      return employee.shiftAvailability[shiftKey];
    }
    return true;
  }, [employees]);

  const isUnavailable = useCallback((employeeId, date) => {
    const dateStr = formatDate(date);
    const key = `${employeeId}-${dateStr}`;
    return unavailability[key] || false;
  }, [unavailability]);

  const isStoreClosed = useCallback((date) => {
    const dateStr = formatDate(date);
    return closedDates[dateStr] || false;
  }, [closedDates]);

  const generateSchedule = useCallback((getShiftTimes) => {
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
          (emp) => 
            !isUnavailable(emp.id, date) && 
            canWorkShift(emp.id, shiftKey) &&
            !isAlreadyAssignedInBlock(emp.id, dateStr, shiftKey, newSchedule, shiftTemplates)
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
  }, [employees, shiftTemplates, currentWeekStart, isUnavailable, isStoreClosed, canWorkShift]);

  return {
    schedule,
    setSchedule,
    generateSchedule,
    canWorkShift,
    isUnavailable,
    isStoreClosed,
  };
};

