import React, { useEffect } from "react";
import { Menu } from "antd";
import { Link, useHistory } from "react-router-dom";

import { UIStore } from "../data/store";
import { titleCase } from "../lib/util";

const { SubMenu } = Menu;

const Nav = ({ logout, loginWithPopup, isAuthenticated }) => {
  const { page, user } = UIStore.useState((c) => c);
  let history = useHistory();

  useEffect(() => {
    document.title = titleCase(page !== "" ? page : "Introduction", "-");
  }, [page]);

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
        minWidth: isAuthenticated && user?.active ? "690px" : "225px",
      }}
    >
      <Menu.Item key="">
        <Link to="/">Introduction</Link>
      </Menu.Item>
      {isAuthenticated && user?.active && (
        <>
          <Menu.Item key="data-map">
            <Link to="/data-map">Data Map</Link>
          </Menu.Item>
          <Menu.Item key="company">
            <Link to="/company">Company Data</Link>
          </Menu.Item>
          <Menu.Item key="benchmarking">
            <Link to="/benchmarking">Benchmarking</Link>
          </Menu.Item>
        </>
      )}
      {isAuthenticated ? (
        user?.role === "admin" ? (
          <SubMenu key="account" title="Admin">
            <Menu.Item key="manage">
              <Link to="/manage">Manage</Link>
            </Menu.Item>
            <Menu.Item key="auth" onClick={logout}>
              <Link to="/">Logout</Link>
            </Menu.Item>
          </SubMenu>
        ) : (
          <Menu.Item key="auth" onClick={logout}>
            <Link to="/">Logout</Link>
          </Menu.Item>
        )
      ) : (
        <Menu.Item key="auth" onClick={loginWithPopup}>
          <Link to="/">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Nav;
