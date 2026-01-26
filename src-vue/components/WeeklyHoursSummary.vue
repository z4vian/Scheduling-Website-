<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-5 shadow-sm">
    <h4 class="text-sm font-bold text-gray-900 mb-3">Weekly Hours Summary</h4>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div
        v-for="emp in employees"
        :key="emp.id"
        class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-sm font-medium text-gray-600">{{ emp.name }}</div>
        <div class="mt-1 text-2xl font-bold text-gray-900">
          {{ calculateEmployeeHours(emp.id).toFixed(1) }}h
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getWeekDates, formatDate, calculateShiftHours } from '../utils/dateUtils';

const props = defineProps({
  employees: Array,
  schedule: Object,
  currentWeekStart: Date,
  shiftTemplates: Object,
  getShiftTimes: Function,
});

const calculateEmployeeHours = (employeeId) => {
  let totalHours = 0;
  const weekDates = getWeekDates(props.currentWeekStart);

  weekDates.forEach((date) => {
    const dateStr = formatDate(date);
    Object.keys(props.shiftTemplates).forEach((shiftKey) => {
      if (props.schedule[dateStr]?.[shiftKey] === employeeId) {
        const shiftTimes = props.getShiftTimes(date, shiftKey);
        totalHours += calculateShiftHours(shiftTimes.start, shiftTimes.end);
      }
    });
  });

  return totalHours;
};
</script>

