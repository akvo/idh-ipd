import React, { useState } from "react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout } from "antd";

import Introduction from "./pages/Introduction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";

import "./App.scss";

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState(false);

  return (
    <Layout className="layout" style={{ height: "100vh", overflow: "auto" }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="logo" />
          {user && <Nav />}
        </div>
      </Header>
      <Content>
        <Router history={history}>
          <ProtectedRoute
            exact
            path="/"
            user={user}
            setUser={setUser}
            component={Introduction}
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
            render={(props) => (
              <Register {...props} />
            )}
          />
        </Router>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        IDH - IPD ©2021 Created by Akvo
      </Footer>
    </Layout>
  );
}

export default App;
