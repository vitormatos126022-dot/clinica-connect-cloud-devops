const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createNotificationsApp } = require("../src/services/notifications/app");

async function withServer(app, callback) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  try {
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("notifications service sends valid notification", async () => {
  await withServer(createNotificationsApp(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/notifications/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ patientName: "Victor", channel: "email", message: "Consulta confirmada" }),
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, true);
    assert.equal(body.notification.delivered, true);
  });
});

test("notifications service rejects invalid payload", async () => {
  await withServer(createNotificationsApp(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/notifications/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ patientName: "Victor" }),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.status, false);
  });
});
