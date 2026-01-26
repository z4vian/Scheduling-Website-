<template>
  <div class="flex items-center gap-3">
    <button
      @click="handlePreviousWeek"
      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition shadow-sm hover:shadow"
    >
      ← Previous Week
    </button>

    <div class="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
      <div class="text-xs font-semibold text-blue-600">Week of</div>
      <div class="text-sm font-bold text-gray-900">
        {{ formatDisplayDate(currentWeekStart) }}
      </div>
    </div>

    <button
      @click="handleNextWeek"
      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition shadow-sm hover:shadow"
    >
      Next Week →
    </button>
  </div>
</template>

<script setup>
import { startOfWeekSunday, formatDisplayDate } from '../utils/dateUtils';

const props = defineProps({
  currentWeekStart: Date,
});

const emit = defineEmits(['update:currentWeekStart']);

const handlePreviousWeek = () => {
  const newDate = new Date(props.currentWeekStart);
  newDate.setDate(newDate.getDate() - 7);
  emit('update:currentWeekStart', startOfWeekSunday(newDate));
};

const handleNextWeek = () => {
  const newDate = new Date(props.currentWeekStart);
  newDate.setDate(newDate.getDate() + 7);
  emit('update:currentWeekStart', startOfWeekSunday(newDate));
};
</script>

