import React from 'react';

interface PieChartIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const PieChartIcon: React.FC<PieChartIconProps> = ({ className = '', width = 24, height = 24 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21.21 15.89C20.5738 17.3945 19.5787 18.7202 18.3118 19.7513C17.0449 20.7824 15.5447 21.4875 13.9424 21.8048C12.3401 22.1221 10.6843 22.0402 9.12006 21.5666C7.55579 21.093 6.13059 20.2424 4.96893 19.0867C3.80727 17.931 2.94473 16.5131 2.45645 14.9595C1.96816 13.4059 1.87031 11.7696 2.17263 10.1847C2.47495 8.59987 3.16622 7.12144 4.19394 5.89129C5.22166 4.66115 6.55349 3.72435 8.06 3.17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 12H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PieChartIcon; 