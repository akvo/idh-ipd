import { Row, Col, Image } from "antd";
const LivingIncomeImg = () => {
  return (
    <Row
      justify="space-around"
      align="middle"
      className="meta-body"
      style={{ position: "relative" }}
    >
      <img
        alt="actual"
        className="meta-img"
        src="/introduction/living-income-benchmark.png"
        style={{ position: "absolute", top: "-80px", width: "100px", left: 0 }}
      />
      <Col sm={12}>
        <Row justify="center" align="middle">
          <Col sm={12} md={12} lg={8}>
            <Image
              className="meta-img"
              preview={false}
              src="/introduction/food.png"
            />
            <h4>Food for Model Diet</h4>
          </Col>
          <Col sm={12} md={12} lg={8}>
            <Image
              className="meta-img"
              preview={false}
              src="/introduction/house.png"
            />
            <h4>Decent Housing</h4>
          </Col>
        </Row>
        <Row justify="space-around" align="middle" className="meta-body">
          <Col sm={24} md={24} lg={24}>
            <Image
              className="meta-img"
              preview={false}
              src="/introduction/other-essential.png"
            />
            <h4>Other Essential Needs</h4>
          </Col>
        </Row>
        <Row justify="space-around" align="middle" className="meta-body">
          <Col sm={24} md={24} lg={24}>
            <Image
              className="meta-img"
              preview={false}
              src="/introduction/unexpected-events.png"
            />
            <h4>Unexpected events</h4>
          </Col>
        </Row>
      </Col>
      <Col sm={5} md={5} lg={5}>
        <Row
          justify="center"
          gutter={[0, 0]}
          align="middle"
          className="meta-body"
        >
          <Col
            sm={24}
            md={24}
            lg={24}
            className="col-block"
            style={{ border: "1px dashed #ccc" }}
          ></Col>
          <Col
            sm={24}
            md={24}
            lg={24}
            className="col-block"
            style={{ border: "1px dashed #ccc" }}
          >
            <Image
              className="meta-img"
              preview={false}
              height="100px"
              src="/introduction/actual-income.png"
              style={{ marginTop: "4rem" }}
            />
          </Col>
        </Row>
      </Col>
      <Col sm={4} md={4} lg={4}>
        <Row
          justify="center"
          gutter={[0, 0]}
          align="middle"
          className="meta-body"
        >
          <Col
            sm={24}
            md={24}
            lg={24}
            className="col-block"
            style={{ backgroundColor: "#2e72c6" }}
          >
            <Image
              preview={false}
              alt="actual"
              width="100%"
              style={{
                position: "absolute",
                top: "-120px",
                margin: "auto",
              }}
              src="/introduction/triangle.png"
            />
            <h4
              style={{
                position: "absolute",
                top: "-70px",
                margin: "auto",
                color: "#000",
              }}
            >
              Potential household income
            </h4>
            <h4>Income Gap</h4>
          </Col>
          <Col
            sm={24}
            md={24}
            lg={24}
            className="col-block"
            style={{ backgroundColor: "#0081e0" }}
          >
            <h4>Actual Household Income</h4>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LivingIncomeImg;
