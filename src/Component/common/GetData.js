import * as L from 'leaflet';

//link API and get mask data
export function GetMaskData() {
  return fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR0oowBRjj1goAMqtnugBiXMTMY8OCl14TGmgt3YDJi9w5BXs4VsfZQ9mDI')
    .then(res => { return res.json() })
    .then(data => { return data.features })
    .catch(err => console.log(err))
}

// For customMarker
const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='42.667' viewBox='0 0 32 42.667'><defs><style>.a{fill:#668afe;}.b{fill:none;stroke:#fff;stroke-linecap:round;stroke-width:4px;}</style></defs><g transform='translate(-960 -429)'><path class='a' d='M14.356,41.806C2.247,24.252,0,22.451,0,16a16,16,0,1,1,32,0c0,6.451-2.248,8.252-14.356,25.806a2,2,0,0,1-3.289,0Z' transform='translate(960 429)'/><g transform='translate(0 2)'><line class='b' x2='14' transform='translate(969 445)'/><line class='b' x2='14' transform='translate(976 438) rotate(90)'/></g></g></svg>";
const iconUrl = 'data:image/svg+xml;base64,' + btoa(svg);

export const blueIcon = L.icon({
  iconUrl: iconUrl,
});

