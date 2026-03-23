import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth({
    clientId: "household-manager"
  }),
});

client.on("qr", (qr) => {
  console.log("QR RECIEVED TYPE SHIII");
  qrcode.generate(qr, { small: true });
});

export const initWhatsapp = () => {
  console.log("Initializing Whatsapp..")
  client.initialize()
}

client.once("ready", async () => {
  console.log("Client is ready no cap❌⛑");
});

export default client