import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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
                    const instructions = routes[0].instructions.map((instruction, i) => ({
                        step: i + 1,
                        text: instruction.text,
                    }));
                    setRouteInfo(instructions);
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
                            className: 'custom-marker'
                        })
                    }).bindPopup(`Waypoint ${i + 1}`);
                }
            }).on('routesfound', function(e) {
                const routes = e.routes[0].instructions.map((instruction, i) => ({
                    step: i + 1,
                    text: instruction.text,
                }));
                setRouteInfo(routes);
            }).addTo(mapRef.current);
        }

        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.getPlan().setWaypoints([]);
                routingControlRef.current.remove();
                routingControlRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.eachLayer((layer) => {
                    if (layer !== undefined && layer !== null) {
                        try {
                            mapRef.current.removeLayer(layer);
                        } catch (e) {
                            console.error("Error removing layer:", e);
                        }
                    }
                });
                mapRef.current.off();  // Remove all event listeners
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (routingControlRef.current) {
            routingControlRef.current.setWaypoints(coordinates.map(coord => L.latLng(coord[0], coord[1])));
        }
    }, [coordinates]);

    return <div id="map" ref={mapContainerRef} className="map-container personalized-map-container"></div>;
});

export default TransportMap;
