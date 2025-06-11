"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock weather data for the chart
const weatherData = [
  { day: 'Mon', temperature: 22, rainfall: 0, humidity: 65 },
  { day: 'Tue', temperature: 21, rainfall: 5, humidity: 70 },
  { day: 'Wed', temperature: 23, rainfall: 10, humidity: 80 },
  { day: 'Thu', temperature: 25, rainfall: 2, humidity: 60 },
  { day: 'Fri', temperature: 24, rainfall: 0, humidity: 55 },
  { day: 'Sat', temperature: 22, rainfall: 8, humidity: 75 },
  { day: 'Sun', temperature: 20, rainfall: 15, humidity: 90 },
];

interface WeatherChartProps {
  type: 'temperature' | 'rainfall' | 'humidity' | 'combined';
  title: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ type, title }) => {
  // Choose which data to display based on type
  const renderLines = () => {
    switch (type) {
      case 'temperature':
        return <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperature (°C)" strokeWidth={2} />;
      case 'rainfall':
        return <Line type="monotone" dataKey="rainfall" stroke="#22c55e" name="Rainfall (mm)" strokeWidth={2} />;
      case 'humidity':
        return <Line type="monotone" dataKey="humidity" stroke="#f59e0b" name="Humidity (%)" strokeWidth={2} />;
      case 'combined':
        return (
          <>
            <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperature (°C)" strokeWidth={2} />
            <Line type="monotone" dataKey="rainfall" stroke="#22c55e" name="Rainfall (mm)" strokeWidth={2} />
            <Line type="monotone" dataKey="humidity" stroke="#f59e0b" name="Humidity (%)" strokeWidth={2} />
          </>
        );
      default:
        return <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperature (°C)" />;
    }
  };

  return (
    <div className="card h-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={weatherData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--foreground)" />
            <YAxis stroke="var(--foreground)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                color: 'var(--card-foreground)', 
                borderColor: 'var(--border)'
              }}
            />
            <Legend />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
