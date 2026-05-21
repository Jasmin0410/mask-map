import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLocation } from "../redux/action";
import StoreList from "./navbar/StoreList";
import { GetMaskData } from "./common/GetData";
import CityCountyData from "./common/CityCountyData.json";

export default function NavBar() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [cityName, setCityName] = useState("新北市");
  const [areaName, setAreaName] = useState("新店區");

  useEffect(() => {
    const importData = () => GetMaskData().then(setData);
    importData();
    const timer = setInterval(importData, 600000);
    return () => clearInterval(timer);
  }, []);

  const cityOptions = CityCountyData.map((city) => (
    <option key={city.CityEngName} value={city.CityName}>
      {city.CityName}
    </option>
  ));

  const areaOptions = CityCountyData.find(
    (city) => city.CityName === cityName,
  )?.AreaList.map((area) => (
    <option key={area.AreaEngName} value={area.AreaName}>
      {area.AreaName}
    </option>
  ));

  const stockStores = data.filter((store) => {
    const info = store.properties;
    return (
      info.address.includes(cityName + areaName) &&
      (info.mask_adult !== 0 || info.mask_child !== 0)
    );
  });

  const storeList = data.filter((store) =>
    store.properties.address.includes(cityName + areaName),
  );

  const panToFirstStock = (city, area) => {
    const firstStock = data.find((store) => {
      const info = store.properties;
      return (
        info.address.includes(city + area) &&
        (info.mask_adult !== 0 || info.mask_child !== 0)
      );
    });
    if (firstStock) {
      const [lon, lat] = firstStock.geometry.coordinates;
      dispatch(updateLocation([lat, lon]));
    }
  };

  const handleAreaChange = (e) => {
    const newArea = e.target.value;
    setAreaName(newArea);
    panToFirstStock(cityName, newArea);
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    const firstArea =
      CityCountyData.find((city) => city.CityName === newCity)?.AreaList[0]
        ?.AreaName || "";
    setCityName(newCity);
    setAreaName(firstArea);
    panToFirstStock(newCity, firstArea);
  };


  return (
    <div className="navbar">
      <div className="city-search">
        <div className="city-select">
          <select
            className="select-input"
            value={cityName}
            onChange={handleCityChange}
          >
            {cityOptions}
          </select>
          <select
            className="select-input"
            value={areaName}
            onChange={handleAreaChange}
          >
            {areaOptions}
          </select>
        </div>

        <div className="city-total">
          能取得口罩的藥局有：<span>{stockStores.length}</span>家
        </div>
      </div>

      <StoreList stores={storeList} />
    </div>
  );
}
