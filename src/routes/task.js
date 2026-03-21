import express from "express";
import prisma from "../database/client.js";

const routes = express.Router();

routes.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

export default routes;
