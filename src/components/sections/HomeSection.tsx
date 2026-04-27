import { MapPin, Briefcase, Download, User, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageProvider";
import { Button } from "../ui/button";
import config from "@/config/GitHubUsername";
import CodeTyping from "../ui/CodeTyping";
import TypewriterText from "../ui/TypewriterText";

const HomeSection = () => {
  const { t } = useLanguage();

  return (
    <section className="animate-fade-in pb-12 mb-8 mt-4">
      <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12 md:gap-8">
        {/* Left Column - Content */}
        <div className="flex-1 w-full flex flex-col justify-center items-center md:items-start text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 animate-fade-in tracking-tight">
            {t.home.greeting}
            <span className="text-primary block mt-2">{config.bio.name}</span>
          </h1>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 animate-fade-in text-muted-foreground flex items-center justify-center md:justify-start min-h-[40px] sm:min-h-[48px] lg:min-h-[56px]"
            style={{ animationDelay: "50ms" }}
          >
            <TypewriterText text="Web Developer" delay={500} speed={80} />
          </h2>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{t.home.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-sm">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>{t.home.status}</span>
            </div>
          </div>

          <div className="flex flex-row justify-center md:justify-start gap-5 sm:gap-10 mt-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-4 group">
              <span className="text-3xl lg:text-4xl font-black text-primary drop-shadow-md group-hover:scale-110 transition-transform">1+</span>
              <span className="text-sm font-medium text-muted-foreground leading-tight text-left uppercase tracking-wider">
                Years
                <br />
                Experience
              </span>
            </div>
            <div className="block w-px bg-gray-100/50 my-2"></div>
            <div className="flex items-center gap-4 group">
              <span className="text-3xl lg:text-4xl font-black text-primary drop-shadow-md group-hover:scale-110 transition-transform">10+</span>
              <span className="text-sm font-medium text-muted-foreground leading-tight text-left uppercase tracking-wider">
                Projects
                <br />
                Completed
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10 animate-fade-in w-full sm:w-auto" style={{ animationDelay: "300ms" }}>
            <Button asChild size="lg" className="gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 rounded-full px-8 w-full sm:w-auto text-base">
              <a href="/files/CV-Felix-20260427.pdf" download>
                <Download className="w-5 h-5" />
                {t.about.downloadResume}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 transition-all duration-300 rounded-full px-8 w-full sm:w-auto border-2 hover:bg-secondary text-base">
              <Link to="/tentang">
                <User className="w-5 h-5" />
                {t.nav.tentang}
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="shrink-0 animate-fade-in w-full md:w-auto flex justify-center mt-4 md:mt-8" style={{ animationDelay: "150ms" }}>
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] mx-auto">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: "4s" }}></div>

            <CodeTyping />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
