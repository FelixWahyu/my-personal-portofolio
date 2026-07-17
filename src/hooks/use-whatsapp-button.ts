import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ContactData } from "@/config/contact";

export const useWhatsappButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { WHATSAPP_NUMBER, TELEGRAM_USERNAME } = ContactData;

  const message = language === "id" ? "Halo, Saya tertarik untuk berdiskusi lebih lanjut." : "Hello, I'm interested in discussing further.";

  const handleWhatsApp = () => {
    if (typeof window === "undefined") return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleTelegram = () => {
    if (typeof window === "undefined") return;
    window.open(`https://t.me/${TELEGRAM_USERNAME}`, "_blank", "noopener,noreferrer");
  };

  return {
    isOpen,
    language,
    setIsOpen,
    handleWhatsApp,
    handleTelegram,
  };
};
