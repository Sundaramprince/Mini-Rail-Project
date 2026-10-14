import React, { useState, useEffect, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Train, Station } from '../types/railway';
import { storageService } from '../services/storageService';
import { MapPin, Train as TrainIcon, Navigation, Compass, Layers, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDO-ZSVw9WVM5ilfvuGOAthppeBoUOl04o';

interface RailwayGoogleMapProps {
  selectedTrain?: Train | null;
  onSelectStation?: (stationCode: string, mode: 'source' | 'dest') => void;
  onBookTrain?: (train: Train) => void;
}

// Inner helper component to render route polylines using useMap()
const RoutePolyline: React.FC<{ path: { lat: number; lng: number }[]; color?: string }> = ({
  path,
  color = '#ea580c',
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length < 2 || typeof google === 'undefined' || !google.maps) return;

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.85,
      strokeWeight: 4,
      map,
    });

    // Fit map bounds to encompass the route
    const bounds = new google.maps.LatLngBounds();
    path.forEach(pt => bounds.extend(pt));
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, color]);

  return null;
};

// Inner helper component to center map on selection
const MapController: React.FC<{ center?: { lat: number; lng: number }; zoom?: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;
    map.panTo(center);
    if (zoom) map.setZoom(zoom);
  }, [map, center, zoom]);

  return null;
};

export const RailwayGoogleMap: React.FC<RailwayGoogleMapProps> = ({
  selectedTrain,
  onSelectStation,
  onBookTrain,
}) => {
  const stations = storageService.getStations();
  const allTrains = storageService.getTrains();

  const [activeTrainId, setActiveTrainId] = useState<string>(
    selectedTrain?.id || allTrains[0]?.id || ''
  );
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [infoWindowStation, setInfoWindowStation] = useState<Station | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  const currentTrain = useMemo(() => {
    return allTrains.find(t => t.id === activeTrainId) || selectedTrain || allTrains[0];
  }, [allTrains, activeTrainId, selectedTrain]);

  // Compute route path coordinates for the active train
  const routePath = useMemo(() => {
    if (!currentTrain || !currentTrain.route) return [];
    return currentTrain.route
      .map(stop => {
        const station = stations.find(s => s.code === stop.stationCode);
        if (station && station.lat && station.lng) {
          return { lat: station.lat, lng: station.lng, code: station.code, name: station.name };
        }
        return null;
      })
      .filter((pt): pt is { lat: number; lng: number; code: string; name: string } => pt !== null);
  }, [currentTrain, stations]);

  // Center of India initially
  const defaultCenter = { lat: 22.9734, lng: 78.6569 };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Indian Railways Live Network Map
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                Google Maps Platform
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive satellite &amp; route navigation across Indian Railway zones
            </p>
          </div>
        </div>

        {/* Train Selector Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <TrainIcon className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Active Route:</span>
          </div>
          <select
            value={activeTrainId}
            onChange={e => setActiveTrainId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
          >
            {allTrains.map(train => (
              <option key={train.id} value={train.id}>
                {train.trainNumber} - {train.trainName} ({train.sourceCode} &rarr; {train.destinationCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[520px] bg-slate-100 dark:bg-slate-950">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            defaultZoom={5}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            className="w-full h-full"
          >
            {/* Draw train route polyline if coordinates available */}
            {routePath.length >= 2 && <RoutePolyline path={routePath} color="#ea580c" />}

            {/* Render Station Markers */}
            {stations.map(station => {
              if (!station.lat || !station.lng) return null;
              const isRouteStation = routePath.some(pt => pt.code === station.code);
              const isSource = currentTrain?.sourceCode === station.code;
              const isDest = currentTrain?.destinationCode === station.code;

              return (
                <AdvancedMarker
                  key={station.code}
                  position={{ lat: station.lat, lng: station.lng }}
                  title={`${station.name} (${station.code})`}
                  onClick={() => {
                    setSelectedStation(station);
                    setInfoWindowStation(station);
                  }}
                >
                  <Pin
                    background={
                      isSource
                        ? '#16a34a' // Green for source
                        : isDest
                        ? '#dc2626' // Red for destination
                        : isRouteStation
                        ? '#ea580c' // Orange for route stop
                        : '#2563eb' // Blue for other network stations
                    }
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={isSource || isDest ? 1.25 : isRouteStation ? 1.1 : 0.9}
                  />
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Clicked Station */}
            {infoWindowStation && infoWindowStation.lat && infoWindowStation.lng && (
              <InfoWindow
                position={{ lat: infoWindowStation.lat, lng: infoWindowStation.lng }}
                onCloseClick={() => setInfoWindowStation(null)}
              >
                <div className="p-1 max-w-[240px] text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{infoWindowStation.name}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Station Code:</span>
                      <span className="font-mono font-bold text-blue-700">{infoWindowStation.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Zone:</span>
                      <span className="font-bold">{infoWindowStation.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">State:</span>
                      <span>{infoWindowStation.state}</span>
                    </div>
                  </div>

                  {onSelectStation && (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onSelectStation(infoWindowStation.code, 'source');
                          setInfoWindowStation(null);
                        }}
                        className="flex-1 py-1 px-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] text-center transition cursor-pointer"
                      >
                        From Here
                      </button>
                      <button
                        onClick={() => {
                          onSelectStation(infoWindowStation.code, 'dest');
                          setInfoWindowStation(null);
                        }}
                        className="flex-1 py-1 px-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] text-center transition cursor-pointer"
                      >
                        To Here
                      </button>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Floating Route Legend & Details Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-xs text-xs space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Route Details
            </span>
            <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-mono font-bold text-[10px]">
              {currentTrain.trainNumber}
            </span>
          </div>

          <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
            {currentTrain.trainName}
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {currentTrain.sourceName}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-red-600 dark:text-red-400">
              {currentTrain.destinationName}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <div>
              <span className="block font-medium">Distance:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {currentTrain.distanceKm} km
              </span>
            </div>
            <div>
              <span className="block font-medium">Avg Speed:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {currentTrain.averageSpeedKmH} km/h
              </span>
            </div>
          </div>

          {onBookTrain && (
            <button
              onClick={() => onBookTrain(currentTrain)}
              className="w-full mt-2 py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30 transition cursor-pointer"
            >
              <span>Book This Train</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Map Legend (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-[10px] space-y-1.5">
          <div className="font-bold text-slate-700 dark:text-slate-300">Map Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Origin Station</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Destination Station</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Intermediate Stop</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Railway Junction</span>
          </div>
        </div>
      </div>

      {/* Route Stops Ribbon */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
            Stops Timetable:
          </span>
          {currentTrain.route.map((stop, idx) => (
            <div
              key={stop.stationCode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {stop.stationName} ({stop.stationCode})
                </div>
                <div className="text-[10px] text-slate-400">
                  Arr: {stop.arrivalTime} &middot; Dep: {stop.departureTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
