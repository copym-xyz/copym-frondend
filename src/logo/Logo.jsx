import React from 'react';

const Logo = ({ className = '', width = 200, height = 60 }) => {
  return (
    <svg 
      viewBox="0 0 200 60" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
    >
      <text 
        x="10" 
        y="42" 
        fontFamily="Inter, system-ui" 
        fontWeight="600" 
        fontSize="42" 
        fill="#1E293B"
      >
        copy<tspan fill="#2563EB">m</tspan>
      </text>
      <g transform="translate(160, 30)" stroke="#2563EB" strokeWidth="2" fill="none">
        <path 
          d="M0,0 L8,-8 L16,4 L24,-12" 
          strokeLinecap="round" 
        />
        <path 
          d="M0,0 L8,-8 L16,4 L24,-12" 
          strokeLinecap="round" 
          strokeOpacity="0.2" 
          transform="translate(0, 4)" 
        />
      </g>
    </svg>
  );
};

export default Logo;