// CreditsButton.jsx
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import "./Footer.css";

const CreditsButton = ({ creditsText, heartStyle }) => {
  return (
    <a
      href="/credits"
      target="_blank"
      rel="noopener noreferrer"
      className="credits-button"
      aria-label={`Credits: ${creditsText}`}
    >
      <FaHeart style={heartStyle} /> {creditsText}
    </a>
  );
};

export default CreditsButton;