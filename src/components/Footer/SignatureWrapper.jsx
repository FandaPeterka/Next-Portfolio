// SignatureWrapper.jsx
"use client";
import React from 'react';
import Signature from './Signature';
import "./Footer.css";

const SignatureWrapper = () => {
  return (
    <div className="signature-wrapper" role="presentation">
      <Signature />
    </div>
  );
};

export default SignatureWrapper;