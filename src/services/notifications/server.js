const { config } = require("../../common/config");
const { createNotificationsApp } = require("./app");

createNotificationsApp().listen(config.ports.notifications, () => {
  console.log(`Notifications Service rodando em http://localhost:${config.ports.notifications}`);
});
