import React, { useState } from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout } from "antd";

import Introduction from "./pages/Introduction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DataMap from "./pages/DataMap";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";

import "./App.scss";

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState(false);

  return (
    <Router history={history}>
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/">
              <div className="logo" />
            </Link>
            {user && <Nav />}
          </div>
        </Header>
        <Content>
          <ProtectedRoute
            exact
            path="/"
            user={user}
            setUser={setUser}
            component={Introduction}
          />
          <ProtectedRoute
            exact
            path="/data-map"
            user={user}
            setUser={setUser}
            component={DataMap}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} user={user} setUser={setUser} />
            )}
          />
          <Route
            exact
            path="/register"
            render={(props) => <Register {...props} />}
          />
        </Content>
        <Footer className={`footer ${(!user) && "fixed"}`}>
          IDH - IPD ©2021 Created by Akvo
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
