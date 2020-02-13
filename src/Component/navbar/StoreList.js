import React, { Component } from 'react';
import StoreItem from './StoreItem';

class StoreList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const storeRender = this.props.stores
      .map(store => <StoreItem key={store.properties.id} store={store} />)

    return (
      <div className="store-list">
        {storeRender}
      </div>
    )
  }
}


export default StoreList;
