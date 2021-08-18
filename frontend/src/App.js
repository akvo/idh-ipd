import React, { useEffect } from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout, notification } from "antd";
import AOS from "aos";

import "./App.scss";
import "aos/dist/aos.css";
import "rverify/dist/RVerify.min.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Introduction from "./pages/Introduction";
import DataMap from "./pages/DataMap";
import Case from "./pages/Case";
import Benchmarking from "./pages/Benchmarking";
import IncomeDriverTool from "./pages/IncomeDriverTool";
import Manage from "./pages/Manage";
import Doc from "./pages/Doc";

import { UIStore } from "./data/store";
import { titleCase } from "./lib/util";
import { useAuth0 } from "@auth0/auth0-react";
import api from "./lib/api";

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;

function App({ btnReff }) {
  const {
    isAuthenticated,
    loginWithPopup,
    logout,
    user,
    getIdTokenClaims,
  } = useAuth0();
  const page = UIStore.useState((s) => s.page);
  const loading = UIStore.useState((s) => s.loading);

  useEffect(() => {
    document.title = titleCase(page, "-");
    (async function () {
      if (isAuthenticated) {
        const response = await getIdTokenClaims();
        api.setToken(response.__raw);
        api.get('/user/me')
          .then(({ data }) => {
            const { active } = data || {}
            UIStore.update((u) => {
              u.user = data
            })
            if (active) {
              api
                .get("/country-company")
                .then((res) => res.data)
                .catch((error) => {
                  const { status, data } = error.response;
                  if (status !== 200) {
                    notification.error({
                      message: data.detail,
                    });
                  }
                  return false;
                })
                .then((country) => {
                  api
                    .get("/crop/?skip=0&limit=100")
                    .then((res) => res.data)
                    .then((crop) => {
                      UIStore.update((c) => {
                        c.countries = country ? country : [];
                        c.crops = crop;
                        c.loading = false;
                      });
                    });
                });
            }
          })
          .catch((e) => {
            switch(e.response?.status){
              case 404:
                btnReff.current.click()
            }
          })
      } else {
        api.setToken(null);
        setTimeout(() => {
          UIStore.update((c) => {
            c.loading = false;
          });
        }, 1000);
      }
    })();
  }, [getIdTokenClaims, isAuthenticated, loginWithPopup, user, page, btnReff]);

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
              <img className="logo" src="/icons/logo-white.png" alt="logo" />
            </Link>
            {!loading && (
              <Nav
                loginWithPopup={loginWithPopup}
                isAuthenticated={isAuthenticated}
                logout={logout}
              />
            )}
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
          <ProtectedRoute exact path="/manage" component={Manage} />
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
