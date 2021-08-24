import React from "react";
import { Col, Card } from "antd";
import ReactECharts from "echarts-for-react";
import Bar from "./Bar";
import Pie from "./Pie";
import BarStack from "./BarStack";
import BarGroup from "./BarGroup";
import LineStack from "./LineStack";
import Line from "./Line";
import { titleCase, objectNames } from "../util";

export const generateOptions = ({ type, data }, extra, axis) => {
  switch (type) {
    case "PIE":
      return Pie(data, extra);
    case "DOUGHNUT":
      return Pie(data, extra, true);
    case "BARSTACK":
      return BarStack(data, extra);
    case "BARGROUP":
      return BarGroup(data, extra, axis);
    case "LINE":
      return Line(data, extra);
    case "LINESTACK":
      return LineStack(data, extra);
    default:
      return Bar(data, extra);
  }
};

const Chart = ({
  type,
  title = "",
  height = 450,
  span = 12,
  data,
  extra = {},
  wrapper = true,
  axis = null,
  styles = {},
}) => {
  data = data.map((x) => ({
    ...x,
    name: objectNames?.[x.name] || x.name,
    var: x.name,
  }));
  const option = generateOptions({ type: type, data: data }, extra, axis);
  if (wrapper) {
    return (
      <Col
        sm={24}
        md={span * 2}
        lg={span}
        style={{ height: height, ...styles }}
      >
        <Card title={titleCase(title)}>
          <ReactECharts
            option={option}
            style={{ height: height - 50, width: "100%" }}
          />
        </Card>
      </Col>
    );
  }
  return (
    <ReactECharts
      option={option}
      style={{ height: height - 50, width: "100%" }}
    />
  );
};

export default Chart;
