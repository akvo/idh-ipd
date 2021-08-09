import React, { useEffect } from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout } from "antd";
import AOS from "aos";

import "./App.scss";
import "aos/dist/aos.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Register from "./pages/Register";
import Introduction from "./pages/Introduction";
import DataMap from "./pages/DataMap";
import Case from "./pages/Case";
import Benchmarking from "./pages/Benchmarking";
import IncomeDriverTool from "./pages/IncomeDriverTool";
import Doc from "./pages/Doc";

import { UIStore } from "./data/store";
import { titleCase } from "./lib/util";
import { useAuth0 } from "@auth0/auth0-react";

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;

function App() {
  const {
    isAuthenticated,
    getIdTokenClaims,
    loginWithPopup,
    logout,
    user,
  } = useAuth0();
  const userData = UIStore.useState((s) => s.user);
  const page = UIStore.useState((s) => s.page);

  useEffect(() => {
    document.title = titleCase(page, "-");
    if (page !== "case") {
      UIStore.update((s) => {
        s.selectedCountry = null;
      });
    }
  }, [page]);

  useEffect(() => {
    (async function () {
      const response = await getIdTokenClaims();
      if (isAuthenticated) {
        UIStore.update((s) => {
          s.user = { token: response.__raw, ...user };
        });
      }
    })();
  }, [getIdTokenClaims, isAuthenticated, loginWithPopup, user]);

  console.log(userData);

  AOS.init();
  return (
    <Router history={history}>
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 2, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/">
              <div className="logo" />
            </Link>
            <Nav
              loginWithPopup={loginWithPopup}
              isAuthenticated={isAuthenticated}
              logout={logout}
            />
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
