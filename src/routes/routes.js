import { Database } from '../database.js';
import { Task } from '../entity/task.js';
import { buildRoutePath } from '../utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { query } = req;
      const { title, description } = query || {};
      const search = title || description ? { title, description } : null;
      const tasks = database.select('tasks', search);
      console.log(tasks);
      return res
        .setHeader('content-type', 'application/json')
        .end(JSON.stringify(tasks.map((t) => t.toJSON())));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (!req.body) return res.writeHead(400).end('Corpo inválido');

      const { title, description } = req.body;
      if (!title || !description)
        return res
          .writeHead(422)
          .end('Campos title e description são obrigatórios');

      const newTask = database.insert('tasks', {
        title,
        description,
        completed_at: null,
      });
      return res.writeHead(201).end(JSON.stringify(newTask.toJSON()));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      if (!req.body) return res.writeHead(400).end('Corpo inválido');

      const { title, description } = req.body;

      const tasks = database.select('tasks');
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return res.writeHead(404).end('Tarefa não encontrada');

      const updated = {
        id,
        title: title ?? existing.title,
        description: description ?? existing.description,
        created_at: existing.created_at,
        updated_at: new Date(),
        completed_at: existing.completed_at,
      };

      const task = new Task(updated);
      database.update('tasks', id, task);
      return res
        .setHeader('content-type', 'application/json')
        .end(JSON.stringify(task.toJSON()));
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const tasks = database.select('tasks');
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return res.writeHead(404).end('Tarefa não encontrada');

      database.remove('tasks', id);
      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const tasks = database.select('tasks');
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return res.writeHead(404).end('Tarefa não encontrada');

      const isCompleted = existing.completed_at !== null;
      const completed_at = isCompleted ? null : new Date();

      existing.completed_at = completed_at;
      existing.updated_at = new Date();

      database.update('tasks', id, existing);

      return res
        .setHeader('content-type', 'application/json')
        .end(JSON.stringify(existing.toJSON()));
    },
  },
];
