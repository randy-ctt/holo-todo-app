import { test, expect } from "bun:test";
import { listTodos, getTodo, addTodo, toggleTodo } from "./todos";
test("lists seeded todos", () => { expect(listTodos().length).toBeGreaterThanOrEqual(2); });
test("gets a todo by id", () => { expect(getTodo("t1")?.title).toBe("write the spec"); });
test("adds a todo (not done)", () => { expect(addTodo("new task").done).toBe(false); });

test("test_toggleTodo_notDoneTodo_becomesDone", () => {
  const todo = addTodo("toggle me on");
  expect(toggleTodo(todo.id)?.done).toBe(true);
});

test("test_toggleTodo_doneTodo_becomesNotDone", () => {
  const todo = addTodo("toggle me off");
  toggleTodo(todo.id);
  expect(toggleTodo(todo.id)?.done).toBe(false);
});

test("test_toggleTodo_twice_returnsToOriginalState", () => {
  const todo = addTodo("toggle me twice");
  const original = todo.done;
  toggleTodo(todo.id);
  toggleTodo(todo.id);
  expect(getTodo(todo.id)?.done).toBe(original);
});

test("test_toggleTodo_unknownId_returnsUndefined", () => {
  expect(toggleTodo("no-such-id")).toBeUndefined();
});
