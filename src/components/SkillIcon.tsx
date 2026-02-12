interface SkillIconProps {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const SkillIcon = ({ name, color, icon }: SkillIconProps) => {
  return (
    <div className="group relative flex flex-col items-center">
      <div className="skill-icon transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:-translate-y-1" style={{ backgroundColor: color }}>
        <span className="text-xl text-gray-50">{icon}</span>
      </div>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-card text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 ease-out whitespace-nowrap border border-border shadow-md z-10 pointer-events-none">
        {name}
      </span>
    </div>
  );
};

export default SkillIcon;
