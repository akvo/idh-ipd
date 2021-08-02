import React from "react";
import { Row, Col, Image } from "antd";

import "./introduction.scss";

const Introduction = (props) => {
  const handleLogout = (e) => {
    e.preventDefault();
    props.setUser(false);
  };

  return (
    <Row justify="center">
      <Col>
        <div className="title-wrapper">
          <h1>Income Performance Dashboard</h1>
          <p>Improving SmallHolder Farmer Resilience with Living Income</p>
        </div>
        <div className="content-wrapper odd">
          <Row align="middle">
            <Col md={8}>
              <Image
                width={300}
                src="https://placeimg.com/640/480/nature/grayscale"
              />
            </Col>
            <Col md={16}>
              <h3>Smallholder Farming</h3>
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
        <div className="content-wrapper">
          <Row align="middle">
            <Col md={16}>
              <h3>Living Income</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse mollis gravida augue, eu accumsan lectus lacinia
                mattis. Sed malesuada, justo et convallis sagittis, dui felis
                viverra justo, eget faucibus erat risus vitae metus. Aenean
                rhoncus libero sed ante rutrum tempus. Morbi ultrices id arcu in
                porttitor. Cras sodales nibh vitae tristique gravida.
                Suspendisse potenti. Aenean ultricies erat sed nibh viverra
                euismod. Integer nec arcu urna. Praesent sed libero nec elit
                malesuada scelerisque interdum sed purus. Praesent ut
                ullamcorper nulla.
              </p>
            </Col>
            <Col md={8}>
              <Image
                width={300}
                src="https://placeimg.com/640/480/nature/grayscale"
              />
            </Col>
          </Row>
        </div>
        <div className="content-wrapper odd">
          <Row align="middle">
            <Col md={8}>
              <Image
                width={300}
                src="https://placeimg.com/640/480/nature/grayscale"
              />
            </Col>
            <Col md={16}>
              <h3>Measuring the living income gap</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse mollis gravida augue, eu accumsan lectus lacinia
                mattis. Sed malesuada, justo et convallis sagittis, dui felis
                viverra justo, eget faucibus erat risus vitae metus. Aenean
                rhoncus libero sed ante rutrum tempus. Morbi ultrices id arcu in
                porttitor. Cras sodales nibh vitae tristique gravida.
                Suspendisse potenti. Aenean ultricies erat sed nibh viverra
                euismod. Integer nec arcu urna. Praesent sed libero nec elit
                malesuada scelerisque interdum sed purus. Praesent ut
                ullamcorper nulla.
              </p>
            </Col>
          </Row>
        </div>
        <button onClick={handleLogout}>Log Out</button>
      </Col>
    </Row>
  );
};

export default Introduction;
