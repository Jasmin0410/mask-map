import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateLocation } from '../redux/action';
import * as L from 'leaflet';
import 'leaflet.markercluster'

import { GetMaskData, blueIcon } from './common/GetData';

class MaskMap extends Component {
  constructor(props) {
    super(props)
    this.state = {

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
    this.map = L.map('map', {
      center: this.props.location,
      zoom: 16
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const importData = () => GetMaskData().then(data => {
      const markers = L.markerClusterGroup().addTo(this.map);

      for (let i = 0; i < (data.length - 1); i++) {
        let lat = data[i].geometry.coordinates[1];
        let lon = data[i].geometry.coordinates[0];
        let adult = data[i].properties.mask_adult;
        let child = data[i].properties.mask_child;

        const maskStatus = (item) => { return item === 0 ? "soldout" : "stock" };

        markers.addLayer(L.marker([lat, lon], { icon: blueIcon })
          .bindPopup(
            `<div>
              <div class="store-name">${data[i].properties.name}</div>
              <div class="store-info">${data[i].properties.address}</div>
              <div class="store-info">${data[i].properties.phone}</div>
              <div class="mask-status">
                <div class='popup mask-item ${maskStatus(adult)}'>大人: ${adult}</div>
                <div class='popup mask-item ${maskStatus(child)}'>小孩: ${child} </div>
              </div>
            </div>`,
            { closeButton: false, maxWidth: 340 }
          ));
      }
      this.map.addLayer(markers);
    });

    importData();
    this.getdata = setInterval(importData, 60000);

    // this.GetUserGeo();

  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.map.panTo([this.props.location[0], this.props.location[1]]);
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
