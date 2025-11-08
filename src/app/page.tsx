'use client'
import dynamic from 'next/dynamic';

const MapPage = dynamic(() => import('@/Components/Map'), { ssr: false });

export default function Page() {
    return <MapPage />;
}