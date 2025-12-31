import { useSyncExternalStore } from "react";
import { mapService, MapService } from "./mapService";
import type { MapGrid } from "./mapTypes";

export function useMapGrid(service: MapService = mapService): MapGrid {
  return useSyncExternalStore(service.subscribe, service.getSnapshot, service.getSnapshot);
}
