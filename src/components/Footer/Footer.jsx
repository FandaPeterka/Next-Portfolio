// Footer.jsx
"use client";
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import footerData from '../../data/dataFooter';
import SignatureWrapper from './SignatureWrapper';
import FooterContent from './FooterContent';
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  const creditsText = t('Credits');
  const heartStyle = useMemo(() => ({ marginRight: '5px' }), []);
  const copyrightText = t(footerData.copyright);

  return (
    <footer className="footer" aria-label="Footer Section">
      <div className="footer-content">
        <SignatureWrapper />
        <FooterContent
          creditsText={creditsText}
          heartStyle={heartStyle}
          copyrightText={copyrightText}
        />
      </div>
    </footer>
  );
};

export default React.memo(Footer);