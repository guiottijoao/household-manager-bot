import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startTasksScheduler } from "../services/scheduler.js";

const { Client, LocalAuth } = pkg;
const client = new Client({
  puppeteer: {
    executablePath:
      "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth({
    clientId: "household-manager",
    dataPath: "/data/.wwebjs_auth",
  }),
});

client.on("qr", (qr) => {
  console.log("QR RECIEVED TYPE SHIII");
  qrcode.generate(qr, { small: true });
});

export const initWhatsapp = () => {
  console.log("Initializing Whatsapp..");
  
  client.initialize();
  client.once("ready", async () => {
    console.log("Client is ready no cap❌⛑");
    startTasksScheduler();
  });

};

export default client;
