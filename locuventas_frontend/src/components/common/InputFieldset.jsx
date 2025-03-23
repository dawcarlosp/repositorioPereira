import React from 'react';

function InputFieldset({type = "text", id, value, onChange, placeholder, required = false, }) {
  return (
    <label className="relative block w-80 border border-gray-300 rounded-xl shadow-md 
    focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500 transition-all mb-2">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      className="peer w-full py-4 px-4 text-gray-700 text-base bg-white rounded-xl
        focus:outline-none placeholder-transparent"
    />
    <span
      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base
        transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm 
        peer-focus:text-purple-500 peer-not-placeholder-shown:top-2 
        peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-purple-500"
      style={{ pointerEvents: "none" }}
    >
      {placeholder}
    </span>
  </label>
  );
}

export default InputFieldset;