import React from "react";
import "./ProviderComponent.css";
import mapboxgl from "mapbox-gl";
import markers from "./markers.json";

type Marker = {
  id: string;
  name: string;
  coords: [number, number];
  description?: string;
  rating?: number;
  price?: string;
  city?: string;
  thumbnail?: string;
};

type MapProps = {
  accessToken?: string;
  markers: Marker[];
  center?: [number, number];
  zoom?: number;
  headline?: string;
  description?: string;
};

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXJpY25pbmciLCJhIjoiY21icXlubWM1MDRiczJvb2xwM2p0amNyayJ9.n-3O6JI5nOp_Lw96ZO5vJQ";

export default function MapProvider(
  props: Partial<MapProps> & { markers?: Marker[] }
) {
  const fallback: MapProps = {
    markers: (markers as { places: Marker[] }).places ?? [],
    center: [-122.4098, 37.8001],
    zoom: 12,
    headline: "Pizza Map",
    description: "Explore top slices across the city",
  };
  const merged = { ...fallback, ...props };
  const { markers: places, center, zoom, headline, description, accessToken } =
    merged;
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  React.useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (accessToken) {
      mapboxgl.accessToken = accessToken;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
      attributionControl: false,
    });

    map.current.on("load", () => {
      places.forEach((place) => {
        new mapboxgl.Marker({ color: "#F46C21" })
          .setLngLat(place.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(`
              <div style="font-weight:600;">${place.name}</div>
              ${
                place.description
                  ? `<div style="font-size:12px;">${place.description}</div>`
                  : ""
              }
            `)
          )
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapContainer.current]);

  React.useEffect(() => {
    if (!map.current) return;
    const bounds = new mapboxgl.LngLatBounds();
    places.forEach((place) => bounds.extend(place.coords));
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 60 });
    }
  }, [places]);

  return (
    <div className="relative w-full min-h-[320px] bg-white text-black border border-black/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-4">
        <h3 className="text-lg font-medium">{headline}</h3>
        {description ? (
          <p className="text-sm text-black/60 mt-1">{description}</p>
        ) : null}
      </div>
      <div ref={mapContainer} className="w-full h-[360px]" />
    </div>
  );
}
