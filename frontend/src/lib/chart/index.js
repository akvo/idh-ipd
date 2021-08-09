import React from "react";
import { Col, Card } from "antd";
import ReactECharts from "echarts-for-react";
import Bar from "./Bar";
import Pie from "./Pie";
import BarStack from "./BarStack";
import BarGroup from "./BarGroup";
import LineStack from "./LineStack";
import Line from "./Line";
import { titleCase } from "../util";

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
}) => {
  const option = generateOptions({ type: type, data: data }, extra, axis);
  if (wrapper) {
    return (
      <Col span={span} style={{ height: height }}>
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
