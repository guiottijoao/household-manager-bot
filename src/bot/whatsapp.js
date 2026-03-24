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
      // "--single-process",
      "--no-zygote",
      "--no-first-run",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-software-rasterizer",
      "--disable-setuid-sandbox",
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
