import React, { useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";

import "./casemap.scss";

import { center } from "../data/country-center";

const geoUrl = "/world.topo.json";

const CaseMap = ({ projects, markers }) => {
  const [province, setProvince] = useState(null);

  return (
    <ComposableMap
      projectionConfig={{ scale: 800, projection: "geoEqualEarth" }}
    >
      <ZoomableGroup zoom={3} center={center["kenya"]} maxZoom={2} minZoom={2}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo, i) => {
              const { MAP_LABEL } = geo.properties;
              const isMatch = MAP_LABEL && MAP_LABEL.toLowerCase() === "kenya";
              return (
                <Geography
                  key={i}
                  geography={geo}
                  style={{
                    default: {
                      fill: isMatch ? "#699DD7" : "#EAEAEC",
                      stroke: "#FFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: isMatch ? "#699DD7" : "#EAEAEC",
                      stroke: "#FFF",
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
