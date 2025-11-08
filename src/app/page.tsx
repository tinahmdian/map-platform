'use client'
import dynamic from 'next/dynamic';

const MapPage = dynamic(() => import('@/Components/Map/MapContainerWrapper'), { ssr: false });

export default function Page() {
    return <MapPage />;
}