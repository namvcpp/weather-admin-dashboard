"use client";

import DashboardLayout from "@/components/DashboardLayout";
import WeatherChart from "@/components/WeatherChart";
import FloodStatistics from "@/components/FloodStatistics";
import SummaryCard from "@/components/SummaryCard";
import { BarChart2, AreaChart, PieChart, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart as ReChartPie,
  Pie,
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const pieData = [
  { name: 'Severe Flooding', value: 15 },
  { name: 'Moderate Flooding', value: 30 },
  { name: 'Low Risk', value: 55 },
];

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

// Historical data for comparison
const historicalData = [
  { year: '2020', incidents: 12, damage: 2.5, deaths: 3 },
  { year: '2021', incidents: 15, damage: 3.1, deaths: 4 },
  { year: '2022', incidents: 18, damage: 3.8, deaths: 5 },
  { year: '2023', incidents: 22, damage: 4.2, deaths: 6 },
  { year: '2024', incidents: 20, damage: 3.9, deaths: 5 },
  { year: '2025', incidents: 16, damage: 3.4, deaths: 4 },
];

export default function StatsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Statistics & Analytics</h1>
        <p className="text-secondary-foreground">Detailed analysis and historical comparisons of flood and weather data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Data Points Analyzed" 
          value="12,547" 
          icon={<BarChart2 size={24} className="text-blue-500" />}
          change="1,245 more than last month" 
          trend="up" 
        />
        <SummaryCard 
          title="Average Accuracy" 
          value="94.7%" 
          icon={<PieChart size={24} className="text-green-500" />}
          change="2.3% improvement" 
          trend="up" 
        />
        <SummaryCard 
          title="Prediction Models" 
          value="8" 
          icon={<AreaChart size={24} className="text-purple-500" />}
          change="2 new models added" 
          trend="up" 
        />
        <SummaryCard 
          title="Trend Confidence" 
          value="High" 
          icon={<TrendingUp size={24} className="text-amber-500" />}
          change="Stable" 
          trend="neutral" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WeatherChart type="combined" title="Combined Weather Trends (7 Days)" />
        <FloodStatistics title="Flood Statistics by Region" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-medium mb-4">Historical Comparison (2020-2025)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={historicalData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--foreground)" />
                <YAxis stroke="var(--foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    color: 'var(--card-foreground)', 
                    borderColor: 'var(--border)'
                  }}
                />
                <Legend />
                <Bar dataKey="incidents" name="Flood Incidents" fill="#3b82f6" />
                <Bar dataKey="damage" name="Damage ($ millions)" fill="#f59e0b" />
                <Bar dataKey="deaths" name="Casualties" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Risk Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <ReChartPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    color: 'var(--card-foreground)', 
                    borderColor: 'var(--border)'
                  }}
                />
              </ReChartPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium mb-4">Statistical Highlights</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-left">Metric</th>
                <th className="py-2 px-4 text-left">Current Value</th>
                <th className="py-2 px-4 text-left">Previous Period</th>
                <th className="py-2 px-4 text-left">Change</th>
                <th className="py-2 px-4 text-left">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 px-4">Average Rainfall</td>
                <td className="py-2 px-4">58.3mm</td>
                <td className="py-2 px-4">45.2mm</td>
                <td className="py-2 px-4 text-red-500">+29.0%</td>
                <td className="py-2 px-4">↗️ Increasing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">Flood Incidents</td>
                <td className="py-2 px-4">16</td>
                <td className="py-2 px-4">20</td>
                <td className="py-2 px-4 text-green-500">-20.0%</td>
                <td className="py-2 px-4">↘️ Decreasing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">Evacuation Rate</td>
                <td className="py-2 px-4">87.5%</td>
                <td className="py-2 px-4">82.1%</td>
                <td className="py-2 px-4 text-green-500">+5.4%</td>
                <td className="py-2 px-4">↗️ Increasing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">Avg. Water Level</td>
                <td className="py-2 px-4">32.1cm</td>
                <td className="py-2 px-4">28.5cm</td>
                <td className="py-2 px-4 text-red-500">+12.6%</td>
                <td className="py-2 px-4">↗️ Increasing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 px-4">Weather Accuracy</td>
                <td className="py-2 px-4">94.7%</td>
                <td className="py-2 px-4">92.4%</td>
                <td className="py-2 px-4 text-green-500">+2.3%</td>
                <td className="py-2 px-4">↗️ Improving</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Economic Impact</td>
                <td className="py-2 px-4">$3.4M</td>
                <td className="py-2 px-4">$3.9M</td>
                <td className="py-2 px-4 text-green-500">-12.8%</td>
                <td className="py-2 px-4">↘️ Decreasing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
