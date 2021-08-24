import React from "react";
import { Row, Col, Card } from "antd";
import CountUp from "react-countup";
import Chart from "../lib/chart";

const DataTable = ({ items }) => {
  return items.map((item) => (
    <Row
      key={`${item.title}-wrapper`}
      justify="space-between"
      gutter={[12, 12]}
      style={{ marginBottom: "25px" }}
      wrap={true}
    >
      <Col span={24}>
        <Card className="compare-card">
          <Card.Grid hoverable={false} style={{ width: "100%" }}>
            <h4>{item.title}</h4>
          </Card.Grid>
          {item.column.map((c, i) => (
            <Card.Grid
              key={`${c.group}-${i}`}
              hoverable={false}
              style={{ width: "50%", height: 159 }}
              className={`${c.value ? "" : "red-card"}`}
            >
              <h4>{c.group}</h4>
              <h3>
                {c.value ? (
                  <CountUp start={0} end={c.value} duration={2} />
                ) : (
                  "N.A."
                )}
                {c.percent ? "%" : ""}
              </h3>
            </Card.Grid>
          ))}
        </Card>
      </Col>
    </Row>
  ));
};

const ChartType = ({
  type,
  title,
  description,
  hasTable,
  table,
  chart,
  axis,
}) => {
  switch (type) {
    case "stack":
      return (
        <Chart data={chart} type="BARSTACK" height={700} wrapper={false} />
      );
    case "group":
      return (
        <Chart
          title={title}
          data={chart}
          type="BARGROUP"
          height={500}
          span={12}
          axis={axis}
        />
      );
    default:
      return (
        <>
          <h3>{title}</h3>
          <p>{description}</p>
          {hasTable && <DataTable items={table} />}
        </>
      );
  }
};

const GridChart = ({ items }) => {
  return (
    <Row
      className="compare-wrapper"
      data-aos="fade-up"
      gutter={[50, 50]}
      wrap={true}
    >
      {items.map((item, index) => (
        <Col key={index} sm={24} md={24} lg={12} className="compare-body">
          <ChartType {...item} />
        </Col>
      ))}
    </Row>
  );
};

export default GridChart;
