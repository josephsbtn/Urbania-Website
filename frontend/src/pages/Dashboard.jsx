import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";
import MapSection from "../components/MapSection";
import AnalyticsCard from "../components/AnalyticsCard";
import ReportCard from "../components/ReportCard";
import StatusCards from "../components/StatusCards";
import SolarPanels from "../components/SolarPanel";
import { healthCheck } from "../services/api";
import ReportList from "../components/ReportList";

export default function Dashboard() {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [lastChecked, setLastChecked] = useState(new Date());

  // Check backend connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await healthCheck();
        setConnectionStatus(health.status === "OK" ? "connected" : "error");
      } catch (error) {
        setConnectionStatus("disconnected");
      }
      setLastChecked(new Date());
    };

    // Initial check
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500 animate-pulse" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Backend Connected";
      case "disconnected":
        return "Backend Offline (Using Mock Data)";
      case "error":
        return "Backend Error (Using Mock Data)";
      default:
        return "Checking Connection...";
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600 bg-green-50 border-green-200";
      case "disconnected":
        return "text-red-600 bg-red-50 border-red-200";
      case "error":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with connection status */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Urbania Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Smart City Management Platform</p>
          </div>

          {/* Connection Status Indicator */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getConnectionColor()}`}>
            {getConnectionIcon()}
            <span className="text-sm font-medium">{getConnectionText()}</span>
            <span className="text-xs opacity-70">
              Last: {lastChecked.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                🗺️ Interactive Map
                <span className="text-sm font-normal text-gray-500">
                  Click to add reports
                </span>
              </h2>
            </div>
            <MapSection />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📊 City Status
              <span className="text-sm font-normal text-gray-500">
                Real-time metrics
              </span>
            </h2>
            <StatusCards />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📊 Potential Solar Panel
                <span className="text-sm font-normal text-gray-500"></span>
              </h2>
              <SolarPanels />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                💻Citizen Report
                <span className="text-sm font-normal text-gray-500"></span>
              </h2>
              <ReportList />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📈 Analytics
              <span className="text-sm font-normal text-gray-500">
                Trends & insights
              </span>
            </h2>
            <AnalyticsCard />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📝 Report Issue
              <span className="text-sm font-normal text-gray-500">
                Submit with photo
              </span>
            </h2>
            <ReportCard />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>© 2025 Urbania Smart City Platform</div>
          <div>Version 1.0.0 | Made with ❤️ for Singapore</div>
        </div>
      </div>
    </div>
  );
}
