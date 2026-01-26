<template>
  <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
    <div class="flex gap-1 p-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
          activeTab === tab.id
            ? 'bg-white text-blue-600 shadow-md transform scale-105'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        ]"
      >
        <component :is="tab.iconComponent" :size="18" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { Calendar, Clock, Users } from 'lucide-vue-next';

const props = defineProps({
  activeTab: String,
});

defineEmits(['update:activeTab']);

const tabs = [
  { id: 'calendar', label: 'Calendar & Availability', iconComponent: Calendar },
  { id: 'shifts', label: 'Shift Times', iconComponent: Clock },
  { id: 'employees', label: 'Employees', iconComponent: Users },
];
</script>

