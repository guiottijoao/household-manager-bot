import express from "express";
import "dotenv/config";
import { initWhatsapp } from "./bot/whatsapp.js";
import { getQR } from "./bot/whatsapp.js";
import routes from "./routes/task.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running!");
});

app.use("/api", routes);

app.get("/qr", (req, res) => {
  const qr = getQR();
  if (!qr) return res.send("QR não disponível ainda, aguarde...");
  res.send(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}" />`);
});

app.listen(PORT, () => {
  console.log("Server on http://localhost:3000");
  initWhatsapp();
});
