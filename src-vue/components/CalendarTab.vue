<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <WeekNavigator
        :currentWeekStart="currentWeekStart"
        @update:currentWeekStart="$emit('update:currentWeekStart', $event)"
      />

      <div class="flex gap-3">
        <button
          @click="$emit('generate')"
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Play :size="18" />
          Generate Schedule
        </button>
        <button
          @click="$emit('export')"
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Download :size="18" />
          Export CSV
        </button>
      </div>
    </div>

    <StoreClosedSection
      :weekDates="weekDates"
      :closedDates="closedDates"
      @toggle="$emit('toggleStoreClosed', $event)"
    />

    <AvailabilityTable
      :employees="employees"
      :weekDates="weekDates"
      :unavailability="unavailability"
      :isStoreClosed="isStoreClosed"
      @toggle="(employeeId, date) => $emit('toggleUnavailability', employeeId, date)"
    />

    <div v-if="Object.keys(schedule).length > 0" class="space-y-6">
      <ScheduleTable
        :schedule="schedule"
        :employees="employees"
        :shiftTemplates="shiftTemplates"
        :weekDates="weekDates"
        :getShiftTimes="getShiftTimes"
        :isStoreClosed="isStoreClosed"
      />

      <WeeklyHoursSummary
        :employees="employees"
        :schedule="schedule"
        :currentWeekStart="currentWeekStart"
        :shiftTemplates="shiftTemplates"
        :getShiftTimes="getShiftTimes"
      />
    </div>
  </div>
</template>

<script setup>
import { Play, Download } from 'lucide-vue-next';
import WeekNavigator from './WeekNavigator.vue';
import StoreClosedSection from './StoreClosedSection.vue';
import AvailabilityTable from './AvailabilityTable.vue';
import ScheduleTable from './ScheduleTable.vue';
import WeeklyHoursSummary from './WeeklyHoursSummary.vue';

defineProps({
  currentWeekStart: Date,
  weekDates: Array,
  employees: Array,
  unavailability: Object,
  closedDates: Object,
  isStoreClosed: Function,
  schedule: Object,
  shiftTemplates: Object,
  getShiftTimes: Function,
});

defineEmits(['update:currentWeekStart', 'generate', 'export', 'toggleStoreClosed', 'toggleUnavailability']);
</script>

