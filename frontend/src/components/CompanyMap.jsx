import React from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";

import "./companymap.scss";

import { center } from "../data/country-center";

const geoUrl = "/world.topo.json";
const zoom = 1.5;

const CompanyMap = ({ name }) => {
  return (
    <ComposableMap
      projectionConfig={{
        scale: center[name].scale,
      }}
      projection="geoEquirectangular"
      style={{
        height: "100%",
      }}
    >
      <ZoomableGroup
        zoom={zoom}
        center={center[name].loc}
        maxZoom={zoom}
        minZoom={zoom}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo, i) => {
              const { NAME } = geo.properties;
              let isMatch = null;
              if (NAME) {
                isMatch = NAME.toLowerCase() === name.toLowerCase();
              }
              return (
                <Geography
                  key={i}
                  geography={geo}
                  style={{
                    default: {
                      fill: isMatch ? "#699DD7" : "#f6f6f6",
                      stroke: "#79B0CC",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: isMatch ? "#699DD7" : "#f6f6f6",
                      stroke: "#79B0CC",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default CompanyMap;
