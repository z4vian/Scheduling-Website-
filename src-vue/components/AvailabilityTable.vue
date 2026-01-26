<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
    <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h3 class="text-lg font-bold text-gray-900">Employee Availability</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
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
              <div v-if="isStoreClosed(date)" class="text-xs font-bold text-gray-600 mt-1">CLOSED</div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-medium text-gray-900">{{ employee.name }}</td>

            <td
              v-for="date in weekDates"
              :key="formatDate(date)"
              :class="['px-4 py-3 text-center', isStoreClosed(date) ? 'bg-gray-50' : '']"
            >
              <span
                v-if="isStoreClosed(date)"
                class="inline-block px-3 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium text-sm"
              >
                N/A
              </span>
              <button
                v-else
                @click="$emit('toggle', employee.id, date)"
                :class="[
                  'w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow',
                  isUnavailable(employee.id, date)
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                ]"
              >
                {{ isUnavailable(employee.id, date) ? 'Unavailable' : 'Available' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatDate, formatDisplayDate, getDayName } from '../utils/dateUtils';

const props = defineProps({
  employees: Array,
  weekDates: Array,
  unavailability: Object,
  isStoreClosed: Function,
});

defineEmits(['toggle']);

const isUnavailable = (employeeId, date) => {
  const dateStr = formatDate(date);
  const key = `${employeeId}-${dateStr}`;
  return props.unavailability[key] || false;
};
</script>

