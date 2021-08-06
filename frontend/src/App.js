import React, { useEffect } from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout } from "antd";
import AOS from "aos";

import "./App.scss";
import "aos/dist/aos.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Introduction from "./pages/Introduction";
import DataMap from "./pages/DataMap";
import Case from "./pages/Case";
import Benchmarking from "./pages/Benchmarking";
import IncomeDriverTool from "./pages/IncomeDriverTool";
import Doc from "./pages/Doc";

import { UIStore } from "./data/store";
import { titleCase } from "./lib/util";
import api from "./lib/api";

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;

function App() {
  const user = UIStore.useState((s) => s.user);
  const page = UIStore.useState((s) => s.page);

  useEffect(() => {
    // api.get("/country/").then((res) => {
    //   UIStore.update((s) => {
    //     s.countries = res.data;
    //   });
    // });
    document.title = titleCase(page, "-");
    page !== "case" &&
      UIStore.update((s) => {
        s.selectedCountry = null;
      });
  }, [page]);

  AOS.init();
  return (
    <Router history={history}>
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 2, width: "100%" }}>
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
          <ProtectedRoute exact path="/benchmarking" component={Benchmarking} />
          <ProtectedRoute
            exact
            path="/income-driver-tool"
            component={IncomeDriverTool}
          />
          <Route exact path="/docs" component={Doc} />
          <Route exact path="/login" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/register"
            render={(props) => <Register {...props} />}
          />
        </Content>
        <Footer className={`footer ${!user && "fixed"}`}>
          IDH - IPD ©2021 Created by Akvo |{" "}
          <Link to="/docs">Documentation</Link>
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
