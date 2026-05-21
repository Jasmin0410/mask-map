import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as L from "leaflet";
import "leaflet.markercluster";
import marker from "../style/img/marker.svg";
import phone from "../style/img/phone.svg";
import { GetMaskData, blueIcon } from "./common/GetData";

const maskStatus = (n) => (n === 0 ? "soldout" : "stock");

const storePopupHTML = (props) =>
  `<div>
    <div class="store-name">${props.name}</div>
    <div class="store-info">
      <img class="icon" src=${marker} />${props.address}
    </div>
    <div class="store-info">
      <img class="icon" src=${phone} />${props.phone}
    </div>
    <div class="mask-status">
      <div class='popup mask-item ${maskStatus(props.mask_adult)}'>大人: ${props.mask_adult}</div>
      <div class='popup mask-item ${maskStatus(props.mask_child)}'>小孩: ${props.mask_child}</div>
    </div>
  </div>`;

function MaskMap() {
  const location = useSelector((state) => state);
  const mapRef = useRef(null);
  const storedataRef = useRef([]);
  const initialLocation = useRef(location);

  useEffect(() => {
    const map = L.map("map", { center: initialLocation.current, zoom: 16 });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const importData = () =>
      GetMaskData().then((data) => {
        storedataRef.current = data;
        const markers = L.markerClusterGroup().addTo(map);
        for (let i = 0; i < data.length - 1; i++) {
          const [lon, lat] = data[i].geometry.coordinates;
          markers.addLayer(
            L.marker([lat, lon], { icon: blueIcon }).bindPopup(
              storePopupHTML(data[i].properties),
              { closeButton: false },
            ),
          );
        }
        map.addLayer(markers);
      });

    importData();
    const timer = setInterval(importData, 60000);
    return () => {
      clearInterval(timer);
      map.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.panTo(location);

    const centerStore = storedataRef.current.find(
      (store) =>
        store.geometry.coordinates[1] === location[0] &&
        store.geometry.coordinates[0] === location[1],
    );

    if (centerStore) {
      map.setView(location, 18);
      L.popup()
        .setLatLng(location)
        .setContent(storePopupHTML(centerStore.properties))
        .openOn(map);
    }
  }, [location]);

  return <div id="map"></div>;
}

export default MaskMap;
