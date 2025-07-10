// SocialLinks.jsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import contactFormData from "../data/dataContactForm";

const ICON_SIZE = 40;

export default function SocialLinks({ className = "custom-social" }) {
  const { t } = useTranslation();

  const renderIcon = (type) => {
    switch (type) {
      case "github":
        return <AiFillGithub size={ICON_SIZE} className="social-icon" />;
      case "linkedin":
        return <AiFillLinkedin size={ICON_SIZE} className="social-icon" />;
      case "cv":
        return <FiFileText size={ICON_SIZE} className="social-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {contactFormData.social.map(({ href, type, alt, download }, idx) => {
        const linkProps = download
          ? { download: true }
          : { target: "_blank", rel: "noopener noreferrer" };

        return (
          <a
            key={idx}
            href={href}
            {...linkProps}
            className="social-link"
            aria-label={t(alt)}
            title={t(alt)}
          >
            {renderIcon(type)}
          </a>
        );
      })}
    </div>
  );
}