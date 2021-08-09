import React, { useEffect } from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout, Image } from "antd";
import AOS from "aos";

import "./App.scss";
import "aos/dist/aos.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Introduction from "./pages/Introduction";
import DataMap from "./pages/DataMap";
import Case from "./pages/Case";
import Benchmarking from "./pages/Benchmarking";
import IncomeDriverTool from "./pages/IncomeDriverTool";
import Doc from "./pages/Doc";

import { UIStore } from "./data/store";
import { titleCase } from "./lib/util";
import { useAuth0 } from "@auth0/auth0-react";
import api from "./lib/api";

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
  const page = UIStore.useState((s) => s.page);

  useEffect(() => {
    document.title = titleCase(page, "-");
    (async function () {
      const response = await getIdTokenClaims();
      if (isAuthenticated) {
        api
          .get("/country-company")
          .then((res) => res.data)
          .then((country) => {
            api
              .get("/crop/?skip=0&limit=100")
              .then((res) => res.data)
              .then((crop) => {
                UIStore.update((c) => {
                  c.countries = country;
                  c.crops = crop;
                  c.selectedCountry = page === "case" ? null : page;
                  c.user = user;
                });
              });
          });
        api.setToken(response?.__raw);
      }
    })();
  }, [getIdTokenClaims, isAuthenticated, loginWithPopup, user, page]);

  AOS.init();
  return (
    <Router history={history}>
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 2, width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Link to="/">
              <Image
                className="logo"
                preview={false}
                height={30}
                src="/icons/logo-white.png"
              />
            </Link>
            <Nav
              loginWithPopup={loginWithPopup}
              isAuthenticated={isAuthenticated}
              logout={logout}
            />
          </div>
        </Header>
        <Content>
          <Route exact path="/" component={Introduction} />
          <ProtectedRoute exact path="/data-map" component={DataMap} />
          <ProtectedRoute exact path="/case" component={Case} />
          <ProtectedRoute exact path="/benchmarking" component={Benchmarking} />
          <ProtectedRoute
            exact
            path="/income-driver-tool"
            component={IncomeDriverTool}
          />
          <Route exact path="/docs" component={Doc} />
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
