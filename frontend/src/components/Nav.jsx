import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["introduction"]}>
      <Menu.Item key="introduction">
        <Link to="/">Introduction</Link>
      </Menu.Item>
      <Menu.Item key="data-map">
        <Link to="/data-map">Data Map</Link>
      </Menu.Item>
      <Menu.Item key="case">Case</Menu.Item>
      <Menu.Item key="benchmarking">Benchmarking</Menu.Item>
      <Menu.Item key="income-driver-tool">Income Driver Tool</Menu.Item>
    </Menu>
  );
};

export default Nav;
