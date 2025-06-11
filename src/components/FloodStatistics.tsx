"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock flood data for the statistics
const floodData = [
  { region: 'North', current: 25, previous: 15, warning: 30 },
  { region: 'South', current: 45, previous: 20, warning: 40 },
  { region: 'East', current: 15, previous: 10, warning: 35 },
  { region: 'West', current: 32, previous: 28, warning: 40 },
  { region: 'Central', current: 28, previous: 22, warning: 45 },
];

interface FloodStatisticsProps {
  title: string;
}

const FloodStatistics: React.FC<FloodStatisticsProps> = ({ title }) => {
  return (
    <div className="card h-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={floodData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="region" stroke="var(--foreground)" />
            <YAxis stroke="var(--foreground)" label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                color: 'var(--card-foreground)', 
                borderColor: 'var(--border)'
              }}
            />
            <Legend />
            <Bar dataKey="current" name="Current Level" fill="#3b82f6" />
            <Bar dataKey="previous" name="Previous Week" fill="#6b7280" />
            <Bar dataKey="warning" name="Warning Level" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
          <p className="text-sm font-medium">Average Level</p>
          <p className="text-2xl font-bold">29cm</p>
        </div>
        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-md">
          <p className="text-sm font-medium">Alert Areas</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-md">
          <p className="text-sm font-medium">Monitoring Stations</p>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
};

export default FloodStatistics;
