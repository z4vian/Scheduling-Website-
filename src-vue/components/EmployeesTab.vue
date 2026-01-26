<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-gray-900">Employee Management</h3>
      <button
        @click="$emit('addEmployee')"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        + Add Employee
      </button>
    </div>

    <div class="space-y-6">
      <div
        v-for="emp in employees"
        :key="emp.id"
        class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="font-bold text-gray-900 text-lg">{{ emp.name }}</div>

          <button
            @click="$emit('removeEmployee', emp.id)"
            class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Remove
          </button>
        </div>

        <div>
          <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
            Shift Type Availability
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="[shiftKey, shift] in Object.entries(shiftTemplates)"
              :key="shiftKey"
              @click="$emit('toggleAvailability', emp.id, shiftKey)"
              :class="[
                'rounded-lg p-4 text-left border-2 transition-all duration-200 shadow-sm hover:shadow-md',
                canWorkShift(emp.id, shiftKey)
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : 'bg-red-50 border-red-300 hover:bg-red-100'
              ]"
            >
              <div class="font-bold text-sm text-gray-900">{{ shift.name }}</div>
              <div
                :class="[
                  'mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold',
                  canWorkShift(emp.id, shiftKey)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ canWorkShift(emp.id, shiftKey) ? '✓ Can work' : '✗ Cannot work' }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  employees: Array,
  shiftTemplates: Object,
  canWorkShift: Function,
});

defineEmits(['addEmployee', 'removeEmployee', 'toggleAvailability']);
</script>

