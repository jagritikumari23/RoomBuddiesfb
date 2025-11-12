import React from 'react';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selected, onChange }) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    onChange(date);
  };

  return (
    <input
      type="date"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={handleDateChange}
      className="border p-2 rounded"
    />
  );
};

export default DatePicker;
