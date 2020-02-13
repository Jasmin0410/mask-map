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

//SVG icon

// export const phoneIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12.25" viewBox="0 0 14 12.25"><defs><style>.a{fill:#888;}</style></defs><path class="a" d="M10.129,36.382A1.75,1.75,0,0,0,8.609,35.5H5.39a1.75,1.75,0,0,0-1.52.882L.99,41.423a.875.875,0,0,0-.115.434v1.518a.875.875,0,0,0,.875.875h10.5a.875.875,0,0,0,.875-.875V41.857a.875.875,0,0,0-.115-.434ZM7,41.625a1.969,1.969,0,1,1,1.969-1.969A1.969,1.969,0,0,1,7,41.625Zm6.841-7.137a10.648,10.648,0,0,0-13.682,0A.45.45,0,0,0,0,34.834v1.541a.437.437,0,0,0,.437.438H2.354a.437.437,0,0,0,.391-.242L3.5,34.625A8.733,8.733,0,0,1,7,33.969a8.738,8.738,0,0,1,3.5.656l.754,1.946a.437.437,0,0,0,.391.242h1.917A.437.437,0,0,0,14,36.375V34.834a.45.45,0,0,0-.159-.346Z" transform="translate(0 -32)" /></svg>;
