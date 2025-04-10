import React from "react";
import "./ContactForm.css";

const TextAreaField = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  rows = 5,
  required = false,
}) => {
  return (
    <div className="custom-group">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        className="custom-textarea"
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
      />
    </div>
  );
};

export default TextAreaField;