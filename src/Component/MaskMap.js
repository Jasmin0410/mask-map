import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateLocation } from '../redux/action';
import * as L from 'leaflet';
import 'leaflet.markercluster'

//import svg icon
import marker from '../style/img/marker.svg'
import phone from '../style/img/phone.svg'

import { GetMaskData, blueIcon } from './common/GetData';

class MaskMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storedata: []
    }
    this.GetUserGeo = this.GetUserGeo.bind(this);
  }

  GetUserGeo() {
    const that = this;
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      that.props.updateLocation([latitude, longitude])
    }

    function error() {
      alert('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  componentDidMount() {
    // 引入地圖
    this.map = L.map('map', {
      center: this.props.location,
      zoom: 16
    });

    // 引入圖資
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // 藉由 GetMaskData 引入資料
    const importData = () => GetMaskData().then(data => {
      this.setState({ storedata: data });
      // 引入 markerClusterGroup
      const markers = L.markerClusterGroup().addTo(this.map);

      for (let i = 0; i < (data.length - 1); i++) {
        let lat = data[i].geometry.coordinates[1];
        let lon = data[i].geometry.coordinates[0];
        let adult = data[i].properties.mask_adult;
        let child = data[i].properties.mask_child;

        // 判斷口罩是否有庫存
        const maskStatus = (item) => { return item === 0 ? "soldout" : "stock" };

        // 新贈 markers
        markers.addLayer(L.marker([lat, lon], { icon: blueIcon })
          .bindPopup(
            `<div>
              <div class="store-name">${data[i].properties.name}</div>
              <div class="store-info">
                <img class="icon" src=${marker} />${data[i].properties.address}
              </div>
              <div class="store-info">
                <img class="icon" src=${phone} />${data[i].properties.phone}
              </div>
              <div class="mask-status">
                <div class='popup mask-item ${maskStatus(adult)}'>大人: ${adult}</div>
                <div class='popup mask-item ${maskStatus(child)}'>小孩: ${child} </div>
              </div>
            </div>`,
            { closeButton: false }
          ));
      }
      this.map.addLayer(markers);
    });

    importData();
    this.getdata = setInterval(importData, 60000);

  }

  componentDidUpdate(prevProps) {
    const location = this.props.location;

    if (prevProps.location !== location) {
      this.map.panTo([location[0], location[1]]);

      const centerStore = this.state.storedata.filter(store => {
        return store.geometry.coordinates[1] === location[0] && store.geometry.coordinates[0] === location[1]
      })

      if (centerStore[0]) {
        const store = centerStore[0];
        let adult = store.properties.mask_adult;
        let child = store.properties.mask_child;

        const maskStatus = (item) => { return item === 0 ? "soldout" : "stock" };

        this.map.setView([location[0], location[1]], 18);
        L.popup()
          .setLatLng([location[0], location[1]])
          .setContent(`<div>
                <div class="store-name">${store.properties.name}</div>
                <div class="store-info">
                  <img class="icon" src=${marker} />${store.properties.address}
                </div>
                <div class="store-info">
                  <img class="icon"src=${phone} />${store.properties.phone}
                </div>
                <div class="mask-status">
                  <div class='popup mask-item ${maskStatus(adult)}'>大人: ${adult}</div>
                  <div class='popup mask-item ${maskStatus(child)}'>小孩: ${child}</div>
                </div>
              </div>`)
          .openOn(this.map)

      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.getdata);
  }

  render() {
    return (
      <div id="map"></div>
    )
  }
}


const mapStateToProps = location => ({ location })

const mapDispatchToProps = dispatch => ({
  updateLocation: location => dispatch(updateLocation(location))
})


export default connect(mapStateToProps, mapDispatchToProps)(MaskMap);
