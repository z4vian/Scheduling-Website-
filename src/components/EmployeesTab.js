import React from 'react';

const EmployeesTab = ({
  employees,
  shiftTemplates,
  onAddEmployee,
  onRemoveEmployee,
  canWorkShift,
  onToggleShiftAvailability,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Employee Management</h3>
        <button
          onClick={onAddEmployee}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          + Add Employee
        </button>
      </div>

      <div className="space-y-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-gray-900 text-lg">{emp.name}</div>

              <button
                onClick={() => {
                  if (window.confirm(`Remove ${emp.name}?`)) {
                    onRemoveEmployee(emp.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Remove
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
                Shift Type Availability
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(shiftTemplates).map(([shiftKey, shift]) => {
                  const canWork = canWorkShift(emp.id, shiftKey);
                  return (
                    <button
                      key={shiftKey}
                      onClick={() => onToggleShiftAvailability(emp.id, shiftKey)}
                      className={`rounded-lg p-4 text-left border-2 transition ${
                        canWork
                          ? 'bg-green-50 border-green-300 hover:bg-green-100'
                          : 'bg-red-50 border-red-300 hover:bg-red-100'
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900">{shift.name}</div>
                      <div
                        className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          canWork
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {canWork ? '✓ Can work' : '✗ Cannot work'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesTab;

