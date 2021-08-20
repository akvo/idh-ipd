import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "./doc.scss";

const Doc = ({ token }) => {
  if (token) {
    return (
      <SwaggerUI
        withCredentials={true}
        persistAuthorization={true}
        url="/api/openapi.json"
        onComplete={(ui) => {
          ui.preauthorizeApiKey("HTTPBearer", token);
        }}
      />
    );
  }
  return "";
};

export default Doc;
