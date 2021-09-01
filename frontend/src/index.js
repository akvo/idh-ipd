import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom";
import RVerify from "rverify";
import "./index.css";
import "./font.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { rverifyOptions } from "./lib/util";
import ButtonVerify from "./components/ButtonVerify";

RVerify.configure({ ...rverifyOptions });

const btnReff = React.createRef();

ReactDOM.render(
  <Auth0Provider
    domain="idh-ipd.eu.auth0.com"
    clientId="99w2F1wVLZq8GqJwZph1kE42GuAZFvlF"
    redirectUri={window.location.origin}
    cacheLocation="localstorage"
  >
    <ButtonVerify ref={btnReff} />
    <React.StrictMode>
      <App {...{ btnReff }} />
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
