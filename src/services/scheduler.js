import prisma from "../database/client.js";
import taskFormatter from "../utils/formatter.js";
import client from "../bot/whatsapp.js";
import cron from "node-cron";
import "dotenv/config";

const weekDays = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

const cronScheduleExpression = `45 7 * * *`;
const cronReminderExpression = `30 20 * * *`;

export function startTasksScheduler() {
  if (!client || !client.info || !client.info.wid) {
    console.error(
      "⚠️ Erro: Tentativa de envio negada. O cliente WhatsApp ainda não está pronto.",
    );
    return;
  }
  cron.schedule(cronScheduleExpression, async () => {
    console.log("⏰ Running automatic tasks sending..");

    const date = new Date();
    const today = weekDays[date.getDay()];

    try {
      const todaysTasks = await prisma.task.findMany({
        where: {
          day: today,
        },
      });

      if (!todaysTasks || todaysTasks.length === 0) {
        await client.sendMessage(
          groupChatId,
          "🧘‍♂️ Bom dia!\nNenhuma tarefa para hoje, aproveitem o descanso.",
        );
        return;
      }

      const formattedTasks = todaysTasks.map((task) => taskFormatter(task));
      const header = "🌻 Bom dia, pessoal!\n\n📌 _Tarefas de hoje:_\n\n";
      const tasksMessageBody = formattedTasks.join("\n\n");
      const message = header + tasksMessageBody;
      const groupChatId = process.env.GROUPCHAT_ID;

      await client.sendMessage(groupChatId, message);
      console.log("✅ Message sent successfully.");
    } catch (error) {
      console.error("❌ Erro in scheduler:", error);
    }
  });

  cron.schedule(cronReminderExpression, async () => {
    console.log("⏰ Running tasks reminder..");

    const date = new Date();
    const today = weekDays[date.getDay()];

    try {
      const todaysTasks = await prisma.task.findMany({
        where: {
          day: today,
        },
      });

      if (!todaysTasks || todaysTasks.length === 0) return;

      const formattedTasks = todaysTasks.map((task) => taskFormatter(task));
      const reminderHeader = "🌙 Lembrete!\n\n📌 _Tarefas de hoje:_\n\n";
      const tasksMessageBody = formattedTasks.join("\n\n");
      const reminder = reminderHeader + tasksMessageBody;
      const groupChatId = process.env.GROUPCHAT_ID;

      await client.sendMessage(groupChatId, reminder);
      console.log("✅ Message sent successfully.");
    } catch (error) {
      console.error("❌ Erro in scheduler:", error);
    }
  });
}
