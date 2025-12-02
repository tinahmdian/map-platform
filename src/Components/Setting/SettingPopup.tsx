'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SettingsPopupProps } from '@/types/types';
import { useStatistics, useLocalSettings } from '@/utils/useSetting';
import { exportData, importData } from '@/utils/settingFunctions';
import { MapTab } from './Tabs/MapTab';
import { WeatherTab } from './Tabs/WeatherTab';
import { HeatmapTab } from './Tabs/HetaMapTab';
import { StatsTab } from './Tabs/StatsTab';
import { DataTab } from './Tabs/DataTab';
import { TabNavigation } from './ui/TabNavigation';

export const SettingsPopup: React.FC<SettingsPopupProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                onWeatherHeatmapToggle,
                                                                onWeatherHeatmapSettingsChange,
                                                                weatherHeatmapVisible = false,
                                                                weatherHeatmapSettings = { weatherType: 'temperature', opacity: 0.7, updateInterval: 30 },
                                                                onBaseMapChange,
                                                                onLayerToggle,
                                                                onHeatmapToggle,
                                                                onHeatmapSettingsChange,
                                                                currentLocation,
                                                                markers = [],
                                                                shapes = [],
                                                                onRefreshStats,
                                                                heatmapVisible = false,
                                                                heatmapSettings = { intensity: 1.0, radius: 25, blur: 15 },
                                                            }) => {
    const [activeTab, setActiveTab] = React.useState<'map' | 'layers' | 'data' | 'stats' | 'heatmap' | 'weather'>('map');
    const [baseMap, setBaseMap] = React.useState('standard');

    const [localWeatherHeatmapVisible, setLocalWeatherHeatmapVisible] = useLocalSettings(
        weatherHeatmapVisible,
        onWeatherHeatmapToggle
    );

    const [localWeatherHeatmapSettings, setLocalWeatherHeatmapSettings] = useLocalSettings(
        weatherHeatmapSettings,
        onWeatherHeatmapSettingsChange
    );

    const [localHeatmapVisible, setLocalHeatmapVisible] = useLocalSettings(
        heatmapVisible,
        onHeatmapToggle
    );

    const [localHeatmapSettings, setLocalHeatmapSettings] = useLocalSettings(
        heatmapSettings,
        onHeatmapSettingsChange
    );

    const { statistics, isLoading, calculateStatistics } = useStatistics(markers, shapes, currentLocation);

    useEffect(() => {
        if (isOpen && activeTab === 'stats') {
            calculateStatistics();
        }
    }, [isOpen, activeTab, markers.length, shapes.length]);

    const handleBaseMapChange = (mapType: string) => {
        setBaseMap(mapType);
        onBaseMapChange(mapType);
    };

    const handleApplySettings = () => {
        onClose();
    };

    if (!isOpen) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'map':
                return <MapTab baseMap={baseMap} onBaseMapChange={handleBaseMapChange} />;

            case 'weather':
                return (
                    <WeatherTab
                        visible={localWeatherHeatmapVisible}
                        settings={localWeatherHeatmapSettings}
                        onToggle={setLocalWeatherHeatmapVisible}
                        onSettingsChange={setLocalWeatherHeatmapSettings}
                    />
                );

            case 'heatmap':
                return (
                    <HeatmapTab
                        visible={localHeatmapVisible}
                        settings={localHeatmapSettings}
                        markers={markers}
                        shapes={shapes}
                        onToggle={setLocalHeatmapVisible}
                        onSettingsChange={setLocalHeatmapSettings}
                    />
                );

            case 'stats':
                return (
                    <StatsTab
                        statistics={statistics}
                        isLoading={isLoading}
                        currentLocation={currentLocation}
                        heatmapVisible={localHeatmapVisible}
                        heatmapSettings={localHeatmapSettings}
                        onRefresh={() => {
                            calculateStatistics();
                            onRefreshStats?.();
                        }}
                    />
                );

            case 'data':
                return (
                    <DataTab
                        markers={markers}
                        shapes={shapes}
                        statistics={statistics}
                        onExport={() => exportData(markers, shapes, statistics)}
                        onImport={importData}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-end m-3 justify-end bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl w-126 max-h-[80vh] overflow-hidden">
                <Header onClose={onClose} />

                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="p-6 max-h-96 overflow-y-auto">
                    {renderTabContent()}
                </div>

                <Footer onApply={handleApplySettings} />
            </div>
        </div>
    );
};

const Header: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Map Settings</h2>
        <TooltipButton
            onClick={onClose}
            icon={X}
            tooltip="Close settings"
        />
    </div>
);

const Footer: React.FC<{ onApply: () => void }> = ({ onApply }) => (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
            onClick={onApply}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium cursor-pointer"
        >
            Apply Settings
        </button>
    </div>
);

const TooltipButton: React.FC<{
    onClick: () => void;
    icon: React.ComponentType<any>;
    tooltip: string;
}> = ({ onClick, icon: Icon, tooltip }) => (
    <div className="relative group">
        <button
            onClick={onClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
            <Icon className="w-5 h-5 text-gray-600" />
        </button>
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {tooltip}
        </div>
    </div>
);