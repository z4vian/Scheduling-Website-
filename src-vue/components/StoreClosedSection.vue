<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-5 shadow-sm">
    <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
      <XCircle :size="20" class="text-gray-600" />
      Store Closed Days
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="date in weekDates"
        :key="formatDate(date)"
        @click="$emit('toggle', date)"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm',
          isStoreClosed(date)
            ? 'bg-gray-900 text-white shadow-md transform scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:shadow'
        ]"
      >
        <XCircle v-if="isStoreClosed(date)" :size="16" />
        {{ getDayName(date) }} {{ formatDisplayDate(date) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { XCircle } from 'lucide-vue-next';
import { formatDate, formatDisplayDate, getDayName } from '../utils/dateUtils';

const props = defineProps({
  weekDates: Array,
  closedDates: Object,
});

defineEmits(['toggle']);

const isStoreClosed = (date) => {
  const dateStr = formatDate(date);
  return props.closedDates[dateStr] || false;
};
</script>

