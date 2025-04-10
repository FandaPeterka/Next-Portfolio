import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import contactFormData from "../../data/dataContactForm";
import "./ContactForm.css";

const SocialLinks = () => {
  const { t } = useTranslation();

  const socialLinks = useMemo(
    () =>
      contactFormData.social.map((link, index) => (
        <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
          <img src={link.src} alt={t(link.alt)} />
        </a>
      )),
    [t]
  );

  return <div className="custom-social">{socialLinks}</div>;
};

export default SocialLinks;