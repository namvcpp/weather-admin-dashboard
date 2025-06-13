"use client";

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

// Dynamically import the HeatmapLayer and WaterLevelIndicator to prevent SSR issues
const HeatmapLayer = dynamic(() => import('./HeatmapLayer'), { ssr: false });
const WaterLevelIndicator = dynamic(() => import('./WaterLevelIndicator'), { ssr: false });

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Mock data for flood zones/alerts
const floodZones = [  
  { id: 1, position: [16.047, 108.206], radius: 2000, level: 'severe', message: 'Heavy rainfall expected in Hải Châu district' },
  { id: 2, position: [16.067, 108.22], radius: 1500, level: 'moderate', message: 'Moderate rainfall expected in Sơn Trà district' },
  { id: 3, position: [16.03, 108.19], radius: 1000, level: 'low', message: 'Light rainfall expected in Cẩm Lệ district' },
];// Generate more detailed data points for flood heatmap visualization with improved visibility
const generateFloodHeatData = () => {  // Base points - areas with highest intensity in Da Nang, Vietnam
  const basePoints = [
    { lat: 16.047, lng: 108.206, intensity: 1.0, name: "Hải Châu" },         // Hai Chau district - severe
    { lat: 16.067, lng: 108.22, intensity: 0.95, name: "Sơn Trà" },          // Son Tra district - severe
    { lat: 16.03, lng: 108.19, intensity: 0.9, name: "Hòa Vang" },           // Hoa Vang district - severe
    { lat: 16.055, lng: 108.195, intensity: 0.95, name: "Thanh Khê" },       // Thanh Khe district - severe
    { lat: 16.075, lng: 108.17, intensity: 0.9, name: "Liên Chiểu" },        // Lien Chieu district - severe
    { lat: 16.06, lng: 108.24, intensity: 0.85, name: "Ngũ Hành Sơn" },      // Ngu Hanh Son district
    { lat: 16.04, lng: 108.17, intensity: 0.9, name: "Cẩm Lệ" },             // Cam Le district
    { lat: 16.02, lng: 108.22, intensity: 0.85, name: "Hòa Vang" },          // Hoa Vang district
    
    // Add more concentrated points around rivers and low-lying areas
    { lat: 16.058, lng: 108.223, intensity: 1.0, name: "Sông Hàn - Hải Châu" },   // Han River area - high risk
    { lat: 16.046, lng: 108.227, intensity: 1.0, name: "Sông Hàn - Sơn Trà" },    // Han River area - high risk
    { lat: 16.062, lng: 108.172, intensity: 0.9, name: "Sông Cu Đê - Liên Chiểu" }, // Cu De River - high risk
    { lat: 16.031, lng: 108.211, intensity: 0.95, name: "Sông Cẩm Lệ" },          // Cam Le River - high risk
    
    // Add coastal flood risk zones
    { lat: 16.098, lng: 108.247, intensity: 0.8, name: "Bờ biển Sơn Trà" },       // Son Tra coastal area
    { lat: 16.048, lng: 108.257, intensity: 0.85, name: "Bờ biển Ngũ Hành Sơn" }, // Ngu Hanh Son coastal area
    { lat: 16.001, lng: 108.244, intensity: 0.8, name: "Bờ biển phía Nam" }       // Southern coastal area
  ];
  
  // Generate additional points around base points to create a more natural spread
  const heatPoints = [...basePoints];
    // River patterns - create elongated risk patterns along rivers
  const createRiverPattern = (startLat: number, startLng: number, endLat: number, endLng: number, segments = 10, intensity = 0.9, width = 0.005) => {
    for (let i = 0; i < segments; i++) {
      const ratio = i / segments;
      const lat = startLat + (endLat - startLat) * ratio;
      const lng = startLng + (endLng - startLng) * ratio;
      
      // Add main river point
      heatPoints.push({ lat, lng, intensity, name: `River Point ${i}` });
      
      // Add width to river by adding points on either side
      for (let w = 1; w <= 3; w++) {
        const widthFactor = (w / 3) * width;
        heatPoints.push({ 
          lat: lat + widthFactor, 
          lng, 
          intensity: intensity * (1 - w/4),
          name: `River Width N${i}-${w}`
        });
        heatPoints.push({ 
          lat: lat - widthFactor, 
          lng, 
          intensity: intensity * (1 - w/4),
          name: `River Width S${i}-${w}`
        });
        heatPoints.push({ 
          lat, 
          lng: lng + widthFactor, 
          intensity: intensity * (1 - w/4),
          name: `River Width E${i}-${w}`
        });
        heatPoints.push({ 
          lat, 
          lng: lng - widthFactor, 
          intensity: intensity * (1 - w/4),
          name: `River Width W${i}-${w}`
        });
      }
    }
  };
  
  // Create Han River flood pattern
  createRiverPattern(16.065, 108.223, 16.032, 108.227, 15, 1.0, 0.006);
  
  // Create Cu De River pattern
  createRiverPattern(16.092, 108.133, 16.076, 108.191, 10, 0.95, 0.004);
  
  // Create Cam Le River pattern
  createRiverPattern(16.031, 108.211, 16.006, 108.228, 10, 0.95, 0.005);
  
  // Generate cluster points around base risk areas
  basePoints.forEach(point => {
    // Generate 20-30 points around each base point for denser visualization
    const pointCount = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < pointCount; i++) {
      // Random offset within ~1-2km
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      // Calculate distance factor to create a more natural gradient
      const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
      const normalizedDistance = distance / 0.014; // Normalize to 0-1 range
      
      // Intensity decreases as distance from center increases, but with a slower drop-off
      const intensityDrop = normalizedDistance * 0.35; // Even less steep drop-off
        heatPoints.push({
        lat: point.lat + latOffset,
        lng: point.lng + lngOffset,
        intensity: Math.max(0.35, point.intensity - intensityDrop), // Higher minimum intensity
        name: `${point.name} Area`
      });
    }
  });
  
  return heatPoints;
};

