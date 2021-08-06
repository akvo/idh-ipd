import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const Doc = () => <SwaggerUI url="/api/openapi.json" />;

export default Doc;
