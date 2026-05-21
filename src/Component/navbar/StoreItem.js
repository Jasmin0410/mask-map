import React from "react";
import { useDispatch } from "react-redux";
import { updateLocation } from "../../redux/action";
import marker from "../../style/img/marker.svg";
import phone from "../../style/img/phone.svg";

function StoreItem({ store }) {
  const dispatch = useDispatch();
  const info = store.properties;
  const [lon, lat] = store.geometry.coordinates;
  const maskStatus = (n) => (n === 0 ? "soldout" : "stock");

  return (
    <div
      className="store-item"
      onClick={() => dispatch(updateLocation([lat, lon]))}
    >
      <div className="store-name">{info.name}</div>
      <div className="store-info">
        <img className="icon" src={marker} alt="" />
        <a
          href={`https://www.google.com.tw/maps/search/${info.address}`}
          target="_blank"
          rel="noreferrer"
        >
          {info.address}
        </a>
      </div>
      <div className="store-info">
        <img className="icon" src={phone} alt="" />
        {info.phone}
      </div>
      <div className="mask-status">
        <div className={`mask-item adult ${maskStatus(info.mask_adult)}`}>
          大人: {info.mask_adult}
        </div>
        <div className={`mask-item child ${maskStatus(info.mask_child)}`}>
          小孩: {info.mask_child}
        </div>
      </div>
    </div>
  );
}

export default StoreItem;
