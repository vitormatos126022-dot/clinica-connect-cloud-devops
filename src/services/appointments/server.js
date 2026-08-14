const { config } = require("../../common/config");
const { createAppointmentsApp } = require("./app");

createAppointmentsApp().listen(config.ports.appointments, () => {
  console.log(`Appointments Service rodando em http://localhost:${config.ports.appointments}`);
});
