import React from 'react';
import footerData from '../data/dataFooter';
import { useTranslation } from 'react-i18next';
import SignatureAnimation from './SignatureAnimation';
import { FaHeart } from 'react-icons/fa';  // Import ikony srdce

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div 
          className="signature-wrapper" 
          aria-label={t('signatureAnimation', 'Signature animation')}
        >
          <SignatureAnimation />
        </div>
        <p aria-label="Copyright">
          {t(footerData.copyright)}
        </p>
        {/* Tlačítko pro otevření Credits stránky v nové záložce */}
        <a
          href="/credits"
          target="_blank"
          rel="noopener noreferrer"
          className="credits-button"
          aria-label={t('creditsLink', 'Open Credits Page')}
        >
          <FaHeart aria-hidden="true" style={{ marginRight: '5px' }} /> {t('Credits')}
        </a>
      </div>
    </footer>
  );
};

export default Footer;