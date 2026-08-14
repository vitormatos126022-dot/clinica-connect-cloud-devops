const { config } = require("../../common/config");
const { pool } = require("../../common/database");
const { createServiceApp, errorHandler, fetchJson, notFoundHandler } = require("../../common/http");

function createAppointmentsApp() {
  const app = createServiceApp("appointments-service");

  app.get("/appointments", async (request, response, next) => {
    try {
      const result = await pool.query("SELECT id, patient_name, specialty, scheduled_at, status FROM appointments ORDER BY scheduled_at DESC");
      response.json({ status: true, appointments: result.rows });
    } catch (error) {
      next(error);
    }
  });

  app.post("/appointments", async (request, response, next) => {
    const { patientName, specialty, scheduledAt, supplyId, supplyQuantity } = request.body;
    if (!patientName || !specialty || !scheduledAt) {
      response.status(400).json({ status: false, message: "patientName, specialty e scheduledAt sao obrigatorios." });
      return;
    }

    try {
      let reservation = null;
      if (supplyId && supplyQuantity) {
        const reserved = await fetchJson(`${config.services.stock}/supplies/reserve`, {
          method: "POST",
          headers: { "x-request-id": request.requestId },
          body: JSON.stringify({ supplyId, quantity: supplyQuantity }),
        });
        reservation = reserved.reservation;
      }

      const result = await pool.query(
        "INSERT INTO appointments (patient_name, specialty, scheduled_at, status) VALUES ($1, $2, $3, $4) RETURNING id, patient_name, specialty, scheduled_at, status",
        [patientName, specialty, scheduledAt, "scheduled"],
      );

      await fetchJson(`${config.services.notifications}/notifications/send`, {
        method: "POST",
        headers: { "x-request-id": request.requestId },
        body: JSON.stringify({ patientName, channel: "email", message: `Consulta de ${specialty} agendada.` }),
      });

      response.status(201).json({ status: true, appointment: result.rows[0], reservation });
    } catch (error) {
      next(error);
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createAppointmentsApp };
