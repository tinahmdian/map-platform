export const formatCoordinate = (coord: number) => coord?.toFixed(6) || 'N/A';

export const formatBounds = (bounds: any) => {
    if (!bounds) return 'N/A';
    return `${bounds.getSouthWest().lat.toFixed(4)}, ${bounds.getSouthWest().lng.toFixed(4)} to ${bounds.getNorthEast().lat.toFixed(4)}, ${bounds.getNorthEast().lng.toFixed(4)}`;
};

export const exportData = (markers: any[], shapes: any[], statistics: any) => {
    const data = {
        markers,
        shapes,
        statistics,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `map-data-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importData = (callback: (data: any) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target?.result as string);
                    callback(data);
                } catch (error) {
                    alert('Error importing data: Invalid file format');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
};