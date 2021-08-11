import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import { UIStore } from "../data/store";

const Nav = ({ logout, loginWithPopup, isAuthenticated }) => {
  const page = UIStore.useState((s) => s.page);
  const user = UIStore.useState((s) => s.user);

  const handleOnClickMenu = ({ key }) => {
    UIStore.update((s) => {
      s.page = key === "auth" ? "introduction" : key;
      s.selectedCountry = null;
    });
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[page]}
      onClick={handleOnClickMenu}
      style={{
        minWidth: isAuthenticated && user ? "725px" : "225px",
      }}
    >
      <Menu.Item key="introduction">
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
      <Menu.Item key="auth">
        {isAuthenticated ? (
          <Link to="/" onClick={logout}>
            Logout
          </Link>
        ) : (
          <Link to="/" onClick={loginWithPopup}>
            Login
          </Link>
        )}
      </Menu.Item>
    </Menu>
  );
};

export default Nav;
