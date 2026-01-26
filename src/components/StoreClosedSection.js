import React from 'react';
import { XCircle } from 'lucide-react';
import { formatDate, formatDisplayDate, getDayName } from '../utils/dateUtils';

const StoreClosedSection = ({ weekDates, closedDates, onToggleStoreClosed }) => {
  const isStoreClosed = (date) => {
    const dateStr = formatDate(date);
    return closedDates[dateStr] || false;
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Store Closed Days</h3>
      <div className="flex flex-wrap gap-2">
        {weekDates.map((date) => (
          <button
            key={formatDate(date)}
            onClick={() => onToggleStoreClosed(date)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
              isStoreClosed(date)
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {isStoreClosed(date) && <XCircle size={16} />}
            {getDayName(date)} {formatDisplayDate(date)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoreClosedSection;

