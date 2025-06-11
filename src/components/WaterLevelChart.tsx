"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar
} from 'recharts';

interface WaterLevelChartProps {
  data: Array<{
    time: string;
    waterLevel: number;
    rainfall?: number;
    warningLevel?: number;
    dangerLevel?: number;
  }>;
  title?: string;
  location?: string;
}

const WaterLevelChart: React.FC<WaterLevelChartProps> = ({ data, title, location }) => {
  // Find max value for display purpose
  const maxWaterLevel = Math.max(...data.map(item => item.waterLevel));
  const maxYValue = maxWaterLevel * 1.2; // Add 20% overhead for better visualization

  // Calculate if any readings exceeded warning or danger levels
  const warningLevel = data[0]?.warningLevel || null;
  const dangerLevel = data[0]?.dangerLevel || null;
  const hasWarningData = warningLevel !== null;
  
  const hasExceededWarning = hasWarningData && data.some(item => item.waterLevel > warningLevel!);
  const hasExceededDanger = dangerLevel !== null && data.some(item => item.waterLevel > dangerLevel);
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-medium">{title || "Water Level Monitoring"}</h3>
        {location && <p className="text-sm text-gray-500 dark:text-gray-400">{location}</p>}
      </div>
      
      {/* Status indicator */}
      {hasWarningData && (
        <div className={`mb-3 p-2 rounded-md text-sm ${
          hasExceededDanger 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' 
            : hasExceededWarning 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              hasExceededDanger 
                ? 'bg-blue-600 dark:bg-blue-400' 
                : hasExceededWarning 
                  ? 'bg-amber-500 dark:bg-amber-400' 
                  : 'bg-green-500 dark:bg-green-400'
            }`}></div>
            <span>
              {hasExceededDanger 
                ? 'Danger level exceeded' 
                : hasExceededWarning 
                  ? 'Warning level exceeded' 
                  : 'Normal water level'}
            </span>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }} 
            tickMargin={8}
          />
          <YAxis 
            yAxisId="left"
            domain={[0, maxYValue]} 
            tick={{ fontSize: 10 }}
            tickMargin={8}
            label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
          />
          {data[0]?.rainfall !== undefined && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, Math.max(...data.map(item => item.rainfall || 0)) * 1.2]}
              tick={{ fontSize: 10 }}
              tickMargin={8}
              label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 12 } }}
            />
          )}
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value, name) => {
              if (name === 'waterLevel') return [`${value} m`, 'Water Level'];
              if (name === 'rainfall') return [`${value} mm`, 'Rainfall'];
              return [value, name];
            }}
          />
          <Legend verticalAlign="top" height={36} />
          
          {/* Danger level reference line if available */}
          {dangerLevel !== null && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey={() => dangerLevel}
              stroke="#1e40af"
              fill="#1e3a8a"
              fillOpacity={0.1}
              strokeWidth={1}
              strokeDasharray="5 2"
              name="Danger Level"
              isAnimationActive={false}
            />
          )}
          
          {/* Warning level reference line if available */}
          {warningLevel !== null && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey={() => warningLevel}
              stroke="#0284c7"
              fill="#0ea5e9"
              fillOpacity={0.05}
              strokeWidth={1}
              strokeDasharray="5 2"
              name="Warning Level"
              isAnimationActive={false}
            />
          )}
          
          {/* Water level line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="waterLevel"
            stroke="#0369a1"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            name="Water Level"
          />
          
          {/* Rainfall bars if available */}
          {data[0]?.rainfall !== undefined && (
            <Bar
              yAxisId="right"
              dataKey="rainfall"
              fill="#93c5fd"
              barSize={8}
              opacity={0.8}
              name="Rainfall"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterLevelChart;
