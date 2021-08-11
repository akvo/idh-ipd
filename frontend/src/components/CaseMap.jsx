import React from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";

import "./casemap.scss";

import { center } from "../data/country-center";

const geoUrl = "/world.topo.json";
const zoom = 1.5;

const CaseMap = ({ name }) => {
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
              const { MAP_LABEL } = geo.properties;
              let isMatch = null;
              if (MAP_LABEL) {
                isMatch = MAP_LABEL.toLowerCase() === name.toLowerCase();
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

export default CaseMap;
