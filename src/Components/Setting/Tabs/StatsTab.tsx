import React from 'react';
import { Navigation, Flame, Trees, MapPin, RefreshCw } from 'lucide-react';
import { Statistics, MapLocation, HeatmapSettings } from '@/types/types';
import { formatCoordinate, formatBounds } from '@/utils/settingFunctions';

interface StatsTabProps {
    statistics: Statistics;
    isLoading: boolean;
    currentLocation?: MapLocation;
    heatmapVisible: boolean;
    heatmapSettings: HeatmapSettings;
    onRefresh: () => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({
                                                      statistics,
                                                      isLoading,
                                                      currentLocation,
                                                      heatmapVisible,
                                                      heatmapSettings,
                                                      onRefresh,
                                                  }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Real-time Statistics</h3>
                <div className="relative group">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Refresh statistics
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Navigation className="w-4 h-4 text-teal-600" />
                    <span className="font-medium text-gray-800">Current View</span>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Center:</span>
                        <span className="font-mono text-gray-800 text-xs">
              {currentLocation&&formatCoordinate(currentLocation.lat)}, {currentLocation&&formatCoordinate(currentLocation.lng)}
            </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Zoom Level:</span>
                        <span className="font-mono text-gray-800">
              {currentLocation?.zoom ?? 'N/A'}
            </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">View Bounds:</span>
                        <span className="text-xs font-mono text-gray-800 text-right">
              {currentLocation ? formatBounds(currentLocation.bounds) : 'N/A'}
            </span>
                    </div>
                </div>
            </div>

            {heatmapVisible && (
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Flame className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-800">Heatmap Analysis</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-white rounded cursor-default">
                            <div className="text-orange-600 font-semibold">{statistics.heatmapPoints}</div>
                            <div className="text-gray-600 text-xs">Data Points</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded cursor-default">
                            <div className="text-orange-600 font-semibold">
                                {heatmapSettings.intensity.toFixed(1)}
                            </div>
                            <div className="text-gray-600 text-xs">Intensity</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded cursor-default">
                            <div className="text-orange-600 font-semibold">
                                {heatmapSettings.radius}px
                            </div>
                            <div className="text-gray-600 text-xs">Radius</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded cursor-default">
                            <div className="text-orange-600 font-semibold">
                                {heatmapSettings.blur}px
                            </div>
                            <div className="text-gray-600 text-xs">Blur</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Trees className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-800">Area Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-white rounded cursor-default">
                        <div className="text-green-600 font-semibold">{statistics.forestCover}</div>
                        <div className="text-gray-600 text-xs">Total Area</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded cursor-default">
                        <div className="text-green-600 font-semibold">{statistics.carbonStorage}</div>
                        <div className="text-gray-600 text-xs">Carbon Storage</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded cursor-default">
                        <div className="text-green-600 font-semibold">{statistics.elevation}</div>
                        <div className="text-gray-600 text-xs">Elevation</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded cursor-default">
                        <div className="text-green-600 font-semibold">{statistics.biodiversityIndex}</div>
                        <div className="text-gray-600 text-xs">Biodiversity</div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800">Map Data</span>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center cursor-default">
                        <span className="text-gray-600">Total Markers:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {statistics.totalMarkers}
            </span>
                    </div>
                    <div className="flex justify-between items-center cursor-default">
                        <span className="text-gray-600">Total Shapes:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {statistics.totalShapes}
            </span>
                    </div>
                    <div className="flex justify-between items-center cursor-default">
                        <span className="text-gray-600">Area Type:</span>
                        <span className="text-gray-800 font-medium">{statistics.areaType}</span>
                    </div>
                    <div className="flex justify-between items-center cursor-default">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-800 text-xs">{statistics.lastUpdated}</span>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading real-time data...</p>
                </div>
            )}
        </div>
    );
};