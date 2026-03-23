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

const date = new Date();

const cronScheduleExpression = `0 7 * * ${date.getDay()}`;

export function startTasksScheduler() {
  cron.schedule(cronScheduleExpression, async () => {
    console.log("⏰ Running automatic tasks sending..");
    
    const today = weekDays[date.getDay()];
    
    try {
      const todaysTasks = await prisma.task.findMany({
        where: {
          day: today,
        },
      });
      
      if (!todaysTasks || todaysTasks.length === 0)
        return "🧘‍♂️ Bom dia!\nNenhuma tarefa para hoje, aproveitem o descanso.";
      
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
}
