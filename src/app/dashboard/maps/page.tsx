"use client";

import DashboardLayout from "@/components/DashboardLayout";
import SummaryCard from "@/components/SummaryCard";
import { Map, Layers, Pin, Filter } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the map component to prevent SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-secondary flex items-center justify-center">Loading map...</div>
});

export default function MapsPage() {
  const [activeTab, setActiveTab] = useState("combined");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Interactive Maps</h1>
        <p className="text-secondary-foreground">Explore detailed flood and weather data on interactive maps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Available Layers" 
          value="8" 
          icon={<Layers size={24} className="text-purple-500" />}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />
        <SummaryCard 
          title="Monitoring Points" 
          value="36" 
          icon={<Pin size={24} className="text-red-500" />}
          bgColor="bg-red-50 dark:bg-red-900/20"
        />
        <SummaryCard 
          title="Geographic Coverage" 
          value="95%" 
          icon={<Map size={24} className="text-blue-500" />}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard 
          title="Active Filters" 
          value="3/12" 
          icon={<Filter size={24} className="text-green-500" />}
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-4">Map Visualization</h2>
        <div className="tabs-container mb-4">
          <div className={`tab ${activeTab === "combined" ? "active" : ""}`} onClick={() => setActiveTab("combined")}>Combined Data</div>
          <div className={`tab ${activeTab === "flood" ? "active" : ""}`} onClick={() => setActiveTab("flood")}>Flood Risk</div>
          <div className={`tab ${activeTab === "weather" ? "active" : ""}`} onClick={() => setActiveTab("weather")}>Weather</div>
          <div className={`tab ${activeTab === "satellite" ? "active" : ""}`} onClick={() => setActiveTab("satellite")}>Satellite</div>
        </div>
        <MapWithNoSSR />        <div className="p-3 bg-secondary rounded-md mb-4">
          <h3 className="font-medium mb-2">Data Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">Data Type</label>
              <select className="rounded border border-gray-300 dark:border-gray-700 p-1.5 bg-white dark:bg-gray-800">
                <option value="rainfall">Rainfall</option>
                <option value="waterlevel">Water Levels</option>
                <option value="combined">Combined View</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">Time Range</label>
              <select className="rounded border border-gray-300 dark:border-gray-700 p-1.5 bg-white dark:bg-gray-800">
                <option value="today">Today</option>
                <option value="24h" selected>Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">Display Settings</label>
              <div className="flex items-center gap-3">
                <button className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">Reset View</button>
                <button className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">Save View</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-secondary rounded-md">
            <h3 className="font-medium">Legend</h3><div className="mt-2 space-y-2">              <div className="flex items-center">
                <div className="w-6 h-4 bg-gradient-to-r from-[#f0f9ff] via-[#38bdf8] to-[#1e3a8a] mr-2 rounded-sm"></div>
                <span className="text-sm">Rainfall Intensity</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#1e3a8a] mr-2"></div>
                <span className="text-sm">Heavy Rainfall</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#0284c7] mr-2"></div>
                <span className="text-sm">Moderate Rainfall</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#bae6fd] mr-2"></div>
                <span className="text-sm">Light Rainfall</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-black mr-2"></div>
                <span className="text-sm">Weather Station</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-[#1e40af] bg-transparent mr-2 rounded-full"></div>
                <span className="text-sm">Water Level Station</span>
              </div>
            </div>
          </div>          <div className="p-3 bg-secondary rounded-md">
            <h3 className="font-medium">Layers</h3>
            <div className="mt-2 space-y-2">              <div className="flex items-center">
                <input type="checkbox" id="layer1" className="mr-2" checked />
                <label htmlFor="layer1" className="text-sm">Vùng mưa các quận</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="layer2" className="mr-2" checked />
                <label htmlFor="layer2" className="text-sm">Trạm thời tiết</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="layer3" className="mr-2" checked />
                <label htmlFor="layer3" className="text-sm">Cường độ mưa</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="layer4" className="mr-2" checked />
                <label htmlFor="layer4" className="text-sm">Mực nước các quận</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="layer5" className="mr-2" />
                <label htmlFor="layer5" className="text-sm">Mật độ dân cư</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="layer6" className="mr-2" />
                <label htmlFor="layer4" className="text-sm">Cơ sở hạ tầng</label>
              </div>
            </div>
          </div>
          <div className="p-3 bg-secondary rounded-md">
            <h3 className="font-medium">Location Search</h3>
            <div className="mt-2">
              <input 
                type="text" 
                placeholder="Search for a location..." 
                className="w-full p-2 border border-border rounded-md bg-background"
              />
              <div className="mt-2">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">Search</button>
                <button className="px-3 py-1 ml-2 bg-secondary text-secondary-foreground rounded-md text-sm">My Location</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Recent Location Activity</h2>
          <div className="space-y-3">            {[              { time: "10 mins ago", action: "New rainfall warning added", area: "Hải Châu", user: "System" },
              { time: "25 mins ago", action: "Weather station status updated", area: "Sơn Trà", user: "Thanh Trúc" },
              { time: "1 hour ago", action: "Heavy rain alert issued", area: "Ngũ Hành Sơn", user: "Quốc Thành" },
              { time: "2 hours ago", action: "Risk assessment updated", area: "Cẩm Lệ", user: "System" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-secondary-foreground">{item.area}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{item.time}</p>
                  <p className="text-xs text-secondary-foreground">by {item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Map Coordinates</h2>
          <div className="grid grid-cols-2 gap-4">            <div className="p-3 bg-secondary/50 rounded-md">
              <p className="text-sm text-secondary-foreground">Center Latitude</p>
              <p className="text-lg font-mono">16.047</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-md">
              <p className="text-sm text-secondary-foreground">Center Longitude</p>
              <p className="text-lg font-mono">108.206</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-md">
              <p className="text-sm text-secondary-foreground">Zoom Level</p>
              <p className="text-lg font-mono">13</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-md">
              <p className="text-sm text-secondary-foreground">Map Provider</p>
              <p className="text-lg">OpenStreetMap</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Export Options</h3>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">Export as PNG</button>
              <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">Export as PDF</button>
              <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">Share Link</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
