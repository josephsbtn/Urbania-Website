import React from 'react';
import HudPanel from '../ui/HudPanel';
import { useAnalytics } from '../../hooks/useAnalytics';

const AnalyticsPanel = () => {
    const { data, loading, error } = useAnalytics();

    if (loading) return <HudPanel className="w-full h-full flex items-center justify-center"><p>Loading Analytics...</p></HudPanel>;
    if (error) return <HudPanel className="w-full h-full flex items-center justify-center"><p className="text-red-500">Error loading data</p></HudPanel>;

    return (
        <HudPanel className="w-full h-full flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-cyber-accent">City Analytics</h3>
            <div>
                <p className="text-cyber-secondary">Population:</p>
                <p className="text-2xl font-bold">{data?.population.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-cyber-secondary">Energy Consumption:</p>
                <p className="text-2xl font-bold">{data?.energy.current} MW</p>
            </div>
            <div>
                <p className="text-cyber-secondary">Water Usage:</p>
                <p className="text-2xl font-bold">{data?.water.usage} m³</p>
            </div>
        </HudPanel>
    );
};

export default AnalyticsPanel;
