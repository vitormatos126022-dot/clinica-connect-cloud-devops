const { config } = require("../../common/config");
const { createServiceApp, errorHandler, fetchJson, notFoundHandler } = require("../../common/http");

function createGatewayApp() {
  const app = createServiceApp("api-gateway");

  app.get("/", (request, response) => {
    response.json({
      status: true,
      service: "api-gateway",
      message: "Clinica Connect API Gateway online",
      endpoints: ["GET /supplies", "GET /appointments", "POST /appointments", "POST /notifications/send"],
    });
  });

  app.get("/supplies", async (request, response, next) => {
    try {
      const data = await fetchJson(`${config.services.stock}/supplies`, {
        headers: { "x-request-id": request.requestId },
      });
      response.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/appointments", async (request, response, next) => {
    try {
      const data = await fetchJson(`${config.services.appointments}/appointments`, {
        headers: { "x-request-id": request.requestId },
      });
      response.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/appointments", async (request, response, next) => {
    try {
      const data = await fetchJson(`${config.services.appointments}/appointments`, {
        method: "POST",
        headers: { "x-request-id": request.requestId },
        body: JSON.stringify(request.body),
      });
      response.status(201).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/notifications/send", async (request, response, next) => {
    try {
      const data = await fetchJson(`${config.services.notifications}/notifications/send`, {
        method: "POST",
        headers: { "x-request-id": request.requestId },
        body: JSON.stringify(request.body),
      });
      response.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createGatewayApp };
