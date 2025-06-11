"use client";

import DashboardLayout from "@/components/DashboardLayout";
import WeatherChart from "@/components/WeatherChart";
import SummaryCard from "@/components/SummaryCard";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map component to prevent SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-secondary flex items-center justify-center">Loading map...</div>
});

export default function WeatherPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Weather Data</h1>
        <p className="text-secondary-foreground">Comprehensive weather monitoring and forecasting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Average Temperature" 
          value="22°C" 
          icon={<Thermometer size={24} className="text-red-500" />}
          change="1.5°C higher than avg." 
          trend="up" 
          bgColor="bg-red-50 dark:bg-red-900/20"
        />
        <SummaryCard 
          title="Rainfall (24h)" 
          value="8.3mm" 
          icon={<Cloud size={24} className="text-blue-500" />}
          change="3.1mm above normal" 
          trend="up" 
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard 
          title="Humidity" 
          value="68%" 
          icon={<Droplets size={24} className="text-teal-500" />}
          change="5% higher than yesterday" 
          trend="up" 
          bgColor="bg-teal-50 dark:bg-teal-900/20"
        />
        <SummaryCard 
          title="Wind Speed" 
          value="12km/h" 
          icon={<Wind size={24} className="text-slate-500" />}
          change="2km/h less than yesterday" 
          trend="down" 
          bgColor="bg-slate-50 dark:bg-slate-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Weather Stations Map</h2>
            <MapWithNoSSR />
            <div className="flex mt-4 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm">Rain</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Sunny</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-sm">Cloudy</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card h-full">
            <h2 className="text-lg font-medium mb-4">Weather Forecast</h2>
            <div className="space-y-4">
              {[
                { day: "Today", temp: "22°C", condition: "Rainy", icon: "🌧️", precipitation: "80%" },
                { day: "Tomorrow", temp: "23°C", condition: "Cloudy", icon: "☁️", precipitation: "40%" },
                { day: "Wednesday", temp: "25°C", condition: "Partly Cloudy", icon: "⛅", precipitation: "20%" },
                { day: "Thursday", temp: "26°C", condition: "Sunny", icon: "☀️", precipitation: "10%" },
                { day: "Friday", temp: "24°C", condition: "Cloudy", icon: "☁️", precipitation: "30%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.day}</p>
                      <p className="text-sm text-secondary-foreground">{item.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.temp}</p>
                    <p className="text-sm text-secondary-foreground">💧 {item.precipitation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <WeatherChart type="temperature" title="Temperature Trends (7 Days)" />
        <WeatherChart type="rainfall" title="Rainfall Trends (7 Days)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherChart type="humidity" title="Humidity Trends (7 Days)" />
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Weather Alerts</h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md dark:bg-red-950 dark:border-red-500">
              <div className="flex justify-between">
                <h3 className="font-medium text-red-700 dark:text-red-300">Heavy Rain Warning</h3>
                <span className="text-sm text-red-700 dark:text-red-300">2 hours ago</span>
              </div>
              <p className="text-sm mt-1">Potential for flash flooding in low-lying areas. Expected rainfall: 50-75mm.</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-md dark:bg-yellow-950 dark:border-yellow-500">
              <div className="flex justify-between">
                <h3 className="font-medium text-yellow-700 dark:text-yellow-300">Wind Advisory</h3>
                <span className="text-sm text-yellow-700 dark:text-yellow-300">5 hours ago</span>
              </div>
              <p className="text-sm mt-1">Strong winds expected in coastal regions with gusts up to 45km/h.</p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md dark:bg-blue-950 dark:border-blue-500">
              <div className="flex justify-between">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">Thunderstorm Watch</h3>
                <span className="text-sm text-blue-700 dark:text-blue-300">Yesterday</span>
              </div>
              <p className="text-sm mt-1">Potential for lightning and thunder in eastern regions starting evening.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
