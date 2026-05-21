import React from "react";
import StoreItem from "./StoreItem";

function StoreList({ stores }) {
  return (
    <div className="store-list">
      {stores.map((store) => (
        <StoreItem key={store.properties.id} store={store} />
      ))}
    </div>
  );
}

export default StoreList;
