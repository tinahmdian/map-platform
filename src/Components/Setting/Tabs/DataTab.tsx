import React from 'react';
import { Download } from 'lucide-react';

interface DataTabProps {
    markers: any[];
    shapes: any[];
    statistics: any;
    onExport: () => void;
    onImport: (callback: (data: any) => void) => void;
}

export const DataTab: React.FC<DataTabProps> = ({onExport,}) => {

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Data Management</h3>
            <div className="space-y-3">
                <div className="relative group">
                    <button
                        onClick={onExport}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <Download className="w-5 h-5 text-teal-600" />
                        <div className="text-left">
                            <div className="font-medium text-gray-800">Export Map Data</div>
                            <div className="text-sm text-gray-600">Download markers and shapes (JSON)</div>
                        </div>
                    </button>
                </div>


            </div>
        </div>
    );
};
