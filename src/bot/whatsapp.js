import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startTasksScheduler } from "../services/scheduler.js";

const { Client, LocalAuth } = pkg;
const client = new Client({
  puppeteer: {
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-zygote",
      "--no-first-run",
      "--disable-gpu",
      "--single-process",
      "--disable-extensions",
      "--disable-software-rasterizer",
      "--window-size=1280,720",
    ],
  },
  authStrategy: new LocalAuth({
    clientId: "household-manager",
    dataPath: "./.wwebjs_auth",
  }),
});

client.on("qr", (qr) => {
  console.log("QR RECIEVED TYPE SHIII");
  qrcode.generate(qr, { small: true });
  console.log(
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + qr,
  );
});

client.on("auth_failure", (msg) => {
  console.log("AUTH FAILURE:", msg);
});

client.on("disconnected", (reason) => {
  console.warn("⚠️ WhatsApp desconectado:", reason);
  console.log("🔄 Tentando reinicializar em 5 segundos...");
  setTimeout(() => {
    client.initialize();
  }, 5000);
});

export const initWhatsapp = () => {
  console.log("Initializing Whatsapp..");
  console.log("Executando chromium em:", process.env.PUPPETEER_EXECUTABLE_PATH);

  client.once("ready", async () => {
    console.log("Client is ready");
    startTasksScheduler();
  });

  client.initialize().catch((error) => {
    console.error("ERRO AO INICIALIZAR:", error);
  });
};

export default client;
