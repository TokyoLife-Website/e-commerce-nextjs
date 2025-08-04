import React from 'react';

interface HorizontaLDotsProps {
  className?: string;
  width?: number;
  height?: number;
}

const HorizontaLDots: React.FC<HorizontaLDotsProps> = ({ className = '', width = 24, height = 24 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
      />
      <circle
        cx="19"
        cy="12"
        r="1"
        fill="currentColor"
      />
      <circle
        cx="5"
        cy="12"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
};

export default HorizontaLDots; 