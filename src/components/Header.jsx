import { useState } from "react";
import { User } from "lucide-react";

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex ml-6 items-center justify-between px-3 sm:px-8 py-2 sm:py-6  border-b-2 border-[#f5c755]/30 backdrop-blur-sm shadow-lg rounded-b-xl relative overflow-hidden group">

      <div className="absolute inset-0 bg-gradient-to-r from-[#f5c755]/5 via-transparent to-[#f5c755]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <h1 className="text-xl sm:text-2xl bg-gradient-to-r from-[#f5c755] via-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold transition-all duration-500 group-hover:scale-105 animate-pulse-subtle">
        Welcome Sandra!
      </h1>
      
      <div 
        className="flex items-center gap-3 bg-card/80 border border-[#f5c755]/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group/user relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#f5c755] to-yellow-600 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-180 hover:scale-110 shadow-md">
          <User size={16} className="text-primary-foreground transition-transform duration-300" />
        </div>
        <span className="text-sm text-foreground font-medium transition-colors duration-300 group-hover/user:text-[#f5c755]">
          By.McDonalds
        </span>
        {isHovered && (
          <div className="absolute -inset-2 bg-[#f5c755]/10 rounded-full blur-xl animate-ping"></div>
        )}
      </div>
    </div>
  );
};

export default Header;