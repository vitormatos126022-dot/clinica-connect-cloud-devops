const { createServiceApp, errorHandler, notFoundHandler } = require("../../common/http");

function createNotificationsApp() {
  const app = createServiceApp("notifications-service");

  app.post("/notifications/send", (request, response) => {
    const { patientName, channel, message } = request.body;
    if (!patientName || !channel || !message) {
      response.status(400).json({ status: false, message: "patientName, channel e message sao obrigatorios." });
      return;
    }

    response.json({
      status: true,
      notification: {
        patientName,
        channel,
        delivered: true,
        provider: "mock-notifier",
      },
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createNotificationsApp };
