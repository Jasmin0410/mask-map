import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateLocation } from '../../redux/action';

//import svg icon
import marker from '../../style/img/marker.svg'
import phone from '../../style/img/phone.svg'

class StoreItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const storeInfo = this.props.store.properties;
    const storeLocation = this.props.store.geometry.coordinates;
    const adult = storeInfo.mask_adult;
    const child = storeInfo.mask_child;

    const maskStatus = (item) => { return item === 0 ? "soldout" : "stock" };

    return (
      <div
        className="store-item"
        onClick={() => this.props.updateLocation([storeLocation[1], storeLocation[0]])}
      >
        <div className="store-name">{storeInfo.name}</div>
        <div className="store-info">
          <img className="icon" src={marker} />{storeInfo.address}
        </div>
        <div className="store-info">
          <img className="icon" src={phone} />{storeInfo.phone}
        </div>
        <div className="mask-status">
          <div className={`mask-item adult ${maskStatus(adult)}`}>大人: {adult}</div>
          <div className={`mask-item child ${maskStatus(child)}`}>小孩: {child} </div>
        </div>
      </div>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  updateLocation: location => dispatch(updateLocation(location))
})

export default connect(null, mapDispatchToProps)(StoreItem);
