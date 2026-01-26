<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-8">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Employee Scheduler
        </h1>
        <p class="mt-3 text-lg text-gray-600">
          Manage shifts and availability for your team with ease
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <TabNavigation :activeTab="activeTab" @update:activeTab="activeTab = $event" />

        <div class="p-6">
          <CalendarTab
            v-if="activeTab === 'calendar'"
            :currentWeekStart="currentWeekStart"
            :weekDates="weekDates"
            :employees="employees"
            :unavailability="unavailability"
            :closedDates="closedDates"
            :schedule="schedule"
            :shiftTemplates="shiftTemplates"
            :isStoreClosed="isStoreClosed"
            :getShiftTimes="getShiftTimes"
            @update:currentWeekStart="currentWeekStart = $event"
            @generate="handleGenerateSchedule"
            @export="exportSchedule"
            @toggleStoreClosed="toggleStoreClosed"
            @toggleUnavailability="toggleUnavailability"
          />

          <ShiftsTab
            v-if="activeTab === 'shifts'"
            :shiftTemplates="shiftTemplates"
            :weekDates="weekDates"
            :getShiftTimes="getShiftTimes"
            :hasShiftOverride="hasShiftOverride"
            :isStoreClosed="isStoreClosed"
            @updateDefault="updateDefaultShiftTemplate"
            @setOverride="setShiftOverride"
            @clearOverride="clearShiftOverride"
          />

          <EmployeesTab
            v-if="activeTab === 'employees'"
            :employees="employees"
            :shiftTemplates="shiftTemplates"
            :canWorkShift="canWorkShift"
            @addEmployee="addEmployee"
            @removeEmployee="removeEmployee"
            @toggleAvailability="toggleShiftAvailability"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatDate, formatDisplayDate, getDayName, getWeekDates, startOfWeekSunday } from './utils/dateUtils';
import { useSchedule } from './composables/useSchedule';
import TabNavigation from './components/TabNavigation.vue';
import CalendarTab from './components/CalendarTab.vue';
import ShiftsTab from './components/ShiftsTab.vue';
import EmployeesTab from './components/EmployeesTab.vue';

const employees = ref([
  { id: 1, name: 'Yuki', shiftAvailability: {} },
  { id: 2, name: 'Jesse', shiftAvailability: {} },
  { id: 3, name: 'Fred', shiftAvailability: {} },
  { id: 4, name: 'Andrea', shiftAvailability: {} },
  { id: 5, name: 'Zavian', shiftAvailability: {} },
  { id: 6, name: 'Trey', shiftAvailability: {} },
  { id: 7, name: 'Ysa', shiftAvailability: {} },
]);

const shiftTemplates = ref({
  morningA: { name: 'Morning A (Opening)', defaultStart: '6:00', defaultEnd: '11:00' },
  morningB: { name: 'Morning B (Closing)', defaultStart: '8:00', defaultEnd: '14:00' },
  dinnerA: { name: 'Dinner A (Early)', defaultStart: '15:00', defaultEnd: '19:00' },
  dinnerB: { name: 'Dinner B (Middle)', defaultStart: '16:00', defaultEnd: '21:00' },
  dinnerC: { name: 'Dinner C (Closing)', defaultStart: '17:00', defaultEnd: '23:00' },
});

const shiftOverrides = ref({});
const currentWeekStart = ref(startOfWeekSunday(new Date()));
const unavailability = ref({});
const closedDates = ref({});
const activeTab = ref('calendar');

const weekDates = computed(() => getWeekDates(currentWeekStart.value));

const {
  schedule,
  generateSchedule: generateScheduleHook,
  canWorkShift,
  isUnavailable,
  isStoreClosed,
} = useSchedule(employees, shiftTemplates, currentWeekStart, unavailability, closedDates);

const getShiftTimes = (date, shiftKey) => {
  const dateStr = formatDate(date);
  const overrideKey = `${dateStr}-${shiftKey}`;

  if (shiftOverrides.value[overrideKey]) return shiftOverrides.value[overrideKey];

  return {
    start: shiftTemplates.value[shiftKey].defaultStart,
    end: shiftTemplates.value[shiftKey].defaultEnd,
  };
};

const setShiftOverride = (date, shiftKey, field, value) => {
  const dateStr = formatDate(date);
  const overrideKey = `${dateStr}-${shiftKey}`;

  shiftOverrides.value = {
    ...shiftOverrides.value,
    [overrideKey]: {
      ...(shiftOverrides.value[overrideKey] || getShiftTimes(date, shiftKey)),
      [field]: value,
    },
  };
};

const clearShiftOverride = (date, shiftKey) => {
  const dateStr = formatDate(date);
  const overrideKey = `${dateStr}-${shiftKey}`;
  const updated = { ...shiftOverrides.value };
  delete updated[overrideKey];
  shiftOverrides.value = updated;
};

const hasShiftOverride = (date, shiftKey) => {
  const dateStr = formatDate(date);
  const overrideKey = `${dateStr}-${shiftKey}`;
  return !!shiftOverrides.value[overrideKey];
};

const updateDefaultShiftTemplate = (shiftKey, field, value) => {
  shiftTemplates.value = {
    ...shiftTemplates.value,
    [shiftKey]: {
      ...shiftTemplates.value[shiftKey],
      [field]: value,
    },
  };
};

const toggleShiftAvailability = (employeeId, shiftKey) => {
  employees.value = employees.value.map((emp) => {
    if (emp.id === employeeId) {
      const currentAvailability = emp.shiftAvailability || {};
      const currentValue = currentAvailability.hasOwnProperty(shiftKey)
        ? currentAvailability[shiftKey]
        : true;

      return {
        ...emp,
        shiftAvailability: {
          ...currentAvailability,
          [shiftKey]: !currentValue,
        },
      };
    }
    return emp;
  });
};

const addEmployee = () => {
  const name = prompt('Enter employee name:');
  if (name) {
    employees.value = [
      ...employees.value,
      { id: Date.now(), name, shiftAvailability: {} },
    ];
  }
};

const removeEmployee = (employeeId) => {
  if (window.confirm(`Remove employee?`)) {
    employees.value = employees.value.filter((e) => e.id !== employeeId);
  }
};

const toggleUnavailability = (employeeId, date) => {
  const dateStr = formatDate(date);
  const key = `${employeeId}-${dateStr}`;
  unavailability.value = { ...unavailability.value, [key]: !unavailability.value[key] };
};

const toggleStoreClosed = (date) => {
  const dateStr = formatDate(date);
  closedDates.value = { ...closedDates.value, [dateStr]: !closedDates.value[dateStr] };
};

const handleGenerateSchedule = () => {
  generateScheduleHook(getShiftTimes);
};

const exportSchedule = () => {
  let csv = 'Date,Day,' + Object.values(shiftTemplates.value).map((s) => s.name).join(',') + '\n';

  weekDates.value.forEach((date) => {
    const dateStr = formatDate(date);
    let row = `${formatDisplayDate(date)},${getDayName(date)},`;
    Object.keys(shiftTemplates.value).forEach((shiftKey) => {
      const employeeId = schedule.value[dateStr]?.[shiftKey];
      if (employeeId === 'CLOSED') row += 'STORE CLOSED,';
      else {
        const emp = employeeId ? employees.value.find((e) => e.id === employeeId) : null;
        row += (emp ? emp.name : 'UNASSIGNED') + ',';
      }
    });
    csv += row + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule_${formatDate(currentWeekStart.value)}.csv`;
  a.click();
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

