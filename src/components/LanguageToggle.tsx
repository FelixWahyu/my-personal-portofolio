import { useLanguage } from "./LanguageProvider";

const LanguageToggle = ({ compact = false }: { compact?: boolean }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLang = () => setLanguage(language === "id" ? "en" : "id");

  if (compact) {
    return (
      <button onClick={toggleLang} className="bg-primary w-9 h-9 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold transition-all hover:scale-105" aria-label="Toggle language">
        {language === "id" ? "ID" : "EN"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-accent border border-border">
      <button
        onClick={() => setLanguage("id")}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${language === "id" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
