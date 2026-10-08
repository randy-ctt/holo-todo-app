import { test, expect } from "bun:test";
import { listTodos, getTodo, addTodo } from "./todos";
test("lists seeded todos", () => { expect(listTodos().length).toBeGreaterThanOrEqual(2); });
test("gets a todo by id", () => { expect(getTodo("t1")?.title).toBe("write the spec"); });
test("adds a todo (not done)", () => { expect(addTodo("new task").done).toBe(false); });
