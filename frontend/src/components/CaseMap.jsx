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

const CaseMap = ({ projects, markers, name }) => {
  return (
    <ComposableMap
      projectionConfig={{ scale: 650, projection: "geoEqualEarth" }}
      style={{
        height: "100%",
      }}
    >
      <ZoomableGroup zoom={3} center={center[name]} maxZoom={3} minZoom={3}>
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
