import fs from 'node:fs/promises';
import { Task } from './entity/task.js';

const databasePath = new URL('../data/db.json', import.meta.url);
export class Database {
  #database = {};
  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if (!this.#database[table]) {
      this.#database[table] = [];
    }
    const task = new Task({ ...data, id: null });

    const plain = {
      id: task.id,
      title: task.title,
      description: task.description,
      created_at: task.created_at,
      updated_at: task.updated_at,
      completed_at: task.completed_at,
    };

    this.#database[table].push(plain);
    this.#persist();

    return task;
  }
  select(table, search) {
    let data = this.#database[table];
    if (!data) return [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          const cell = row[key];
          if (cell === undefined || cell === null) return false;
          return String(cell).includes(String(value));
        });
      });
    }

    return data.map((row) => new Task(row));
  }
  remove(table, id) {
    const tableData = this.#database[table];
    if (!tableData) return;

    this.#database[table] = tableData.filter((item) => item.id !== id);
    this.#persist();
  }
  update(table, id, data) {
    const tableData = this.#database[table];
    if (!tableData) return;

    const index = tableData.findIndex((item) => item.id === id);
    if (index !== -1) {
      const { id: ignoreId, ...modifiedData } = data;
      tableData[index] = { ...tableData[index], ...modifiedData };
    }
    this.#persist();
  }
}
