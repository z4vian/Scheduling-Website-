<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-bold text-gray-900">Default Shift Times</h3>
      <p class="mt-1 text-gray-600">
        Set default times for each shift. You can override these for specific days below.
      </p>
    </div>

    <div class="space-y-3">
      <div
        v-for="[key, shift] in Object.entries(shiftTemplates)"
        :key="key"
        class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div class="font-bold text-gray-900">{{ shift.name }}</div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Default Start</label>
            <input
              type="time"
              :value="shift.defaultStart"
              @input="$emit('updateDefault', key, 'defaultStart', $event.target.value)"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Default End</label>
            <input
              type="time"
              :value="shift.defaultEnd"
              @input="$emit('updateDefault', key, 'defaultEnd', $event.target.value)"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-bold text-gray-900">Day-Specific Shift Overrides</h3>
      <p class="mt-1 text-gray-600">Customize shift times for specific days of the week.</p>
    </div>

    <div class="space-y-4">
      <div
        v-for="date in weekDates"
        :key="formatDate(date)"
        class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <h4 class="font-bold text-gray-900 flex items-center gap-2 mb-4">
          {{ getDayName(date) }} {{ formatDisplayDate(date) }}
          <span
            v-if="isStoreClosed(date)"
            class="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
          >
            Store Closed
          </span>
        </h4>

        <div v-if="!isStoreClosed(date)" class="space-y-3">
          <div
            v-for="[shiftKey, shift] in Object.entries(shiftTemplates)"
            :key="shiftKey"
            :class="[
              'rounded-lg p-4 border shadow-sm transition-all',
              hasShiftOverride(date, shiftKey)
                ? 'bg-amber-50 border-amber-300'
                : 'bg-gray-50 border-gray-200'
            ]"
          >
            <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div class="font-medium text-gray-900 text-sm">{{ shift.name }}</div>

              <input
                type="time"
                :value="getShiftTimes(date, shiftKey).start"
                @input="$emit('setOverride', date, shiftKey, 'start', $event.target.value)"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />

              <input
                type="time"
                :value="getShiftTimes(date, shiftKey).end"
                @input="$emit('setOverride', date, shiftKey, 'end', $event.target.value)"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />

              <div class="text-sm font-bold text-blue-600">
                {{ calculateShiftHours(getShiftTimes(date, shiftKey).start, getShiftTimes(date, shiftKey).end).toFixed(1) }}
                hours
              </div>

              <div>
                <button
                  v-if="hasShiftOverride(date, shiftKey)"
                  @click="$emit('clearOverride', date, shiftKey)"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition shadow-sm hover:shadow"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate, formatDisplayDate, getDayName, calculateShiftHours } from '../utils/dateUtils';

const props = defineProps({
  shiftTemplates: Object,
  weekDates: Array,
  getShiftTimes: Function,
  hasShiftOverride: Function,
  isStoreClosed: Function,
});

defineEmits(['updateDefault', 'setOverride', 'clearOverride']);
</script>

