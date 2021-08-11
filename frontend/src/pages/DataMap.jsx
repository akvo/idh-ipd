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

import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sumBy from "lodash/sumBy";
import groupBy from "lodash/groupBy";
import values from "lodash/values";
import { roundNumber } from "../lib/util";

const geoUrl = "/world.topo.json";
const colorRange = ["#bbedda", "#a7e1cb", "#92d5bd", "#7dcaaf", "#67bea1"];
const higlightColor = "#84b4cc";
const mapMaxZoom = 4;

const ToolTipContent = ({ data, geo }) => {
  return (
    <div className="map-tooltip">
      <h3>{geo.MAP_LABEL}</h3>
      {data?.company && data.company.length > 0 && (
        <ul>
          <li key={1}>
            <b>{data.company.length}</b>
            <span>
              {data.company.length > 1 ? "company" : "company"} engaged
            </span>
          </li>
          <li key={2}>
            <b>{values(groupBy(data.company, (x) => x.crop)).length}</b>
            <span>
              {values(groupBy(data.company, (x) => x.crop)).length > 1
                ? "commodities"
                : "commodity"}
            </span>
          </li>
          <li key={3}>
            <span>Average actual income: </span>
            <b>
              {roundNumber(
                sumBy(data.company, (x) => x.hh_income) / data.company.length
              )}{" "}
              $/month
            </b>
          </li>
        </ul>
      )}
    </div>
  );
};

const DataMap = ({ history }) => {
  const { countries, loading } = UIStore.useState();
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [toolTipContent, setTooltipContent] = useState("");

  const domain = countries.reduce(
    (acc, curr) => {
      const v = curr.company.length;
      const [min, max] = acc;
      return [min, v > max ? v : max];
    },
    [0, 0]
  );

  const colorScale = scaleQuantize().domain(domain).range(colorRange);

  const fillColor = (v) => {
    const color = v === 0 ? "#f6f6f6" : colorScale(v);
    return color;
  };

  const handleOnClickCountry = (country) => {
    UIStore.update((s) => {
      s.page = "case";
      s.selectedCountry = country.id;
    });
    history.push("/case");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container map-wrapper" data-aos="fade-up">
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
        projectionConfig={{ scale: 110 }}
        height={350}
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
              return geographies.map((geo) => {
                let curr = 0;
                let country = null;
                if (geo.properties.MAP_LABEL) {
                  country = countries.find(
                    (c) =>
                      c.name.toLowerCase() ===
                      geo.properties.MAP_LABEL.toLowerCase()
                  );
                  curr = country?.company ? country.company.length : 0;
                }
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    cursor={curr ? "pointer" : ""}
                    onMouseEnter={() => {
                      geo.properties.MAP_LABEL &&
                        setTooltipContent(
                          <ToolTipContent data={country} geo={geo.properties} />
                        );
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    onClick={() => {
                      country && handleOnClickCountry(country);
                    }}
                    style={{
                      default: {
                        fill: fillColor(curr ? curr : 0),
                        outline: "none",
                        stroke: curr ? "#fff" : "#79B0CC",
                        strokeWidth: "0.2",
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
                );
              });
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
