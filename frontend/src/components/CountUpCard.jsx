import { Col, Card } from "antd";
import CountUp from "react-countup";

import isInteger from "lodash/isInteger";

const CountUpCard = ({
  type = "default",
  span = 4,
  extraStyle = "",
  percent = false,
  data,
}) => {
  const { value, text, unit } = data;

  let props = {
    start: 0,
    end: value,
    duration: 2,
  };
  if (!isInteger(Number(value))) {
    props = {
      ...props,
      decimals: 2,
      decimal: ",",
    };
  }

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
        <p>
          {text}
          {unit && <br />}
          {unit}
        </p>
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
    <Col span={span}>
      <Card className={`count-up-card ${extraStyle}`}>{body}</Card>
    </Col>
  );
};

export default CountUpCard;
