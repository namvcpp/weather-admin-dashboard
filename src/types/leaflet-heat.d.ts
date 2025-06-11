// This adds the Leaflet.heat module to the Leaflet namespace
import * as L from "leaflet";

declare module "leaflet.heat" {
  // No declarations needed here since we're declaring them in the Leaflet module
}

declare module "leaflet" {
  interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: Array<[number, number, number?]>): this;
    addLatLng(latlng: [number, number, number?]): this;
    setOptions(options: HeatLayer.Options): this;
    redraw(): void;
    _canvas: HTMLCanvasElement;
  }
  
  namespace HeatLayer {
    interface Options {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: Record<number, string>;
    }
  }
  
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: HeatLayer.Options
  ): HeatLayer;
}
