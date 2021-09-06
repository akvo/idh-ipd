import { Col, Card, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import CountUp from "react-countup";

import isInteger from "lodash/isInteger";

const CountUpCard = ({
  type = "default",
  span = 4,
  extraStyle = "",
  percent = false,
  suffix = "",
  data,
}) => {
  const { value, text } = data;

  let props = {
    start: 0,
    end: value,
    duration: 2,
    suffix: suffix,
  };
  if (!isInteger(Number(value))) {
    props = {
      ...props,
      decimals: 2,
      decimal: ".",
    };
  }

  let redStyle = value ? "" : "red-card";
  let countUp = value ? <CountUp {...props} /> : "N.A.";
  let percentMark = value && percent && "%";

  let body = "";
  if (type === "default") {
    body = (
      <>
        <h3>
          {countUp}
          {percentMark}
        </h3>
        <p>{text}</p>
      </>
    );
  }
  if (type === "reverse") {
    body = (
      <>
        <h4>{text}</h4>
        <h3>
          {countUp}
          {percentMark}
        </h3>
      </>
    );
  }

  return (
    <Col sm={12} md={span * 2} lg={span}>
      <Card className={`count-up-card ${extraStyle} ${redStyle}`}>
        {body}
        {data?.info && (
          <Tooltip title={data.info} placement="top">
            <span className="icon-info">
              <InfoCircleFilled />
            </span>
          </Tooltip>
        )}
      </Card>
    </Col>
  );
};

export default CountUpCard;
