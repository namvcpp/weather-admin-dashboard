"use client";

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

// Define interface for heat map points
interface HeatPoint {
  lat: number;
  lng: number;
  intensity?: number; // Optional intensity value
  name?: string;      // Optional name for the point
}

interface HeatmapLayerProps {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
  max?: number;
  gradient?: Record<number, string>;
  animate?: boolean;
}

// Default gradient colors for rain heatmap with blue palette - enhanced contrast
const defaultGradient = {
  0.0: '#f0f9ff', // extremely light blue for very low - increased contrast
  0.2: '#bae6fd', // very light blue for low - brighter
  0.4: '#38bdf8', // light blue for medium-low - more saturated
  0.6: '#0284c7', // medium blue for medium - deeper
  0.8: '#1e40af', // strong blue for medium-high - richer
  1.0: '#1e3a8a'  // very dark blue for high - increased contrast
};

const HeatmapLayer = ({
  points,
  radius = 30,
  blur = 20,
  maxZoom = 18,
  max = 1.0,
  gradient = defaultGradient,
  animate = true
}: HeatmapLayerProps) => {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);
  const [opacity, setOpacity] = useState(0.4);

  // Pulsating animation effect for the heatmap
  useEffect(() => {
    if (!animate) return;
    
    let increasing = true;
    const interval = setInterval(() => {
      setOpacity(prev => {
        if (prev >= 0.8) increasing = false;
        if (prev <= 0.4) increasing = true;
        return increasing ? prev + 0.02 : prev - 0.02;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [animate]);
  useEffect(() => {
    if (!map) return;
    
    // Convert points to format required by Leaflet.heat with enhanced intensity
    // Ensure points are valid before mapping
    const validPoints = points.filter(p => p && typeof p === 'object' && 'lat' in p && 'lng' in p);
    const heatPoints = validPoints.map(p => [
      p.lat,
      p.lng,
      p.intensity ? Math.min(1.0, p.intensity * 1.8) : 0.8 // Further increase intensity for better visibility
    ]) as [number, number, number][];
    
    // Create and add heat layer with improved visibility settings
    const heatLayer = L.heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom,
      max,
      gradient,
      minOpacity: opacity // Use the animated opacity value
    }).addTo(map);
    
    // Add pulse class to the canvas element for animation if needed
    if (animate) {
      // Access the internal canvas property (requires type assertion)
      const heatLayerAny = heatLayer as any;
      if (heatLayerAny._canvas) {
        heatLayerAny._canvas.classList.add('pulse');
      }
    }
    
    heatLayerRef.current = heatLayer;

    // Cleanup function to remove layer when component unmounts
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom, max, gradient, opacity, animate]);

  // This component doesn't render anything directly
  return null;
};

export default HeatmapLayer;
