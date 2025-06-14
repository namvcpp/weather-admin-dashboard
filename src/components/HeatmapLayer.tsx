"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

// Type definitions are now in src/types/leaflet-heat.d.ts

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
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const [opacity, setOpacity] = useState(0.4);
  // Pulsating animation effect for the heatmap with performance optimizations
  useEffect(() => {
    if (!animate) {
      // Reset opacity to default when animation is turned off
      setOpacity(0.6);
      return;
    }
    
    let increasing = true;
    let interval: ReturnType<typeof setInterval>;
    let lastUpdate = Date.now();
    const animationFrameTime = 100; // ms between updates
    
    try {
      interval = setInterval(() => {
        // Skip animation frames if too close together for better performance
        const now = Date.now();
        if (now - lastUpdate < animationFrameTime * 0.8) return;
        
        lastUpdate = now;
        setOpacity(prev => {
          // Smoother transition with easing
          if (prev >= 0.8) increasing = false;
          if (prev <= 0.4) increasing = true;
          const change = increasing ? 0.02 : -0.02;
          return Math.max(0.4, Math.min(0.8, prev + change));
        });
      }, animationFrameTime);
    } catch (error) {
      console.error('Error setting up animation interval:', error);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [animate]);
  // Memoize the heatpoints calculation to avoid unnecessary recalculations
  const processedHeatPoints = useMemo(() => {
    if (!points || !Array.isArray(points)) {
      console.warn('Invalid points array provided');
      return [];
    }
    
    // Ensure points array exists and filter out invalid points
    const validPoints = points.filter(p => p && typeof p === 'object' && 'lat' in p && 'lng' in p && 
      typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng));
    
    if (validPoints.length === 0) {
      console.warn('No valid points provided for heatmap layer');
      return [];
    }
    
    return validPoints.map(p => [
      p.lat,
      p.lng,
      p.intensity ? Math.min(1.0, p.intensity * 1.8) : 0.8 // Further increase intensity for better visibility
    ]) as [number, number, number][];
  }, [points]);
  
  useEffect(() => {
    if (!map) return;
    
    // Don't proceed if there are no valid points
    if (processedHeatPoints.length === 0) {
      return () => {};
    }
    
    // Create and add heat layer with improved visibility settings
    try {
      const heatLayer = L.heatLayer(processedHeatPoints, {
        radius,
        blur,
        maxZoom,
        max,
        gradient,
        minOpacity: opacity // Use the animated opacity value
      });
      
      // Store the layer reference before adding to map
      heatLayerRef.current = heatLayer;
      
      // Add the layer to map
      heatLayer.addTo(map);
      
      // Add pulse class to the canvas element for animation if needed
      if (animate && heatLayer._canvas) {
        heatLayer._canvas.classList.add('pulse');
      }
        // Update the layer if options change
      if (heatLayerRef.current !== heatLayer) {
        // Clean up previous layer if it exists
        try {
          const prevLayer = heatLayerRef.current;
          if (prevLayer && map.hasLayer(prevLayer)) {
            map.removeLayer(prevLayer);
          }
        } catch (e) {
          console.warn('Error removing previous heat layer:', e);
        }
      }

      // Cleanup function to remove layer when component unmounts or when dependencies change
      return () => {
        try {
          if (map && heatLayer && map.hasLayer(heatLayer)) {
            map.removeLayer(heatLayer);
          }
          // Only set to null if this exact layer is still the current one
          if (heatLayerRef.current === heatLayer) {
            heatLayerRef.current = null;
          }
        } catch (error) {
          console.warn('Error while removing heatmap layer:', error);
        }
      };
    } catch (error) {
      console.error('Error creating heatmap layer:', error);
      return () => {}; // Return empty cleanup function if creation failed
    }
  }, [map, processedHeatPoints, radius, blur, maxZoom, max, gradient, opacity, animate]);

  // This component doesn't render anything directly
  return null;
};

export default HeatmapLayer;
