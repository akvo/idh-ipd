import React, { useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { scaleQuantize } from "d3-scale";
import { Tooltip, Button, Modal } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

import "./datamap.scss";

import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import groupBy from "lodash/groupBy";
import values from "lodash/values";

const geoUrl = "/world.topo.json";
const colorRange = ["#0BC1D9", "#0BBAE3", "#0096CC", "#0B99E3", "#0072C6"];
const highlightColor = "#36aa40";
const mapMaxZoom = 4;

const ToolTipContent = ({ data, geo }) => {
  return (
    <div className="map-tooltip">
      <h3>{geo.NAME}</h3>
      {data?.company && data.company.length > 0 && (
        <ul>
          <li key={1}>
            <b>{data.company.length}</b>
            <span>{data.company.length > 1 ? "Companies" : "Company"}</span>
          </li>
          <li key={2}>
            <b>{values(groupBy(data.company, (x) => x.crop)).length}</b>
            <span>
              {values(groupBy(data.company, (x) => x.crop)).length > 1
                ? "Commodities"
                : "Commodity"}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

const DataMap = ({ history }) => {
  const { countryMap, loading, countries } = UIStore.useState((c) => c);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [toolTipContent, setTooltipContent] = useState("");

  const domain = countryMap.reduce(
    (acc, curr) => {
      const v = curr.company.length;
      const [min, max] = acc;
      return [min, v > max ? v : max];
    },
    [1, 1]
  );

  const colorScale = scaleQuantize().domain(domain).range(colorRange);

  const legend = domain.map((x, i) => colorScale(x));

  const fillColor = (v) => {
    const color = v === 0 ? "#f6f6f6" : colorScale(v);
    return color;
  };

  const openWarningModal = () => {
    return Modal.warning({
      title: "Access Denied",
      content: "You don't have access to any company for this country",
    });
  };

  const handleOnClickCountry = (country) => {
    const allow =
      countries.length > 0 && countries.find((c) => c.id === country.id);
    UIStore.update((s) => {
      s.page = "case";
      s.selectedCountry = country.id;
    });
    allow ? history.push("/case") : openWarningModal();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container map-wrapper" data-aos="fade-up">
      <div
        className="map-legend"
        style={{
          background: `linear-gradient(to right, ${legend[0]}, ${legend[1]})`,
        }}
      >
        <span># of data</span>
      </div>
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
        height={420}
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
                if (geo.properties.NAME) {
                  country = countryMap.find(
                    (c) =>
                      c.name.toLowerCase() === geo.properties.NAME.toLowerCase()
                  );
                  curr = country?.company ? country.company.length : 0;
                }
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    cursor={curr ? "pointer" : ""}
                    onMouseEnter={() => {
                      country &&
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
                        stroke: curr
                          ? country
                            ? "#fff"
                            : "#79B0CC"
                          : "#79B0CC",
                        strokeWidth: "0.4",
                        strokeOpacity: "1",
                      },
                      hover: {
                        fill: country ? highlightColor : "#f6f6f6",
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
      <ReactTooltip
        type="dark"
        backgroundColor="#2872c6"
        className="opaque react-tooltip"
      >
        {toolTipContent}
      </ReactTooltip>
    </div>
  );
};

export default DataMap;
