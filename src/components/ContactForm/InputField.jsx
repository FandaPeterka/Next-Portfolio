import React from "react";
import "./ContactForm.css";

const InputField = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="custom-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="custom-input"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default InputField;