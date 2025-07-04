"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import contactFormData from "../data/dataContactForm";

/**
 * EmailJS se načítá až PŘI ODESLÁNÍ formuláře 
 * => menší initial bundle, nic se nestahuje dokud user neklikne Submit
 */
export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handler pro klávesovou navigaci mezi poli pomocí šipek
  const handleArrowKey = (e, nextFieldId, prevFieldId) => {
    const target = e.target;
    // Kontrola pro šipku dolů
    if (e.key === "ArrowDown" && nextFieldId) {
      // Pokud je kurzor na konci textu, přejdeme na další pole
      if (target.selectionStart === target.value.length) {
        e.preventDefault();
        const nextElem = document.getElementById(nextFieldId);
        if (nextElem) {
          nextElem.focus();
        }
      }
    }
    // Kontrola pro šipku nahoru
    else if (e.key === "ArrowUp" && prevFieldId) {
      // Pokud je kurzor na začátku textu, přejdeme na předchozí pole
      if (target.selectionStart === 0) {
        e.preventDefault();
        const prevElem = document.getElementById(prevFieldId);
        if (prevElem) {
          prevElem.focus();
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dynamicky importujeme emailjs-com
      const emailjs = await import("emailjs-com");
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData
      );
      setFeedback(t(contactFormData.feedback.success));
    } catch (error) {
      setFeedback(`${t(contactFormData.feedback.errorPrefix)}${error?.text || error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form-container">
      <div className="custom-group">
        <label htmlFor="name">{t(contactFormData.labels.name)}</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder={t(contactFormData.placeholders.name)}
          className="custom-input"
          value={formData.name}
          onChange={handleChange}
          onKeyDown={(e) => handleArrowKey(e, "email", null)}
          required
        />
      </div>

      <div className="custom-group">
        <label htmlFor="email">{t(contactFormData.labels.email)}</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder={t(contactFormData.placeholders.email)}
          className="custom-input"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={(e) => handleArrowKey(e, "message", "name")}
          required
        />
      </div>

      <div className="custom-group">
        <label htmlFor="message">{t(contactFormData.labels.message)}</label>
        <textarea
          name="message"
          id="message"
          placeholder={t(contactFormData.placeholders.message)}
          className="custom-textarea"
          value={formData.message}
          onChange={handleChange}
          onKeyDown={(e) => handleArrowKey(e, null, "email")}
          rows="5"
          required
        />
      </div>

      <button type="submit" className="custom-button">
        {t("contactForm.submitButton", "Odeslat")}
      </button>

      {feedback && <p className="custom-feedback">{feedback}</p>}

      <div className="custom-social">
        {contactFormData.social.map((link, index) => (
          <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
            <img src={link.src} alt={t(link.alt)} />
          </a>
        ))}
      </div>
    </form>
  );
}