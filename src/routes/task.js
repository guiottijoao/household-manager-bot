import express from "express";
import TaskController from "../controllers/taskController.js";

const routes = express.Router();

routes.get('/tasks', TaskController.getTasks)
routes.get('/tasks/:day', TaskController.getTasksByDay)
routes.post('/tasks', TaskController.createTask)
routes.put('/tasks/:id', TaskController.updateTask)
routes.delete('/tasks/:id', TaskController.deleteTask)

export default routes;
