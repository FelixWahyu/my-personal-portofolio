import { useState } from "react";
import { Mail, ExternalLink, Github, Linkedin, Instagram, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../LanguageProvider";
import { z } from "zod";

const NAME_MAX = 100;
const EMAIL_MAX = 255;
const MESSAGE_MAX = 1000;

const WEB3FORMS_ACCESS_KEY = "74f2defa-dc28-4809-8124-f06072869d90";

const ContactForm = () => {
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

  const charCount = (val: string, max: number) => (
    <span className={`text-xs ${val.length > max ? "text-destructive" : "text-muted-foreground"}`}>
      {val.length}/{max}
    </span>
  );

  return (
    <div className="p-6 rounded-lg bg-card border border-border">
      <h3 className="text-lg font-semibold mb-1">{t.contact.form.title}</h3>
      <p className="text-sm text-muted-foreground mb-5">{t.contact.form.subtitle}</p>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-name">{t.contact.form.name}</Label>
              {charCount(form.name, NAME_MAX)}
            </div>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                setErrors((p) => ({ ...p, name: undefined }));
              }}
              maxLength={NAME_MAX + 1}
              placeholder={t.contact.form.namePlaceholder}
              className={errors.name ? "border-destructive" : ""}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p id="contact-name-error" className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-email">{t.contact.form.email}</Label>
              {charCount(form.email, EMAIL_MAX)}
            </div>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }));
                setErrors((p) => ({ ...p, email: undefined }));
              }}
              maxLength={EMAIL_MAX + 1}
              placeholder={t.contact.form.emailPlaceholder}
              className={errors.email ? "border-destructive" : ""}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p id="contact-email-error" className="text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="contact-message">{t.contact.form.message}</Label>
            {charCount(form.message, MESSAGE_MAX)}
          </div>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => {
              setForm((p) => ({ ...p, message: e.target.value }));
              setErrors((p) => ({ ...p, message: undefined }));
            }}
            maxLength={MESSAGE_MAX + 1}
            rows={5}
            placeholder={t.contact.form.messagePlaceholder}
            className={errors.message ? "border-destructive" : ""}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p id="contact-message-error" className="text-xs text-destructive">{errors.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="gap-2 w-full sm:w-auto">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isSubmitting ? t.contact.form.sending : t.contact.form.send}
        </Button>
      </form>
    </div>
  );
};

const ContactSection = () => {
  const { t } = useLanguage();

  const socials = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t.contact.socials.gmail.title,
      description: t.contact.socials.gmail.description,
      label: t.contact.socials.gmail.action,
      link: "mailto:felixwahyusejati89@example.com",
      ariaLabel: "Kirim email ke Felix Wahyu Sejati",
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      title: t.contact.socials.instagram.title,
      description: t.contact.socials.instagram.description,
      label: t.contact.socials.instagram.action,
      link: "https://instagram.com/felixdev.id",
      ariaLabel: "Kunjungi profil Instagram @felixdev.id (buka di tab baru)",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      title: t.contact.socials.linkedin.title,
      description: t.contact.socials.linkedin.description,
      label: t.contact.socials.linkedin.action,
      link: "https://linkedin.com/in/felix-wahyu-sejati",
      ariaLabel: "Kunjungi profil LinkedIn Felix Wahyu Sejati (buka di tab baru)",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.28 8.28 0 0 0 4.76 1.52V6.95a4.84 4.84 0 0 1-1-.26Z" />
        </svg>
      ),
      title: t.contact.socials.tiktok.title,
      description: t.contact.socials.tiktok.description,
      label: t.contact.socials.tiktok.action,
      link: "https://tiktok.com/@felixdev.id",
      ariaLabel: "Kunjungi profil TikTok @felixdev.id (buka di tab baru)",
    },
    {
      icon: <Github className="w-6 h-6" />,
      title: t.contact.socials.github.title,
      description: t.contact.socials.github.description,
      label: t.contact.socials.github.action,
      link: "https://github.com/FelixWahyu",
      ariaLabel: "Kunjungi profil GitHub FelixWahyu (buka di tab baru)",
    },
  ];

  return (
    <section className="animate-fade-in space-y-10" aria-labelledby="contact-heading">
      <div className="pb-4 border-b-2 border-dashed">
        <h2 id="contact-heading" className="text-3xl font-bold text-foreground">{t.contact.title}</h2>
        <p className="text-muted-foreground mt-1">{t.contact.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.link}
            target={social.link.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            className="group p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all animate-fade-in block"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary" aria-hidden="true">{social.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{social.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{social.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm text-primary group-hover:underline">
                  {social.label}
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <ContactForm />
    </section>
  );
};

export default ContactSection;
