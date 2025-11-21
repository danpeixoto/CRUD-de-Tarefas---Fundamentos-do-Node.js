import { randomUUID } from 'node:crypto';
export class Task {
  #id;
  #title;
  #description;
  #created_at;
  #updated_at;
  #completed_at;

  constructor({
    id,
    title,
    description,
    created_at,
    updated_at,
    completed_at,
  }) {
    this.#id = id ?? randomUUID();
    this.#title = title;
    this.#description = description;
    this.#created_at = created_at ? new Date(created_at) : new Date();
    this.#updated_at = updated_at ? new Date(updated_at) : new Date();
    this.#completed_at = completed_at ? new Date(completed_at) : null;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  set title(title) {
    this.#title = title;
  }

  get description() {
    return this.#description;
  }

  set description(description) {
    this.#description = description;
  }

  get created_at() {
    return this.#created_at;
  }

  get updated_at() {
    return this.#updated_at;
  }

  set updated_at(updated_at) {
    this.#updated_at = updated_at;
  }

  get completed_at() {
    return this.#completed_at;
  }

  set completed_at(completed_at) {
    this.#completed_at = completed_at;
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
      completed_at: this.#completed_at,
    };
  }
}
