"use client";

import { useState, useEffect } from 'react';
import { Marker, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface WaterLevelPoint {
  id: number;
  position: [number, number]; // [lat, lng]
  name: string;
  currentLevel: number;
  maxLevel: number;
  warningLevel: number;
  dangerLevel: number;
  timestamp: string;
}

interface WaterLevelIndicatorProps {
  points: WaterLevelPoint[];
}

const WaterLevelIndicator: React.FC<WaterLevelIndicatorProps> = ({ points }) => {
  // Calculate percentage of water level relative to max level
  const getWaterLevelPercentage = (current: number, max: number) => {
    return Math.min(100, (current / max) * 100);
  };

  // Get color based on water level relative to warning and danger levels
  const getWaterLevelColor = (current: number, warning: number, danger: number) => {
    if (current >= danger) return '#1e3a8a'; // dark blue for danger
    if (current >= warning) return '#2563eb'; // medium blue for warning
    return '#60a5fa'; // light blue for safe
  };

  // Get radius for the circle marker based on the water level
  const getMarkerRadius = (current: number, max: number) => {
    // Base size that scales with the water level percentage
    const percentage = getWaterLevelPercentage(current, max);
    return 8 + (percentage / 100) * 12; // Range from 8px to 20px
  };

  return (
    <>
      {points.map(point => (
        <CircleMarker 
          key={point.id}
          center={point.position}
          radius={getMarkerRadius(point.currentLevel, point.maxLevel)}
          pathOptions={{
            color: getWaterLevelColor(point.currentLevel, point.warningLevel, point.dangerLevel),
            fillColor: getWaterLevelColor(point.currentLevel, point.warningLevel, point.dangerLevel),
            fillOpacity: 0.7,
            weight: 2
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg">{point.name}</h3>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Water Level:</span>
                  <span className="font-mono font-medium">{point.currentLevel.toFixed(1)}m</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      point.currentLevel >= point.dangerLevel 
                        ? 'bg-blue-800' 
                        : point.currentLevel >= point.warningLevel 
                          ? 'bg-blue-600' 
                          : 'bg-blue-400'
                    }`}
                    style={{ width: `${getWaterLevelPercentage(point.currentLevel, point.maxLevel)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                  <span>0m</span>
                  <span>{point.maxLevel}m (max)</span>
                </div>
                <div className="mt-1.5 text-xs">
                  <div className="flex items-center mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-800 mr-2"></span>
                    <span>Danger Level: {point.dangerLevel}m</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                    <span>Warning Level: {point.warningLevel}m</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Last updated: {point.timestamp}
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
};

export default WaterLevelIndicator;
