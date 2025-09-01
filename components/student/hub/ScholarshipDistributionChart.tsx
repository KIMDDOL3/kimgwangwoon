import React, { useMemo, useState } from 'react';
import { AllScholarships, ScholarshipCategory } from '../../../types';
import { SCHOLARSHIP_CATEGORIES } from '../../../constants';

interface ChartProps {
  scholarships: AllScholarships[];
  isPreview?: boolean;
}

const DonutSegment: React.FC<{
  radius: number;
  strokeWidth: number;
  angle: number;
  offset: number;
  color: string;
  label: string;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ radius, strokeWidth, angle, offset, color, label, isHovered, isDimmed, onMouseEnter, onMouseLeave }) => {
  const circumference = 2 * Math.PI * radius;
  const dasharray = `${(angle / 360) * circumference} ${circumference}`;

  return (
    <g onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <circle
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dasharray}
        strokeDashoffset={(-offset / 360) * circumference}
        transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
        className="transition-all duration-300 ease-in-out cursor-pointer"
        style={{
          transformOrigin: 'center center',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          opacity: isDimmed ? 0.3 : 1,
        }}
      >
        <title>{label}</title>
      </circle>
    </g>
  );
};


const ScholarshipDistributionChart: React.FC<ChartProps> = ({ scholarships, isPreview = false }) => {
  const [hoveredCategory, setHoveredCategory] = useState<ScholarshipCategory | null>(null);

  const data = useMemo(() => {
    const counts = scholarships.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<ScholarshipCategory, number>);

    return Object.entries(counts)
      .map(([category, count]) => ({
        category: category as ScholarshipCategory,
        count,
        ...SCHOLARSHIP_CATEGORIES[category as ScholarshipCategory],
      }))
      .sort((a, b) => b.count - a.count);
  }, [scholarships]);

  const total = scholarships.length;
  let accumulatedAngle = 0;

  const radius = isPreview ? 60 : 100;
  const strokeWidth = isPreview ? 15 : 25;
  const size = (radius + strokeWidth) * 2;
  
  const handleMouseEnter = (category: ScholarshipCategory) => {
    setHoveredCategory(category);
  };
  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div className={`w-full h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 ${isPreview ? 'p-2' : 'p-6'}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map(({ category, count, color, label }) => {
            const angle = total > 0 ? (count / total) * 360 : 0;
            const segment = (
              <DonutSegment
                key={category}
                radius={radius}
                strokeWidth={strokeWidth}
                angle={angle}
                offset={accumulatedAngle}
                color={color}
                label={`${label}: ${count}개 (${total > 0 ? ((count/total)*100).toFixed(1) : 0}%)`}
                isHovered={hoveredCategory === category}
                isDimmed={hoveredCategory !== null && hoveredCategory !== category}
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
              />
            );
            accumulatedAngle += angle;
            return segment;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className={`font-black ${isPreview ? 'text-2xl' : 'text-4xl'} text-gray-800 dark:text-white`}>{total}</span>
            <span className={`font-semibold ${isPreview ? 'text-xs' : 'text-base'} text-gray-500 dark:text-gray-400`}>총 장학금</span>
        </div>
      </div>
      <div className={`flex ${isPreview ? 'flex-wrap justify-center gap-x-4 gap-y-1' : 'flex-col justify-center space-y-2'}`}>
        {data.map(({ category, count, color, label }) => (
          <div
            key={category}
            className="flex items-center cursor-pointer transition-all duration-300 ease-in-out"
            style={{ 
                opacity: hoveredCategory !== null && hoveredCategory !== category ? 0.5 : 1,
                transform: hoveredCategory === category ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: color }}></div>
            <span className={`font-semibold ${isPreview ? 'text-xs' : 'text-base'} text-gray-700 dark:text-gray-300`}>{label}</span>
            <span className={`ml-2 ${isPreview ? 'text-xs' : 'text-base'} text-gray-500 dark:text-gray-400`}>{count}개</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipDistributionChart;