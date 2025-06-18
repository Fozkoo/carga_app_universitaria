import React from 'react';

interface Option {
  value: number;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  required = false,
}) => {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;