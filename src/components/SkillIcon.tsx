interface SkillIconProps {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const SkillIcon = ({ name, color, icon }: SkillIconProps) => {
  return (
    <div className="group relative flex flex-col items-center">
      <div 
        className="skill-icon w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ease-out grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-lg bg-card border border-border" 
        style={{ '--hover-bg': color } as React.CSSProperties}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = color}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
      >
        <span className="text-3xl transition-colors duration-300 text-foreground group-hover:text-white">{icon}</span>
      </div>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-card/90 backdrop-blur-sm text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out whitespace-nowrap border border-border shadow-xl z-10 pointer-events-none">
        {name}
      </span>
    </div>
  );
};

export default SkillIcon;
