import React, { useState } from "react";
import { Row, Col, Card, Tooltip } from "antd";
import { InfoCircleFilled, CameraFilled } from "@ant-design/icons";
import CountUp from "react-countup";
import Chart from "../lib/chart";
import { toJpeg } from "html-to-image";

const DataItem = ({ item }) => {
  const Group = () =>
    item.column.map((c, i) => (
      <Card.Grid
        key={`${c.group}-${i}`}
        hoverable={false}
        style={{ width: "50%", height: 150 }}
        className={`${c.value ? "" : "red-card"}`}
      >
        <h4>{c.group}</h4>
        <h3>
          {c.value ? (
            <CountUp
              suffix={c.suffix || ""}
              start={0}
              end={c.value}
              duration={2}
              percent={c.percent}
            />
          ) : (
            "N.A."
          )}
          {c.percent ? "%" : ""}
        </h3>
      </Card.Grid>
    ));
  return [
    <Card.Grid
      key={`${item.name}-1`}
      hoverable={false}
      style={{ width: "100%" }}
    >
      {item?.info && (
        <Tooltip title={item.info} placement="top">
          <span className="icon-info">
            <InfoCircleFilled />
          </span>
        </Tooltip>
      )}
      <h4>{item.title}</h4>
    </Card.Grid>,
    <Group key={`${item.name}-2`} />,
  ];
};

const DataTable = ({ items }) => {
  return (
    <Row
      justify="space-between"
      gutter={[12, 12]}
      style={{ marginBottom: "25px" }}
      wrap={true}
    >
      <Col span={24}>
        <Card className="compare-card">
          {items.map((item, index) => (
            <DataItem key={index} item={item} />
          ))}
        </Card>
      </Col>
    </Row>
  );
};

const ChartType = ({
  type,
  title,
  description,
  hasTable,
  table,
  chart,
  axis,
  link = false,
}) => {
  switch (type) {
    case "stack":
      return (
        <Chart data={chart} type="BARSTACK" height={700} wrapper={false} />
      );
    default:
      return (
        <>
          <h3>{title}</h3>
          <p>{description}</p>
          {hasTable && <DataTable items={table} />}
          {link && (
            <a
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ant-btn ant-btn-primary"
            >
              Benchmark Source
            </a>
          )}
        </>
      );
  }
};

const GroupType = ({ items, company }) => {
  const [show, setShow] = useState(true);
  company = company.toLowerCase().replace(" ", "-");
  return (
    <Row
      id="income-drivers"
      className="compare-wrapper"
      justify="space-around"
      gutter={[50, 50]}
      wrap={true}
    >
      <Col sm={24} md={24} lg={24} className="compare-title-separator">
        <h1>
          Income Drivers{" "}
          <Tooltip title="save as image" placement="top">
            <CameraFilled
              className={show ? "show" : "hide"}
              onClick={() => {
                setShow(false);
                toJpeg(document.getElementById("income-drivers"), {
                  quality: 0.95,
                }).then(function (dataUrl) {
                  setShow(true);
                  const link = document.createElement("a");
                  link.download = `${company}-income-drivers.jpeg`;
                  link.href = dataUrl;
                  link.click();
                });
              }}
            />
          </Tooltip>
        </h1>
      </Col>
      {items.map((item, index) => (
        <Chart
          key={index}
          title={item?.title}
          data={item?.chart}
          type="BARGROUP"
          height={300}
          span={12}
          axis={item?.axis}
          styles={{ marginBottom: "100px" }}
          extra={{
            grid: {
              top: 60,
              left: 150,
              right: "auto",
              bottom: "25px",
              borderColor: "#ddd",
              borderWidth: 0.5,
              show: true,
              label: {
                color: "#222",
                fontFamily: "Gotham A,Gotham B",
              },
            },
            axisLabel: {
              formatter: (x) => {
                return isNaN(x) ? x.replace("average", "\naverage\n") : x;
              },
            },
          }}
        />
      ))}
    </Row>
  );
};

const GridChart = ({ items, company }) => {
  const groups = items.filter((x) => x.type === "group");
  items = items.filter((x) => x.type !== "group");
  return [
    <Row
      key={"non-group"}
      className="compare-wrapper"
      justify="space-around"
      gutter={[50, 50]}
      wrap={true}
    >
      {items.map((item, index) => (
        <Col key={index} sm={24} md={24} lg={12} className="compare-body">
          <ChartType {...item} style={{ marginBottom: 20 }} />
        </Col>
      ))}
    </Row>,
    <GroupType key={"group"} items={groups} company={company} />,
  ];
};

export default GridChart;
