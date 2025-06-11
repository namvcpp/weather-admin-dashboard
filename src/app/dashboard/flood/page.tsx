"use client";

import DashboardLayout from "@/components/DashboardLayout";
import MapComponent from "@/components/MapComponent";
import FloodStatistics from "@/components/FloodStatistics";
import SummaryCard from "@/components/SummaryCard";
import WaterLevelChart from "@/components/WaterLevelChart";
import { Droplets, AlertTriangle, ArrowUp, Waves, BarChart2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the map component to prevent SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-secondary flex items-center justify-center">Loading map...</div>
});

export default function FloodPage() {
  const [activeTimeFrame, setActiveTimeFrame] = useState("7days");
  
  const timeFrames = [
    { id: "7days", label: "Last 7 Days" },
    { id: "30days", label: "Last 30 Days" },
    { id: "1year", label: "Last Year" },
    { id: "alltime", label: "All Time" },
  ];
  return (
    <DashboardLayout>      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Da Nang Flood Data</h1>
        <p className="text-secondary-foreground">Detailed flood monitoring and analysis across Da Nang regions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="High Risk Zones" 
          value="3" 
          icon={<AlertTriangle size={24} className="text-red-500" />}
          change="1 new since yesterday" 
          trend="up" 
          bgColor="bg-red-50 dark:bg-red-900/20"
        />
        <SummaryCard 
          title="Moderate Risk Zones" 
          value="7" 
          icon={<Waves size={24} className="text-yellow-500" />}
          change="2 more than last week" 
          trend="up" 
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <SummaryCard 
          title="Average Water Level Rise" 
          value="2.7cm" 
          icon={<ArrowUp size={24} className="text-blue-500" />}
          change="0.5cm increase" 
          trend="up" 
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard 
          title="Monitoring Stations" 
          value="24/24" 
          icon={<Droplets size={24} className="text-green-500" />}
          change="All operational" 
          trend="neutral" 
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">          <div className="card">
            <h2 className="text-lg font-medium mb-4">Flood Risk Map</h2>
            <MapWithNoSSR />
            <div className="flex flex-wrap mt-4 gap-4 justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">High Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Moderate Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Low Risk</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded mr-2"></div>
                <span className="text-sm">Heatmap Intensity</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-secondary-foreground">
              <p>Use the layer controls in the top-right corner of the map to toggle between different visualizations, including the flood heatmap.</p>
            </div>
          </div>
        </div>
        <div>
          <FloodStatistics title="Flood Levels by Region" />
        </div>
      </div>      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-4">Historical Flood Data</h2>
        <div className="tabs-container mb-4">
          {timeFrames.map(timeFrame => (
            <div 
              key={timeFrame.id}
              className={`tab ${activeTimeFrame === timeFrame.id ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTimeFrame(timeFrame.id)}
            >
              {timeFrame.label}
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Location</th>
                <th className="py-2 px-4 text-left">Water Level</th>
                <th className="py-2 px-4 text-left">Change</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>              <tr className="border-b border-border">
                <td className="py-2 px-4">2025-06-10</td>
                <td className="py-2 px-4">Da Nang City Center</td>
                <td className="py-2 px-4">45.2cm</td>
                <td className="py-2 px-4 text-red-500">+2.1cm</td>
                <td className="py-2 px-4">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Alert</span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">2025-06-09</td>
                <td className="py-2 px-4">Son Tra District</td>
                <td className="py-2 px-4">32.7cm</td>
                <td className="py-2 px-4 text-red-500">+1.5cm</td>
                <td className="py-2 px-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Warning</span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">2025-06-08</td>
                <td className="py-2 px-4">Thanh Khe District</td>
                <td className="py-2 px-4">28.3cm</td>
                <td className="py-2 px-4 text-green-500">-0.7cm</td>
                <td className="py-2 px-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Normal</span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">2025-06-07</td>
                <td className="py-2 px-4">Hai Chau District</td>
                <td className="py-2 px-4">35.8cm</td>
                <td className="py-2 px-4 text-red-500">+1.2cm</td>
                <td className="py-2 px-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Warning</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4">2025-06-06</td>
                <td className="py-2 px-4">Hoa Vang District</td>
                <td className="py-2 px-4">26.4cm</td>
                <td className="py-2 px-4 text-green-500">-1.0cm</td>
                <td className="py-2 px-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Normal</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-lg font-medium mt-8 mb-4">Water Level & Rainfall Analysis</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WaterLevelChart 
          data={[
            { time: "00:00", waterLevel: 2.8, rainfall: 0.5, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "02:00", waterLevel: 2.9, rainfall: 1.2, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "04:00", waterLevel: 3.1, rainfall: 2.5, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "06:00", waterLevel: 3.2, rainfall: 3.8, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "08:00", waterLevel: 3.3, rainfall: 3.2, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "10:00", waterLevel: 3.4, rainfall: 2.5, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "12:00", waterLevel: 3.5, rainfall: 1.8, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "14:00", waterLevel: 3.6, rainfall: 0.7, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "16:00", waterLevel: 3.7, rainfall: 0.3, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "18:00", waterLevel: 3.6, rainfall: 0.1, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "20:00", waterLevel: 3.5, rainfall: 0.0, warningLevel: 3.0, dangerLevel: 4.0 },
            { time: "22:00", waterLevel: 3.4, rainfall: 0.0, warningLevel: 3.0, dangerLevel: 4.0 },
          ]}
          title="Han River Water Level (Last 24 Hours)"
          location="Da Nang City Center"
        />
        <WaterLevelChart 
          data={[
            { time: "00:00", waterLevel: 2.1, rainfall: 0.2, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "02:00", waterLevel: 2.1, rainfall: 0.5, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "04:00", waterLevel: 2.2, rainfall: 1.8, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "06:00", waterLevel: 2.3, rainfall: 2.5, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "08:00", waterLevel: 2.4, rainfall: 2.0, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "10:00", waterLevel: 2.5, rainfall: 1.5, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "12:00", waterLevel: 2.6, rainfall: 1.2, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "14:00", waterLevel: 2.6, rainfall: 0.8, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "16:00", waterLevel: 2.5, rainfall: 0.3, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "18:00", waterLevel: 2.4, rainfall: 0.0, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "20:00", waterLevel: 2.3, rainfall: 0.0, warningLevel: 2.5, dangerLevel: 3.5 },
            { time: "22:00", waterLevel: 2.2, rainfall: 0.0, warningLevel: 2.5, dangerLevel: 3.5 },
          ]}
          title="Cu De River Water Level (Last 24 Hours)"
          location="Northern Da Nang"
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-medium mb-4">Flood Prevention Measures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
            <h3 className="font-medium mb-2">Active Barriers</h3>
            <p className="text-3xl font-bold">7/10</p>
            <p className="text-sm text-secondary-foreground mt-2">3 barriers scheduled for deployment</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
            <h3 className="font-medium mb-2">Drainage Systems</h3>
            <p className="text-3xl font-bold">95%</p>
            <p className="text-sm text-secondary-foreground mt-2">Operational capacity</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg dark:bg-amber-900/20">
            <h3 className="font-medium mb-2">Early Warning</h3>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-secondary-foreground mt-2">System uptime</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
