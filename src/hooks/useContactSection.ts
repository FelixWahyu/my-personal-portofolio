import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export const NAME_MAX = 100;
export const EMAIL_MAX = 255;
export const MESSAGE_MAX = 1000;

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";

export const useContactForm = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(3, language === "id" ? "Nama wajib diisi" : "Name is required")
      .max(NAME_MAX, language === "id" ? `Maksimal ${NAME_MAX} karakter` : `Max ${NAME_MAX} characters`),
    email: z
      .string()
      .trim()
      .min(3, language === "id" ? "Email wajib diisi" : "Email is required")
      .email(language === "id" ? "Format email tidak valid" : "Invalid email format")
      .max(EMAIL_MAX, language === "id" ? `Maksimal ${EMAIL_MAX} karakter` : `Max ${EMAIL_MAX} characters`),
    message: z
      .string()
      .trim()
      .min(3, language === "id" ? "Pesan wajib diisi" : "Message is required")
      .max(MESSAGE_MAX, language === "id" ? `Maksimal ${MESSAGE_MAX} karakter` : `Max ${MESSAGE_MAX} characters`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `[Portfolio] Pesan baru dari ${form.name}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: t.contact.form.success, description: t.contact.form.successDesc });
        setForm({ name: "", email: "", message: "" });
      } else {
        toast({
          title: language === "id" ? "Gagal mengirim pesan" : "Failed to send message",
          description: language === "id" ? "Terjadi kesalahan, coba lagi nanti." : "Something went wrong, please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: language === "id" ? "Gagal mengirim pesan" : "Failed to send message",
        description: language === "id" ? "Periksa koneksi internet Anda." : "Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: "name" | "email" | "message", value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return {
    t,
    language,
    isSubmitting,
    form,
    errors,
    handleSubmit,
    handleInputChange,
    NAME_MAX,
    EMAIL_MAX,
    MESSAGE_MAX,
  };
};

export const useContactSection = () => {
  const { t, language } = useLanguage();
  const whatsappMessage = language === "id" ? "Halo, Saya tertarik untuk berdiskusi lebih lanjut." : "Hello, I'm interested in discussing further.";

  return {
    t,
    language,
    whatsappMessage,
  };
};
