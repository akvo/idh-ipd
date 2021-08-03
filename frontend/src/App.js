import React, { useEffect } from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout } from "antd";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Introduction from "./pages/Introduction";
import DataMap from "./pages/DataMap";
import Case from "./pages/Case";

import "./App.scss";

import { UIStore } from "./data/store";
import axios from "axios";
import { titleCase } from "./utils/util";

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;

function App() {
  const user = UIStore.useState((s) => s.user);
  const page = UIStore.useState((s) => s.page);

  useEffect(() => {
    document.title = titleCase(page);
  }, [page]);

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
          <ProtectedRoute exact path="/" component={Introduction} />
          <ProtectedRoute exact path="/data-map" component={DataMap} />
          <ProtectedRoute exact path="/case" component={Case} />
          <Route exact path="/login" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/register"
            render={(props) => <Register {...props} />}
          />
        </Content>
        <Footer className={`footer ${!user && "fixed"}`}>
          IDH - IPD ©2021 Created by Akvo
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
