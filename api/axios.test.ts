import { assertEquals } from "https://deno.land/std@0.187.0/testing/asserts.ts";
import AxiosAPI from "./axios.ts";

Deno.test("axios", async () => {
  const axios = AxiosAPI.getInstance();
  assertEquals(await axios.getCards(), {
    status: 0,
    statusText: "",
    config: {},
    data: undefined,
    headers: new Headers(),
    redirect: false,
    url: "",
    type: "error",
    body: null,
    bodyUsed: false,
  });
});
