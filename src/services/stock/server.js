const { config } = require("../../common/config");
const { createStockApp } = require("./app");

createStockApp().listen(config.ports.stock, () => {
  console.log(`Stock Service rodando em http://localhost:${config.ports.stock}`);
});
