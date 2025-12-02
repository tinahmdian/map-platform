import React from 'react';
import { TABS } from '../constants';

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: 'map' | 'layers' | 'data' | 'stats' | 'heatmap' | 'weather') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
                <div key={tab.id} className="relative group flex-1">
                    <button
                        onClick={() => onTabChange(tab.id as any)}
                        className={`w-full py-3 px-1 flex items-center justify-center gap-1 text-xs transition-colors cursor-pointer ${
                            activeTab === tab.id
                                ? 'text-teal-600 border-b-2 border-teal-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {tab.tooltip}
                    </div>
                </div>
            ))}
        </div>
    );
};