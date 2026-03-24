import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startTasksScheduler } from "../services/scheduler.js";

const { Client, LocalAuth } = pkg;
const client = new Client({
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
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
  console.log("DISCONNECTED:", reason);
});

export const initWhatsapp = async () => {
  console.log("Initializing Whatsapp..");
  console.log("Executando chromium em:", process.env.PUPPETEER_EXECUTABLE_PATH);

  try {
    await client.initialize();
    console.log("Initialize chamado");
  } catch (err) {
    console.error("ERRO AO INICIALIZAR:", err);
  }

  client.once("ready", async () => {
    console.log("Client is ready");
    startTasksScheduler();
  });
};

export default client;
