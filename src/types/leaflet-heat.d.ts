// This adds the Leaflet.heat module to the Leaflet namespace
import * as L from "leaflet";

declare module "leaflet.heat" {
  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }
}

declare module "leaflet" {
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: L.HeatLayerOptions
  ): L.Layer;

  interface Layer {
    setLatLngs(latlngs: Array<[number, number, number?]>): void;
    redraw(): void;
  }
}
