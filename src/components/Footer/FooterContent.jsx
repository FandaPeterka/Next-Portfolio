// FooterContent.jsx
import React from 'react';
import CreditsButton from './CreditsButton';
import "./Footer.css";

const FooterContent = ({ copyrightText,
  creditsText,
  heartStyle }) => {
  return (
    <section className="footer-content-inner" aria-label="Footer Information">
      <p>{copyrightText}</p>
      <CreditsButton creditsText={creditsText} heartStyle={heartStyle} />
    </section>
  );
};

export default FooterContent;