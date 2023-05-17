import { assertEquals } from "https://deno.land/std@0.187.0/testing/asserts.ts";

const add = (a: number, b: number) => a + b;

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
