require("dotenv").config();
import { app, server } from "../../server";
import request from "supertest";

afterAll(() => {
  server.close();
});

// no type testing through jest thanks to TypeScript :)
describe("GET /products", () => {
  it("Provides the first 5 products in an array", async () => {
    const result = await request(app).get("/products");
    expect(result.statusCode).toEqual(200);
    expect(Array.isArray(result.body)).toEqual(true);
    expect(result.body.length).toEqual(5);
  });
});
