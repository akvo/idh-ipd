import React from "react";
import { Menu } from "antd";

const Nav = () => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["introduction"]}>
      <Menu.Item key="introduction">Introduction</Menu.Item>
      <Menu.Item key="data-map">Data Map</Menu.Item>
      <Menu.Item key="case">Case</Menu.Item>
      <Menu.Item key="benchmarking">Benchmarking</Menu.Item>
      <Menu.Item key="income-driver-tool">Income Driver Tool</Menu.Item>
    </Menu>
  );
};

export default Nav;
