import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { startTasksScheduler } from "../services/scheduler.js";

let lastQR = null;
let sock = null;

export const getSock = () => sock;
export const getQR = () => lastQR;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./.baileys_auth");

  sock = makeWASocket({
    auth: state,
  });

  sock.ev.on("connection.update", (update) => {
    const { qr, connection, lastDisconnect } = update;

    if (qr) {
      console.log("QR received at:", new Date().toLocaleTimeString());
      qrcode.generate(qr, { small: true });
      lastQR = qr;
      console.log(
        "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + qr,
      );
    }

    if (connection === "open") {
      console.log("Client is ready");
      startTasksScheduler();
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.warn("⚠️ WhatsApp disconnected:", lastDisconnect?.error?.message);

      if (shouldReconnect) {
        console.log("🔄 Reconnecting in 5 seconds...");
        setTimeout(connectToWhatsApp, 5000);
      } else {
        console.log("Logged out. Scan QR again.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

export const initWhatsapp = async () => {
  console.log("Initializing WhatsApp...");
  await connectToWhatsApp();
};

// Allow running directly: node src/bot/whatsapp.js
const isMain = process.argv[1]?.endsWith("whatsapp.js");
if (isMain) {
  initWhatsapp();
}
