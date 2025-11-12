//
// import Dexie from "dexie";
//
// class MyDatabase extends Dexie {
//     mapState!: Dexie.Table<MapState, number>;
//     markers!: Dexie.Table<MarkerData, number>;
//     shapes!: Dexie.Table<any, number>;
//
//     constructor() {
//         super("myDatabase");
//         this.version(3).stores({
//             mapState: "++id, centerLat, centerLng, zoom, activeLayer",
//             markers: "++id, lat, lng",
//             shapes: "++id,geojson"
//         });
//     }
// }
//
// export const db = new MyDatabase();
import { Dexie } from 'dexie';

// import {MapState} from "@/Types/components/Map";


class AppDB extends Dexie {
    mapState!: Dexie.Table<any, number>;
    markers!: Dexie.Table<any, number>;
    shapes!: Dexie.Table<any, number>;
    // settings!: Dexie.Table<Setting, number>;


    constructor() {
        super('AppDB');

        this.version(2).stores({
            mapState: '++id, centerLat, centerLng, zoom',
            markers: '++id, lat, lng, title, description,settingId',
            settings: '++id, name, color, visibility, createdAt',
            shapes: '++id, data,settingId, createdAt'

        });
    }
}

export const db = new AppDB();
