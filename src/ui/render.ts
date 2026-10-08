import { listTodos, type Todo } from "../api/todos";

/** Render the todo list as plain-text rows. */
export function renderTodos(): string {
  return listTodos().map(renderRow).join("\n");
}

export function renderRow(t: Todo): string {
  return `- ${t.title}`;
}
