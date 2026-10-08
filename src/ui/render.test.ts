import { test, expect } from "bun:test";
import { renderRow, renderTodos } from "./render";

test("renderRow_doneTodo_showsCheckedMarker", () => {
  const row = renderRow({ id: "t1", title: "write the spec", done: true });
  expect(row).toContain("[x]");
  expect(row).toContain("write the spec");
});

test("renderRow_pendingTodo_showsUncheckedMarker", () => {
  const row = renderRow({ id: "t2", title: "ship the demo", done: false });
  expect(row).toContain("[ ]");
  expect(row).toContain("ship the demo");
});

test("renderTodos_seededList_rendersStatusPerRow", () => {
  const rows = renderTodos().split("\n");
  expect(rows.length).toBe(2);
  expect(rows.some((r) => r.includes("[x]") && r.includes("write the spec"))).toBe(true);
  expect(rows.some((r) => r.includes("[ ]") && r.includes("ship the demo"))).toBe(true);
});
