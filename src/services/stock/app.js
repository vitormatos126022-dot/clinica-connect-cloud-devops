const { pool } = require("../../common/database");
const { createServiceApp, errorHandler, notFoundHandler } = require("../../common/http");

function createStockApp() {
  const app = createServiceApp("stock-service");

  app.get("/supplies", async (request, response, next) => {
    try {
      const result = await pool.query("SELECT id, code, name, category, quantity FROM supplies ORDER BY name");
      response.json({ status: true, supplies: result.rows });
    } catch (error) {
      next(error);
    }
  });

  app.post("/supplies/reserve", async (request, response, next) => {
    const { supplyId, quantity } = request.body;
    if (!supplyId || !Number.isInteger(quantity) || quantity <= 0) {
      response.status(400).json({ status: false, message: "supplyId e quantity inteiro positivo sao obrigatorios." });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query("SELECT id, name, quantity FROM supplies WHERE id = $1 FOR UPDATE", [supplyId]);
      if (result.rowCount === 0) {
        response.status(404).json({ status: false, message: "Insumo nao encontrado." });
        await client.query("ROLLBACK");
        return;
      }

      const supply = result.rows[0];
      if (Number(supply.quantity) < quantity) {
        response.status(409).json({ status: false, message: "Quantidade indisponivel no estoque." });
        await client.query("ROLLBACK");
        return;
      }

      await client.query("UPDATE supplies SET quantity = quantity - $1 WHERE id = $2", [quantity, supplyId]);
      await client.query("COMMIT");
      response.json({ status: true, reservation: { supplyId, supplyName: supply.name, quantity } });
    } catch (error) {
      await client.query("ROLLBACK");
      next(error);
    } finally {
      client.release();
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createStockApp };
