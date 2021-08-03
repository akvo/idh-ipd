import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { scaleQuantize } from "d3-scale";
import { Tooltip, Button } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

import "./datamap.scss";

const geoUrl = "/world.topo.json";
const colorRange = ["#bbedda", "#a7e1cb", "#92d5bd", "#7dcaaf", "#67bea1"];
const higlightColor = "#84b4cc";
const mapMaxZoom = 4;
const data = [];
const topic = "";

const ToolTipContent = ({ data, geo }) => {
  return (
    <div className="map-tooltip">
      <h3>{geo.MAP_LABEL}</h3>
      <ul>
        <li key={1}>
          <b>15</b>
          <span>companies engaged</span>
        </li>
        <li key={2}>
          <b>5</b>
          <span>commodities</span>
        </li>
        <li key={3}>
          <span>Average actual income: </span>
          <b>100$/month</b>
        </li>
      </ul>
    </div>
  );
};

const DataMap = ({ history }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [toolTipContent, setTooltipContent] = useState("");
  const [filterColor, setFilterColor] = useState(null);

  const domain = data.reduce(
    (acc, curr) => {
      const v = curr[topic];
      const [min, max] = acc;
      return [min, v > max ? v : max];
    },
    [0, 0]
  );

  const colorScale = scaleQuantize().domain(domain).range(colorRange);

  const fillColor = (v) => {
    const color = v === 0 ? "#fff" : colorScale(v);
    if (filterColor !== null) {
      return filterColor === color ? higlightColor : color;
    }
    return color;
  };

  return (
    <div className="map-wrapper">
      <div className="map-buttons">
        <Tooltip title="zoom out">
          <Button
            type="secondary"
            icon={<ZoomOutOutlined />}
            onClick={() => {
              position.zoom > 1 &&
                setPosition({ ...position, zoom: position.zoom - 0.5 });
            }}
            disabled={position.zoom <= 1}
          />
        </Tooltip>
        <Tooltip title="zoom in">
          <Button
            disabled={position.zoom >= mapMaxZoom}
            type="secondary"
            icon={<ZoomInOutlined />}
            onClick={() => {
              setPosition({ ...position, zoom: position.zoom + 0.5 });
            }}
          />
        </Tooltip>
        <Tooltip title="reset zoom">
          <Button
            type="secondary"
            icon={<FullscreenOutlined />}
            onClick={() => {
              setPosition({ coordinates: [0, 0], zoom: 1 });
            }}
          />
        </Tooltip>
      </div>
      <ComposableMap
        data-tip=""
        projection="geoEquirectangular"
        projectionConfig={{ scale: 125 }}
        height={400}
        style={{ outline: "none" }}
      >
        <ZoomableGroup
          maxZoom={mapMaxZoom}
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(x) => {
            setPosition(x);
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              return geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { MAP_LABEL } = geo.properties;
                    setTooltipContent(
                      <ToolTipContent data={[]} geo={geo.properties} />
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: "#f6f6f6",
                      outline: "none",
                      stroke: "#79B0CC",
                      strokeWidth: "0.35",
                      strokeOpacity: "0.8",
                    },
                    hover: {
                      fill: higlightColor,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ));
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip type="light" className="opaque">
        {toolTipContent}
      </ReactTooltip>
    </div>
  );
};

export default DataMap;
