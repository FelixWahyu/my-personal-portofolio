import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const WHATSAPP_NUMBER = "6285869906592";

const WhatsappButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const message = language === "id" ? "Halo, Saya tertarik untuk berdiskusi lebih lanjut." : "Hello, I'm interested in discussing further.";

  const handleClick = () => {
    if (typeof window === "undefined") return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div
        role="tooltip"
        aria-hidden={!isOpen}
        className={`px-4 py-2.5 rounded-xl bg-card border border-border shadow-lg text-sm font-medium text-foreground transition-all duration-300 origin-bottom-right ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none"
        }`}
      >
        <p className="text-xs text-muted-foreground mb-1">{language === "id" ? "Butuh bantuan?" : "Need help?"}</p>
        <button onClick={handleClick} className="flex items-center gap-2 text-primary hover:underline transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {language === "id" ? "Chat via WhatsApp" : "Chat on WhatsApp"}
        </button>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? "bg-muted text-foreground rotate-0" : "bg-primary text-primary-foreground rotate-0"
        }`}
        aria-label="WhatsApp"
      >
        {!isOpen && <span className="absolute inset-0 rounded-full bg-primary motion-safe:animate-ping opacity-20" />}
        <span className="relative transition-transform duration-300">{isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}</span>
      </button>
    </div>
  );
};

export default WhatsappButton;
