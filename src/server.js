import express from "express";
import "dotenv/config";
import { initWhatsapp } from "./bot/whatsapp.js";
import { startTasksScheduler } from "./services/scheduler.js";
import routes from "./routes/task.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Server on http://localhost:3000");
  initWhatsapp();
  startTasksScheduler()
});
