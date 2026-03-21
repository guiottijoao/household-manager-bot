import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import "dotenv/config";

const groupChatId = process.env.GROUPCHAT_ID;

const { Client, LocalAuth } = pkg;
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

client.once("ready", async () => {
  console.log("Client is ready no cap❌⛑");
  await client.sendMessage(groupChatId, "Hello, whatsapp!");
});

client.on("qr", (qr) => {
  console.log("QR RECIEVED TYPE SHIII");
  qrcode.generate(qr, { small: true });
});

client.on("message_create", (message) => {
  let msg = "ping";
  if (message.body.toLowerCase() === msg) {
    client.sendMessage(message.from, "pong 🏓🙊");
  }
});

client.initialize();

export default client