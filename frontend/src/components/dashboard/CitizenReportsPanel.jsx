import React, { useState, useEffect } from 'react';
import { getCitizenReports } from '../../services/api';

const CitizenReportsPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getCitizenReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="absolute top-20 left-4 w-80 z-20 space-y-2">
      {/* Reports Header */}
      <div className="bg-cyber-surface/90 backdrop-blur-md border border-cyber-secondary/50 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
            <span className="text-cyber-secondary text-xs font-mono">CITIZEN REPORTS</span>
          </div>
          <span className="text-cyber-text-secondary text-[10px]">
            {reports.length} total
          </span>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-cyber-surface/90 backdrop-blur-md border-2 border-cyber-secondary/50 p-4 max-h-96 overflow-y-auto">
        <h3 className="text-cyber-secondary font-bold text-sm mb-3">📋 Recent Reports</h3>
        <div className="space-y-2">
          {reports.slice(0, 5).map((report, idx) => (
            <div key={idx} className="bg-cyber-dark/50 p-2 rounded border border-cyber-secondary/30">
              <div className="flex justify-between items-start mb-1">
                <span className="text-cyber-accent text-xs font-bold">
                  Report #{idx + 1}
                </span>
                <span className="text-cyber-text-secondary text-[10px]">
                  {report.timestamp ? new Date(report.timestamp).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              {report.description && (
                <p className="text-cyber-text-primary text-xs line-clamp-2">
                  {report.description}
                </p>
              )}
              {report.category && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-cyber-secondary/20 text-cyber-secondary text-[10px] rounded">
                  {report.category}
                </span>
              )}
              {(report.latitude && report.longitude) && (
                <div className="text-cyber-text-secondary text-[10px] mt-1">
                  📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </div>
              )}
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-cyber-text-secondary text-xs text-center py-4">
              No reports available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenReportsPanel;
