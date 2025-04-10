export async function sendEmail(formData) {
    const emailjs = await import("emailjs-com");
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  
    return emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formData
    );
  }