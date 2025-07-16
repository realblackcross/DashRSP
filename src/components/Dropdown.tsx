// @ts-ignore
import React from 'react';



interface DropdownProps {
  label: string;            // Label to show above the dropdown
  options: string[];        // List of selectable options
  value: string;            // Currently selected value
  onChange: (newValue: string) => void; // Handler to update parent state
}

/**
 * Reusable dropdown component with label
 */
const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '180px',
        marginBottom: '1rem', // ✅ Add spacing between dropdowns
      }}
    >
      {/* Dropdown label */}
      <label
        style={{
          fontWeight: 600,
          marginBottom: '0.4rem',
          color: '#2c3e50',
          fontSize: '0.95rem',
        }}
      >
        {label}
      </label>

      {/* Select input */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.9rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: '#ffffff',
          color: '#2c3e50',
          appearance: 'auto',
          cursor: 'pointer',
        }}
      >
        {/* Render each option */}
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ color: '#2c3e50' }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
