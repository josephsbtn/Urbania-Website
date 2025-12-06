import React from 'react';
import HudPanel from '../ui/HudPanel';
import { useCitizenReports } from '../../hooks/useCitizenReports';

const ReportsPanel = () => {
    const { reports, loading, error } = useCitizenReports();

    return (
        <HudPanel className="w-full h-full flex flex-col">
            <h3 className="text-xl font-bold text-cyber-accent mb-4">Citizen Reports</h3>
            <div className="flex-grow overflow-y-auto">
                {loading && <p>Loading reports...</p>}
                {error && <p className="text-red-500">Error loading reports</p>}
                <ul className="space-y-2">
                    {reports.map(report => (
                        <li key={report.id} className="p-2 bg-cyber-surface/50 border-l-2 border-cyber-secondary">
                            <p className="font-bold">{report.title}</p>
                            <p className="text-sm text-cyber-text-secondary">{report.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </HudPanel>
    );
};

export default ReportsPanel;
