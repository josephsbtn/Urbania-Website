import React from 'react';
import HudPanel from '../ui/HudPanel';

const LayersPanel = ({ layers, toggleLayer }) => {
    return (
        <HudPanel className="w-full h-full">
            <h3 className="text-xl font-bold text-cyber-accent mb-4">Map Layers</h3>
            <div className="space-y-2">
                {Object.entries(layers).map(([id, layer]) => (
                    <div key={id} className="flex items-center justify-between">
                        <label htmlFor={id} className="text-cyber-text-primary">{layer.name}</label>
                        <input
                            type="checkbox"
                            id={id}
                            checked={layer.visible}
                            onChange={() => toggleLayer(id)}
                            className="form-checkbox h-5 w-5 text-cyber-primary bg-cyber-surface border-cyber-primary focus:ring-cyber-primary"
                        />
                    </div>
                ))}
            </div>
        </HudPanel>
    );
};

export default LayersPanel;
