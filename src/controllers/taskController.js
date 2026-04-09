import prisma from "../database/client.js";

const TaskController = {
  async getTasks(req, res) {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          id: "asc",
        },
      });
      return res.json(tasks);
    } catch (error) {
      console.error("Error during Tasks fetching: ", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  async getTasksByDay(req, res) {
    const { day } = req.params;
    try {
      const tasks = await prisma.task.findMany({
        where: {
          day: day.toUpperCase(),
        },
      });

      return res.json(tasks);
    } catch (error) {
      console.error("Error trying to find task", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  async createTask(req, res) {
    const { person, day, estimatedTimeMin, content } = req.body;

    if (!person || !day || !content) {
      return res.status(400).json({ error: "Missing required data." });
    }

    try {
      const task = await prisma.task.create({
        data: { person, day, estimatedTimeMin, content },
      });
      res.status(201).json(task);
    } catch (error) {
      console.error("Error during task creation: ", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  async updateTask(req, res) {
    const { id } = req.params;
    const { person, day, estimatedTimeMin, content } = req.body;

    try {
      const updatedTask = await prisma.task.update({
        where: {
          id: Number(id),
        },
        data: {
          person,
          day,
          estimatedTimeMin,
          content,
        },
      });
      return res.status(200).json(updatedTask);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Task not found." });
      }
      console.error("Error during task update: ", error);
      res.status(500).json({ error: "Error during update." });
    }
  },

  async deleteTask(req, res) {
    const { id } = req.params;

    try {
      await prisma.task.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Task not found." });
      }
      console.error("Error during task deletion: ", error);
      res.status(500).json({ error: "Error during task deletion" });
    }
  },
};

export default TaskController;
