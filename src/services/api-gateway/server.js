const { config } = require("../../common/config");
const { createGatewayApp } = require("./app");

createGatewayApp().listen(config.ports.gateway, () => {
  console.log(`API Gateway rodando em http://localhost:${config.ports.gateway}`);
});
