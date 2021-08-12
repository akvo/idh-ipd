import React, { useEffect } from "react";
import { Row, Col, Image } from "antd";

import "./introduction.scss";

import Loading from "../components/Loading";
import LivingIncomeImg from "../components/LivingIncomeImg";

import { UIStore } from "../data/store";

const Introduction = ({ history }) => {
  const loading = UIStore.useState((s) => s.loading);

  useEffect(() => {
    if (loading) {
      UIStore.update((s) => {
        s.page = "introduction";
      });
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Row justify="center" wrap={true}>
      <Col>
        <div className="title-wrapper" data-aos="fade-up">
          <h1>Income Performance Dashboard</h1>
          <p>Improving SmallHolder Farmer Resilience with Living Income</p>
        </div>
        <div
          className="content-wrapper odd"
          data-aos="fade-up"
          style={{ marginTop: 0 }}
        >
          <Row
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
            style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
          >
            <Col sm={24} md={24} lg={10} className="img-title">
              <Image
                height="90%"
                src="/introduction/smallholder-farming.png"
                preview={false}
              />
              <h3 data-aos="fade-up" data-aos-duration="1000">
                Smallholder
                <br />
                Farming
              </h3>
            </Col>
            <Col sm={24} md={24} lg={14}>
              <p>
                Smallholder farmers are crucial in the effort to end hunger and
                alleviate malnutrition worldwide. They account for 90% of the
                world's farms and contribute substantially to global food
                chains. What’s more, they are better at conserving natural
                resources than large, industrial farms. In short, smallholder
                farmers have the potential to feed the world sustainably.
                However, they are also a group that faces huge barriers. Many
                live in impoverished conditions and are unable to achieve a
                sustainable income.
              </p>
            </Col>
          </Row>
        </div>
        <div
          className="content-wrapper odd bg-white meta-wrapper"
          data-aos="fade-up"
        >
          <Row
            className="meta-right"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={10}>
              <h3>Living Income</h3>
              <p>
                Smallholder farmers earn an income from growing one or more
                crops. However, income from selling crops may not be sufficient
                to cover all their basic living costs. Therefore, farmer
                households diversify their income. In the case of smallholder
                farmers for example, income can be earned through off farm
                business and remittances as well as from crop sales.
              </p>
              <p>
                Living income is about households having the ability to afford a
                decent standard of living. The Living Income Community of
                Practice defines living income as: "The net annual income
                required for a household in a particular place to afford a
                decent standard of living for all members of that household.
                Elements of a decent standard of living include: food, water,
                housing, education, healthcare, transport, clothing, and other
                essential needs including provision for unexpected events".
              </p>
            </Col>
            <Col
              sm={24}
              md={24}
              lg={14}
              style={{ borderTop: "2px dashed #000" }}
            >
              <LivingIncomeImg />
            </Col>
          </Row>
        </div>
        <div
          className="content-wrapper odd"
          data-aos="fade-up"
          style={{ marginBottom: 0 }}
        >
          <Row
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
            style={{
              paddingTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <Col sm={24} md={24} lg={10} className="img-title">
              <Image
                preview={false}
                height="90%"
                src="/introduction/measuring-living-income-gap.jpeg"
              />
              <h3 data-aos="fade-up" data-aos-duration="1000">
                Measuring <br />
                the living income gap
              </h3>
            </Col>
            <Col sm={24} md={24} lg={14}>
              <p>
                By measuring the actual household income of the farmers, we can
                assess whether the households earn a living income. If farmers
                earn an income below the living income level, we can assess the
                difference between actual household income level and the living
                income level. This is what we call the living income gap. Below
                we explain in more detail how we measure actual household income
                and the living income gap.
              </p>
            </Col>
          </Row>
        </div>
        <div
          className="content-wrapper odd bg-white meta-wrapper"
          data-aos="fade-up"
        >
          <Row
            className="meta-right"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={24} align="middle">
              <h3>Actual household income</h3>
              <p>
                Smallholder farmers can earn an income from one or more crops.
                The focus crop is the crop that generates the highest income for
                the household. We define actual household income as the sum of
                the profit from the focus crop and other income.
              </p>
            </Col>
          </Row>
          <Row
            className="meta-right"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={24}>
              <Row justify="space-around" align="middle" className="meta-body">
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/actual-income.png"
                  />
                  <h4>Actual income</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  =
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/net-income.png"
                  />
                  <h4>Net-income focus crop</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  +
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/other-income.png"
                  />
                  <h4>Other income</h4>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div
          className="content-wrapper even meta-wrapper"
          data-aos="fade-up"
          style={{ marginTop: 0 }}
        >
          <Row
            className="meta-right"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={24} align="middle">
              <h3>Net-income Focus Crop</h3>
              <p>
                Net-income from the focus crop is calculated by subtracting
                producing costs from the revenues from the focus crop.
              </p>
            </Col>
          </Row>
          <Row
            className="meta-right"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={16}>
              <Row justify="space-around" align="middle" className="meta-body">
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/net-income.png"
                  />
                  <h4>Net-income focus crop ($)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  =
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/revenue.png"
                  />
                  <h4>Revenues ($)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  -
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/production.png"
                  />
                  <h4>Production cost ($)</h4>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div
          className="content-wrapper even meta-wrapper meta-secondary"
          data-aos="fade-up"
        >
          <Row
            className="meta-left"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={14}>
              <Row justify="space-around" align="middle" className="meta-body">
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/revenue.png"
                  />
                  <h4>Revenue ($)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  =
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/farm-size.png"
                  />
                  <h4>Farm size (ha)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  x
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/yield.png"
                  />
                  <h4>Yield (kg/ha)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  x
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/price.png"
                  />
                  <h4>Price ($/kg)</h4>
                </Col>
              </Row>
            </Col>
            <Col sm={24} md={24} lg={10}>
              <h3>Focus crop revenues</h3>
              <p>
                Revenues from the focus crop are calculated by multiplying the
                price, yield and farm size
              </p>
            </Col>
          </Row>
          <Row
            className="meta-right"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={10}>
              <h3>Focus crop production costs</h3>
              <p>
                The focus crop production costs are calculated by multiplying
                the farm size and production costs ($/ha). Production costs
                capture at a minimum two types of costs. Other costs that can be
                considered are equipment costs, interest costs for loans that
                are used for focus crop-related purposes or processing costs (if
                applicable).
              </p>
            </Col>
            <Col sm={24} md={24} lg={14}>
              <Row justify="space-around" align="middle" className="meta-body">
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/production.png"
                  />
                  <h4>Production costs ($/ha)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  x
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/farm-size.png"
                  />
                  <h4>Farm size (ha)</h4>
                </Col>
                <Col span={1} className="meta-symbol">
                  =
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/cost.png"
                  />
                  <h4>Production cost ($)</h4>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div
          className="content-wrapper odd bg-white meta-wrapper"
          data-aos="fade-up"
        >
          <Row align="middle" justify="center" gutter={[24, 24]} wrap={true}>
            <Col sm={24} md={24} lg={24} align="middle">
              <h3>Other income</h3>
              <p>
                The majority of farmer’ households also earn an income from
                other sources than the focus crop. This can be income from other
                crops, livestock, income earned from off-farm labour or non-farm
                non labour sources (e.g. remittances, government transfers).
              </p>
            </Col>
          </Row>
          <Row
            className="meta-left"
            align="middle"
            justify="center"
            gutter={[24, 24]}
            wrap={true}
          >
            <Col sm={24} md={24} lg={24}>
              <Row justify="space-around" align="middle" className="meta-body">
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/net-income-other.png"
                  />
                  <h4>
                    Net-income
                    <br />
                    from other farm sources
                  </h4>
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/off-farm-labour-income.png"
                  />
                  <h4>Off-farm labour income</h4>
                </Col>
                <Col sm={5} md={4} lg={3}>
                  <Image
                    className="meta-img"
                    preview={false}
                    height="45%"
                    src="/introduction/other-income.png"
                  />
                  <h4>Other income</h4>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default Introduction;
