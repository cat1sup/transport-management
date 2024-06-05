import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './Map.css';

// Fix marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = forwardRef((props, ref) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([44.435661, 25.974910], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(mapRef.current);

            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(44.435523, 25.974899),
                    L.latLng(44.424466, 26.047225),
                    L.latLng(44.435661, 26.102294),
                    L.latLng(44.407258, 26.120977)
                ],
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
    }, []);

    useImperativeHandle(ref, () => ({
        getRoutes() {
            if (routingControlRef.current) {
                const routes = routingControlRef.current._routes;
                if (routes) {
                    return routes.map(route => {
                        return route.instructions.map(instruction => {
                            return `${instruction.text} (${instruction.distance} meters, ${instruction.time} seconds)`;
                        }).join('\n');
                    }).join('\n\n');
                }
            }
            return 'No routes available';
        }
    }));

    return <div id="map" ref={mapContainerRef} className="map-container personalized-map-container"></div>;
});

export default Map;
