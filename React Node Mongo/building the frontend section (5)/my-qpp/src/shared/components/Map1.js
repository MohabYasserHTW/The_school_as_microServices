import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { useGeographic } from 'ol/proj';
import XYZ from 'ol/source/XYZ';

 
const Map1 = props => {
  const mapRef = useRef();
  const { center, zoom } = props;
 
  useEffect(() => {
const map = new Map({
  view: new View({
    center: [center.lat,center.lng],
    zoom: 2,
  }),
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    })
  ],
  target: 'map',
})}
, [center, zoom]);
 
  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    ></div>
  );
};
 
export default Map1;