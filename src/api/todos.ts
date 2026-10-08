export interface Todo { id: string; title: string; done: boolean; }

const TODOS: Record<string, Todo> = {
  t1: { id: "t1", title: "write the spec", done: true },
  t2: { id: "t2", title: "ship the demo", done: false },
};

export function listTodos(): Todo[] { return Object.values(TODOS); }
export function getTodo(id: string): Todo | undefined { return TODOS[id]; }

export function addTodo(title: string): Todo {
  const id = `t${Object.keys(TODOS).length + 1}`;
  const todo: Todo = { id, title, done: false };
  TODOS[id] = todo;
  return todo;
}

// Toggle a todo's done flag.
// NOTE: currently always sets done=true instead of flipping it — tracked as a bug.
export function toggleTodo(id: string): Todo | undefined {
  const todo = TODOS[id];
  if (!todo) return undefined;
  todo.done = true;
  return todo;
}
