import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = ({ compact = false }: { compact?: boolean }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  if (compact) {
    return (
      <button onClick={toggleTheme} aria-label="Toggle theme" className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all hover:scale-105">
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-accent border border-border">
      <button onClick={() => setTheme("light")} className={`p-2 rounded-full transition-all ${theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} aria-label="Light mode">
        <Sun className="w-4 h-4" />
      </button>
      <button onClick={() => setTheme("dark")} className={`p-2 rounded-full transition-all ${theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} aria-label="Dark mode">
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ThemeToggle;
