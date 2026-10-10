import React, { useState } from 'react';
import { motion } from 'motion/react';

interface DataPoint {
  label: string;
  valence: number; // 0 to 100
  energy: number; // 0 to 100
  coherence: number; // 0 to 100
}

interface NeuralChartProps {
  data: DataPoint[];
  metric?: 'valence' | 'energy' | 'coherence';
  height?: number;
  className?: string;
  title?: string;
}

export const NeuralChart: React.FC<NeuralChartProps> = ({
  data,
  metric = 'coherence',
  height = 200,
  className = '',
  title = '7-Day Cognitive Coherence Vector',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const paddingX = 40;
  const paddingY = 30;
  const width = 640;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const val = d[metric];
    const y = height - paddingY - (val / 100) * chartHeight;
    return { x, y, val, label: d.label };
  });

  // Build SVG path string with smooth bezier curves
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${height - paddingY} L ${points[0]?.x || 0} ${height - paddingY} Z`;

  const metricColors = {
    coherence: {
      stroke: '#06b6d4',
      gradientId: 'coherence-grad',
      glow: 'rgba(6, 182, 212, 0.6)',
      fillFrom: 'rgba(6, 182, 212, 0.35)',
      fillTo: 'rgba(6, 182, 212, 0.0)',
    },
    valence: {
      stroke: '#a855f7',
      gradientId: 'valence-grad',
      glow: 'rgba(168, 85, 247, 0.6)',
      fillFrom: 'rgba(168, 85, 247, 0.35)',
      fillTo: 'rgba(168, 85, 247, 0.0)',
    },
    energy: {
      stroke: '#f59e0b',
      gradientId: 'energy-grad',
      glow: 'rgba(245, 158, 11, 0.6)',
      fillFrom: 'rgba(245, 158, 11, 0.35)',
      fillTo: 'rgba(245, 158, 11, 0.0)',
    },
  }[metric];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#080d22]/70 border border-white/[0.08] p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: metricColors.stroke, boxShadow: `0 0 8px ${metricColors.glow}` }}
            />
            {title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Biometric waveform drawing & harmonic sync</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-cyan-300">
            {hoveredIndex !== null ? `${data[hoveredIndex].label}: ${data[hoveredIndex][metric]}%` : `Avg: 88%`}
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={metricColors.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricColors.fillFrom} />
              <stop offset="100%" stopColor={metricColors.fillTo} />
            </linearGradient>

            <filter id={`chart-glow-${metric}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Holographic grid guidelines */}
          {[25, 50, 75, 100].map((level) => {
            const y = height - paddingY - (level / 100) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="rgba(148, 163, 184, 0.4)"
                  fontFamily="monospace"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Area fill path */}
          <motion.path
            d={areaPath}
            fill={`url(#${metricColors.gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />

          {/* Animated drawing line path */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={metricColors.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#chart-glow-${metric})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={height - paddingY}
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point ring */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4.5}
                  fill="#060919"
                  stroke={metricColors.stroke}
                  strokeWidth="2.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.08, type: 'spring' }}
                />

                {/* Axis label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? '#38bdf8' : 'rgba(148, 163, 184, 0.6)'}
                  fontFamily="sans-serif"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
