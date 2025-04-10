"use client";
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import SocialLinks from "./SocialLinks";
import { sendEmail } from "./EmailSender";
import contactFormData from "../../data/dataContactForm";
import "./ContactForm.css";

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");

  // Obsluha změn ve formuláři
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Dynamický import a odeslání emailu až při submitu
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await sendEmail(formData);
        setFeedback(t(contactFormData.feedback.success));
      } catch (error) {
        setFeedback(
          `${t(contactFormData.feedback.errorPrefix)}${error?.text || error}`
        );
      }
    },
    [formData, t]
  );

  return (
    // Používáme sémantický <form> s role a aria-label pro lepší SEO a přístupnost
    <form onSubmit={handleSubmit} className="custom-form-container" role="form" aria-label="Contact Form">
      <InputField
        id="name"
        name="name"
        type="text"
        label={t(contactFormData.labels.name)}
        placeholder={t(contactFormData.placeholders.name)}
        value={formData.name}
        onChange={handleChange}
        required
      />

      <InputField
        id="email"
        name="email"
        type="email"
        label={t(contactFormData.labels.email)}
        placeholder={t(contactFormData.placeholders.email)}
        value={formData.email}
        onChange={handleChange}
        required
      />

      <TextAreaField
        id="message"
        name="message"
        label={t(contactFormData.labels.message)}
        placeholder={t(contactFormData.placeholders.message)}
        value={formData.message}
        onChange={handleChange}
        rows="5"
        required
      />

      <button type="submit" className="custom-button">
        {t("contactForm.submitButton", "Odeslat")}
      </button>

      {feedback && <p className="custom-feedback" role="alert">{feedback}</p>}

      <SocialLinks />
    </form>
  );
}