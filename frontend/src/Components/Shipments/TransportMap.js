import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TransportMap = forwardRef(({ coordinates, setRouteInfo }, ref) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const routingControlRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getRoutes: () => {
            if (routingControlRef.current) {
                const routes = routingControlRef.current.getRoutes();
                if (routes.length > 0) {
                    const routeSummary = routes[0].summary;
                    const routeInfoStr = `
Distance: ${routeSummary.totalDistance} meters
Time: ${routeSummary.totalTime} seconds
Waypoints:
${routes[0].waypoints.map((wp, i) => `Waypoint ${i + 1}: (${wp.latLng.lat}, ${wp.latLng.lng})`).join('\n')}
                    `;
                    setRouteInfo(routeInfoStr);
                }
            }
        }
    }));

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([44.435661, 25.974910], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(mapRef.current);

            routingControlRef.current = L.Routing.control({
                waypoints: coordinates.map(coord => L.latLng(coord[0], coord[1])),
                routeWhileDragging: true,
                createMarker: function (i, waypoint, n) {
                    return L.marker(waypoint.latLng, {
                        draggable: true,
                        icon: L.icon({
                            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                            className: 'custom-marker' // Custom class for additional styling
                        })
                    }).bindPopup(`Waypoint ${i + 1}`);
                }
            }).addTo(mapRef.current);
        }

        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.getPlan().setWaypoints([]);
                mapRef.current.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }

            if (mapRef.current) {
                mapRef.current.eachLayer(layer => {
                    mapRef.current.removeLayer(layer);
                });
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [coordinates]);

    return <div id="map" ref={mapContainerRef} className="map-container personalized-map-container"></div>;
});

export default TransportMap;
