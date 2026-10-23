const express = require("express");
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", async (_request, response) => {
  try {
    await pool.query("SELECT 1");
    response.json({ database: "Conectada exitosamente" });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    response.status(503).json({ database: "No se pudo conectar" });
  }
});

app.listen(port, () => {
  console.log(`Nova Salud API activa en http://localhost:${port}`);
});
