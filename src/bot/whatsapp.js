import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startTasksScheduler } from "../services/scheduler.js";

const { Client, LocalAuth } = pkg;
const client = new Client({
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    headless: "shell",
    protocolTimeout: 120000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
      "--no-first-run",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-software-rasterizer",
      "--disable-default-apps",
      "--disable-sync",
      "--disable-translate",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--mute-audio",
      "--safebrowsing-disable-auto-update",
      "--ignore-certificate-errors",
      "--ignore-ssl-errors",
      "--ignore-certificate-errors-spki-list",
      "--js-flags=--max-old-space-size=128",
    ],
  },
  authStrategy: new LocalAuth({
    clientId: "household-manager",
    dataPath: "./.wwebjs_auth",
  }),
});

let lastQR = null;

client.on("qr", (qr) => {
  console.log(
    "QR RECIEVED TYPE SHIII, generated at: ",
    new Date().toLocaleTimeString(),
  );
  qrcode.generate(qr, { small: true });
  lastQR = qr;
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
export const getQR = () => lastQR;
