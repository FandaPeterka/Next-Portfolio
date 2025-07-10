/* =========================================================
   ContactForm.jsx  – updated (social links moved out)
   ========================================================= */
"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import contactFormData from "../data/dataContactForm";
import SocialLinks from "./SocialLinks";          // ⬅️ NEW IMPORT

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [feedback, setFeedback] = useState("");

  /* ---------- helpers ------------------------------------------------- */
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleArrowKey = (e, nextId, prevId) => {
    const { key, target } = e;
    if (key === "ArrowDown" && nextId && target.selectionStart === target.value.length) {
      e.preventDefault();
      document.getElementById(nextId)?.focus();
    }
    if (key === "ArrowUp" && prevId && target.selectionStart === 0) {
      e.preventDefault();
      document.getElementById(prevId)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailjs = await import("emailjs-com");
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData
      );
      setFeedback(t(contactFormData.feedback.success));
    } catch (err) {
      setFeedback(`${t(contactFormData.feedback.errorPrefix)}${err?.text || err}`);
    }
  };

  /* ---------- render -------------------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="custom-form-container">
      {/* NAME ----------------------------------------------------------- */}
      <div className="custom-group">
        <label htmlFor="name">{t(contactFormData.labels.name)}</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="custom-input"
          placeholder={t(contactFormData.placeholders.name)}
          value={formData.name}
          onChange={handleChange}
          onKeyDown={(e) => handleArrowKey(e, "email", null)}
        />
      </div>

      {/* EMAIL ---------------------------------------------------------- */}
      <div className="custom-group">
        <label htmlFor="email">{t(contactFormData.labels.email)}</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="custom-input"
          placeholder={t(contactFormData.placeholders.email)}
          value={formData.email}
          onChange={handleChange}
          onKeyDown={(e) => handleArrowKey(e, "message", "name")}
        />
      </div>

      {/* MESSAGE -------------------------------------------------------- */}
      <div className="custom-group">
        <label htmlFor="message">{t(contactFormData.labels.message)}</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          className="custom-textarea"
          placeholder={t(contactFormData.placeholders.message)}
          value={formData.message}
          onChange={handleChange}
          onKeyDown={(e) => handleArrowKey(e, null, "email")}
        />
      </div>

      {/* SUBMIT --------------------------------------------------------- */}
      <button type="submit" className="custom-button">
        {t("contactForm.submitButton", "Odeslat")}
      </button>

      {feedback && <p className="custom-feedback">{feedback}</p>}

      {/* SOCIAL LINKS  -------------------------------------------------- */}
      <SocialLinks />   {/* ⬅️ moved out of the form logic */}
    </form>
  );
}