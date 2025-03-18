import React from 'react';

function InputFieldset({ label, type = "text", id, value, onChange, placeholder }) {
  return (
    <fieldset className="flex flex-col items-center justify-center">
      <label htmlFor={id}>{label}:</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
        className="border-b rounded-xl w-80 py-2 text-center"
        placeholder={placeholder}
      />
    </fieldset>
  );
}

export default InputFieldset;
