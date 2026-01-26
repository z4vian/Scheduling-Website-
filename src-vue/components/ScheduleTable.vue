<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
    <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h3 class="text-lg font-bold text-gray-900">Generated Schedule</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">Shift</th>
            <th
              v-for="date in weekDates"
              :key="formatDate(date)"
              :class="[
                'px-4 py-3 text-center font-semibold text-gray-700',
                isStoreClosed(date) ? 'bg-gray-100' : ''
              ]"
            >
              <div>{{ getDayName(date) }}</div>
              <div class="text-xs text-gray-500 font-normal">{{ formatDisplayDate(date) }}</div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="[shiftKey, shift] in Object.entries(shiftTemplates)"
            :key="shiftKey"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ shift.name }}</td>

            <td v-for="date in weekDates" :key="formatDate(date)" class="px-4 py-3 text-center">
              <div v-if="getScheduledEmployee(date, shiftKey) === 'CLOSED'">
                <span class="inline-block px-3 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold text-sm shadow-sm">
                  CLOSED
                </span>
              </div>
              <div v-else class="space-y-1">
                <div
                  :class="[
                    'px-3 py-2 rounded-lg font-medium text-sm shadow-sm',
                    getScheduledEmployee(date, shiftKey)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-500'
                  ]"
                >
                  {{ getScheduledEmployee(date, shiftKey)?.name || 'UNASSIGNED' }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ getShiftTimes(date, shiftKey).start }} - {{ getShiftTimes(date, shiftKey).end }}
                  ({{ calculateShiftHours(getShiftTimes(date, shiftKey).start, getShiftTimes(date, shiftKey).end) }}h)
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatDate, formatDisplayDate, getDayName, calculateShiftHours } from '../utils/dateUtils';

const props = defineProps({
  schedule: Object,
  employees: Array,
  shiftTemplates: Object,
  weekDates: Array,
  getShiftTimes: Function,
  isStoreClosed: Function,
});

const getScheduledEmployee = (date, shiftKey) => {
  const dateStr = formatDate(date);
  const employeeId = props.schedule[dateStr]?.[shiftKey];

  if (employeeId === 'CLOSED') return 'CLOSED';
  if (!employeeId) return null;

  return props.employees.find((emp) => emp.id === employeeId);
};
</script>

