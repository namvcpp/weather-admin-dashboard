"use client";

import DashboardLayout from "@/components/DashboardLayout";
import MapComponent from "@/components/MapComponent";
import WeatherChart from "@/components/WeatherChart";
import FloodStatistics from "@/components/FloodStatistics";
import SummaryCard from "@/components/SummaryCard";
import { Droplets, Cloud, AlertCircle, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map component to prevent SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-secondary flex items-center justify-center">Loading map...</div>
});

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-secondary-foreground">Monitor flood and weather data across regions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Active Flood Alerts" 
          value="3" 
          icon={<Droplets size={24} className="text-blue-500" />}
          change="1 more than yesterday" 
          trend="up" 
        />
        <SummaryCard 
          title="Average Rainfall" 
          value="5.2mm" 
          icon={<Cloud size={24} className="text-blue-500" />}
          change="2.1mm more than yesterday" 
          trend="up" 
        />
        <SummaryCard 
          title="Critical Warnings" 
          value="1" 
          icon={<AlertCircle size={24} className="text-red-500" />}
          change="Same as yesterday" 
          trend="neutral"
          bgColor="bg-red-50 dark:bg-red-950"
        />
        <SummaryCard 
          title="Monitored Areas" 
          value="12" 
          icon={<MapPin size={24} className="text-green-500" />}
          change="2 more than last week" 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Flood Risk Map</h2>
            <MapWithNoSSR />
          </div>
        </div>
        <div>
          <FloodStatistics title="Flood Levels by Region" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherChart type="temperature" title="Temperature Trends (7 Days)" />
        <WeatherChart type="rainfall" title="Rainfall Trends (7 Days)" />
      </div>

      <div className="mt-6">
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Recent Alerts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Location</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Severity</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">Today 09:45</td>
                  <td className="py-2 px-4">Central Region</td>
                  <td className="py-2 px-4">Flood Warning</td>
                  <td className="py-2 px-4">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-red-900 dark:text-red-300">High</span>
                  </td>
                  <td className="py-2 px-4">Active</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">Today 08:30</td>
                  <td className="py-2 px-4">Eastern Region</td>
                  <td className="py-2 px-4">Heavy Rainfall</td>
                  <td className="py-2 px-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Medium</span>
                  </td>
                  <td className="py-2 px-4">Active</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">Yesterday 16:15</td>
                  <td className="py-2 px-4">Northern Region</td>
                  <td className="py-2 px-4">Water Level Rise</td>
                  <td className="py-2 px-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Medium</span>
                  </td>
                  <td className="py-2 px-4">Monitoring</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Yesterday 10:20</td>
                  <td className="py-2 px-4">Southern Region</td>
                  <td className="py-2 px-4">Flood Warning</td>
                  <td className="py-2 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Low</span>
                  </td>
                  <td className="py-2 px-4">Resolved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
