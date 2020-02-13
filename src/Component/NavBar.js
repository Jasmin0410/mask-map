import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateLocation } from '../redux/action';

import StoreList from './navbar/StoreList'
import { GetMaskData } from './common/GetData';
import CityCountyData from './common/CityCountyData.json'

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cityName: '新北市',
      areaName: '新店區'
    }
  }

  componentDidMount() {
    const importData = () => GetMaskData()
      .then(data => {
        this.setState({ data: data })
      })

    importData();
    this.getdata = setInterval(importData, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.getdata);
  }

  render() {
    const citySelect = CityCountyData
      .map(city => <option key={city.CityEngName} value={city.CityName}>{city.CityName}</option>);

    const areaSelect = () => {
      const city = CityCountyData.filter(city => city.CityName === this.state.cityName);
      return city[0].AreaList
        .map(area => <option key={area.AreaEngName} value={area.AreaName}>{area.AreaName}</option>);
    }

    const stockStore = this.state.data.filter(store => {
      const storeInfo = store.properties;
      return storeInfo.address.includes(this.state.cityName + this.state.areaName) &&
        (storeInfo.mask_adult !== 0 || storeInfo.mask_child !== 0);
    })

    const storeList = this.state.data.filter(store => {
      const storeInfo = store.properties;
      return storeInfo.address.includes(this.state.cityName + this.state.areaName)
    })

    const getCenter = () => {
      if (stockStore.length === 0) { return }
      let lat = stockStore[0].geometry.coordinates[1];
      let lon = stockStore[0].geometry.coordinates[0];
      return [lat, lon]
    }

    return (
      <div className="navbar">
        <div className="city-search">
          <div className="city-select">
            <select
              className="select-input"
              value={this.state.cityName}
              onChange={(e) => this.setState({ cityName: e.target.value, areaName: '' })}
            >
              {citySelect}
            </select>
            <select
              className="select-input"
              value={this.state.areaName}
              onChange={(e) => {
                this.setState({ areaName: e.target.value })
                this.props.updateLocation(getCenter())
              }}
            >
              {areaSelect()}
            </select>
          </div>

          <div className="city-total">
            能取得口罩的藥局有：<span>{stockStore.length}</span>家
        </div>
        </div>

        <StoreList stores={storeList} />
      </div>
    )
  }
}



const mapDispatchToProps = dispatch => ({
  updateLocation: location => dispatch(updateLocation(location))
})

export default connect(null, mapDispatchToProps)(NavBar);
