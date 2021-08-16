import React from "react";
import { Menu } from "antd";
import { Link, useHistory } from "react-router-dom";

import { UIStore } from "../data/store";

const { SubMenu } = Menu;

const Nav = ({ logout, loginWithPopup, isAuthenticated }) => {
  const page = UIStore.useState((s) => s.page);
  const user = UIStore.useState((s) => s.user);
  let history = useHistory();

  const handleOnClickMenu = ({ key }) => {
    UIStore.update((s) => {
      s.page = key === "auth" ? "introduction" : key;
      s.selectedCountry = null;
    });
    history.push(key === "auth" ? "/" : `/${key}`);
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[page]}
      onClick={handleOnClickMenu}
      style={{
        minWidth: isAuthenticated && user ? "840px" : "225px",
      }}
    >
      <Menu.Item key="">
        <Link to="/">Introduction</Link>
      </Menu.Item>
      {isAuthenticated && user && (
        <>
          <Menu.Item key="data-map">
            <Link to="/data-map">Data Map</Link>
          </Menu.Item>
          <Menu.Item key="case">
            <Link to="/case">Case</Link>
          </Menu.Item>
          <Menu.Item key="benchmarking">
            <Link to="/benchmarking">Benchmarking</Link>
          </Menu.Item>
          <Menu.Item key="income-driver-tool">
            <Link to="/income-driver-tool">Income Driver Tool</Link>
          </Menu.Item>
        </>
      )}
      {isAuthenticated ? (
        <SubMenu key="account" title="Account">
          <Menu.Item key="manage">
            <Link to="/manage">Manage</Link>
          </Menu.Item>
          <Menu.Item key="auth" onClick={logout}>
            <Link to="/">Logout</Link>
          </Menu.Item>
        </SubMenu>
      ) : (
        <Menu.Item key="auth" onClick={loginWithPopup}>
          <Link to="/">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Nav;