// Mock data for weather stations
const weatherStations = [
  { id: 1, position: [16.047, 108.206], name: 'Hải Châu', temperature: 32, humidity: 75, rainfall: 3.5 },
  { id: 2, position: [16.067, 108.22], name: 'Sơn Trà', temperature: 31, humidity: 80, rainfall: 4.2 },
  { id: 3, position: [16.03, 108.19], name: 'Hòa Vang', temperature: 33, humidity: 72, rainfall: 2.8 },
];

// Mock data for water level monitoring stations
const waterLevelData = [
  { 
    id: 1, 
    position: [16.059, 108.226] as [number, number], 
    name: 'Cầu Sông Hàn - Hải Châu',
    currentLevel: 3.2, 
    maxLevel: 5.0, 
    warningLevel: 2.5,
    dangerLevel: 4.0,
    timestamp: '2023-05-10 08:15:00'
  },
  { 
    id: 2, 
    position: [16.031, 108.211] as [number, number], 
    name: 'Sông Cẩm Lệ - Cẩm Lệ',
    currentLevel: 3.8, 
    maxLevel: 5.0, 
    warningLevel: 2.5,
    dangerLevel: 4.0,
    timestamp: '2023-05-10 08:20:00'
  },  { 
    id: 3, 
    position: [16.063, 108.173] as [number, number], 
    name: 'Sông Cu Đê - Liên Chiểu',
    currentLevel: 1.8, 
    maxLevel: 4.5, 
    warningLevel: 2.0,
    dangerLevel: 3.5,
    timestamp: '2023-05-10 08:25:00'
  },
  { 
    id: 4, 
    position: [16.045, 108.257] as [number, number], 
    name: 'Bờ biển Ngũ Hành Sơn',
    currentLevel: 1.5, 
    maxLevel: 4.0, 
    warningLevel: 1.8,
    dangerLevel: 3.0,
    timestamp: '2023-05-10 08:30:00'
  }
];

// Get color based on flood/rain level
const getFloodColor = (level: string) => {
  switch (level) {
    case 'severe': return '#1e40af'; // dark blue
    case 'moderate': return '#3b82f6'; // medium blue
    case 'low': return '#93c5fd'; // light blue
    default: return '#60a5fa';
  }
};

const MapComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [animateHeatmap, setAnimateHeatmap] = useState(true);
  const [heatmapRadius, setHeatmapRadius] = useState(30);
  const [heatmapBlur, setHeatmapBlur] = useState(20);
  const [heatmapIntensity, setHeatmapIntensity] = useState(0.9);
  const [showHeatmapControls, setShowHeatmapControls] = useState(false);
  
  // Generate flood heat data with useMemo to prevent unnecessary recalculations
  const floodHeatData = useMemo(() => generateFloodHeatData(), []);

  useEffect(() => {
    // Fix for SSR with Leaflet
    setIsMounted(true);
    
    // Fix for marker icons
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  if (!isMounted) {
    return <div className="h-[500px] w-full bg-secondary flex items-center justify-center">Loading map...</div>;
  }
  
  return (
    <div className="relative">
      <MapContainer center={[16.047, 108.206]} zoom={13} className="h-[500px] w-full rounded-md">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.Overlay checked name="Rainfall Zones">
            <>
              {floodZones.map(zone => (
                <Circle
                  key={zone.id}
                  center={zone.position as L.LatLngExpression}
                  radius={zone.radius}
                  pathOptions={{
                    color: getFloodColor(zone.level),
                    fillColor: getFloodColor(zone.level),
                    fillOpacity: 0.3
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{zone.level.toUpperCase()} RAINFALL ALERT</h3>
                      <p>{zone.message}</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </>
          </LayersControl.Overlay>
          
          <LayersControl.Overlay checked name="Weather Stations">
            <>
              {weatherStations.map(station => (
                <Marker key={station.id} position={station.position as L.LatLngExpression}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{station.name}</h3>
                      <p>Temperature: {station.temperature}°C</p>
                      <p>Humidity: {station.humidity}%</p>
                      <p>Rainfall: {station.rainfall}mm</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          </LayersControl.Overlay>          <LayersControl.Overlay checked name="Rainfall Intensity">
            <>{showHeatmap && <HeatmapLayer 
              points={floodHeatData} 
              radius={heatmapRadius} 
              blur={heatmapBlur} 
              max={heatmapIntensity} 
              animate={animateHeatmap} 
            />}</>
          </LayersControl.Overlay>
          
          <LayersControl.Overlay checked name="Water Level Indicators">
            <WaterLevelIndicator points={waterLevelData} />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      
      <div className={`absolute bottom-4 right-4 z-[1000] bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md flex flex-col gap-2.5 max-w-[220px] backdrop-blur-sm transition-all duration-300 ${!showHeatmapControls ? 'min-w-[180px]' : 'min-w-[220px]'}`}>
        <div className="flex items-center justify-between">
          <label htmlFor="heatmapToggle" className="text-sm font-medium cursor-pointer">Rainfall Intensity Map</label>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="heatmapToggle"
              checked={showHeatmap}
              onChange={() => setShowHeatmap(!showHeatmap)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
        </div>
          {showHeatmap && (
          <>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Visualizing rainfall intensity across Da Nang region
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <label htmlFor="animateToggle" className="text-sm cursor-pointer">Animate</label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="animateToggle"
                  checked={animateHeatmap}
                  onChange={() => setAnimateHeatmap(!animateHeatmap)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </div>
            </div><div className="relative flex items-center h-6 mt-2">
              <div className="w-full h-3 bg-gradient-to-r from-[#dbeafe] via-[#60a5fa] to-[#1e40af] rounded-sm"></div>
              <span className="text-xs absolute -bottom-4 left-0">Light</span>
              <span className="text-xs absolute -bottom-4 right-0">Heavy</span>
            </div>
            
            <div className="mt-5">
              <button 
                onClick={() => setShowHeatmapControls(!showHeatmapControls)} 
                className="text-xs flex items-center justify-center w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 py-1.5 px-2 rounded transition-colors"
              >
                {showHeatmapControls ? '▲ Hide Controls' : '▼ Show Controls'}
              </button>
            </div>            {showHeatmapControls && (
              <div className="mt-2 space-y-2.5 text-sm overflow-hidden transition-all duration-300 ease-in-out">
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-600 dark:text-gray-300">Radius</label>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">{heatmapRadius}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    value={heatmapRadius} 
                    onChange={(e) => setHeatmapRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-600 dark:text-gray-300">Blur</label>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">{heatmapBlur}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    value={heatmapBlur} 
                    onChange={(e) => setHeatmapBlur(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-600 dark:text-gray-300">Intensity</label>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">{heatmapIntensity.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.0" 
                    step="0.1"
                    value={heatmapIntensity} 
                    onChange={(e) => setHeatmapIntensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
