interface TermFlowLogoProps {
  size?: number;
  className?: string;
}

export function TermFlowLogo({ size = 40, className = "" }: TermFlowLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      aria-label="TermFlow logo"
      className={className}
    >
      {/* Modern rounded square background */}
      <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#tf-bg-gradient)" />
      
      {/* Bold "TF" lettermark */}
      <text 
        x="32" 
        y="42" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="28" 
        fontWeight="900" 
        fill="#D4FF00" 
        textAnchor="middle"
        letterSpacing="-1"
      >
        TF
      </text>
      
      {/* Subtle flow accent line */}
      <path 
        d="M 16 20 L 48 20" 
        stroke="#D4FF00" 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity="0.4"
      />
      
      <defs>
        <linearGradient 
          id="tf-bg-gradient" 
          x1="4" 
          y1="4" 
          x2="60" 
          y2="60" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0D1B2A"/>
          <stop offset="1" stopColor="#1B2838"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

interface TermFlowWordmarkProps {
  className?: string;
}

export function TermFlowWordmark({ className = "" }: TermFlowWordmarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TermFlowLogo size={36} className="sm:w-10 sm:h-10" />
      <div className="text-xl sm:text-2xl font-black text-tf-navy tracking-tight leading-none" style={{ letterSpacing: '-0.5px' }}>
        TermFlow
      </div>
    </div>
  );
}
