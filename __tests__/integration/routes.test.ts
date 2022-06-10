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

  it("Provides custom amounts of products depending on the count query in the url", async () => {
    const result = await request(app).get("/products?count=100");
    expect(result.statusCode).toEqual(200);
    expect(Array.isArray(result.body)).toEqual(true);
    expect(result.body.length).toEqual(100);

    const result2 = await request(app).get("/products?count=40");
    expect(result2.statusCode).toEqual(200);
    expect(Array.isArray(result2.body)).toEqual(true);
    expect(result2.body.length).toEqual(40);
  });

  it("Provides pages of items depending on default count of 5", async () => {
    const result1 = await request(app).get("/products?page=1");
    expect(result1.statusCode).toEqual(200);
    expect(Array.isArray(result1.body)).toEqual(true);
    expect(result1.body.length).toEqual(5);
    const fifthId = result1.body[4].id;

    const result2 = await request(app).get("/products?page=2");
    expect(result2.statusCode).toEqual(200);
    expect(Array.isArray(result2.body)).toEqual(true);
    expect(result2.body.length).toEqual(5);
    const tenthId = result2.body[4].id;
    expect(tenthId > fifthId).toEqual(true);

    const result3 = await request(app).get("/products?page=3");
    expect(result3.statusCode).toEqual(200);
    expect(Array.isArray(result3.body)).toEqual(true);
    expect(result3.body.length).toEqual(5);
    const fifteenthId = result3.body[4].id;
    expect(fifteenthId > fifthId).toEqual(true);
    expect(fifteenthId > tenthId).toEqual(true);
  });

  it("Provides pages of items depending on custom count", async () => {
    const result1 = await request(app).get("/products?page=1&count=6");
    expect(result1.statusCode).toEqual(200);
    expect(Array.isArray(result1.body)).toEqual(true);
    expect(result1.body.length).toEqual(6);
    const sixthId = result1.body[5].id;

    const result2 = await request(app).get("/products?page=2&count=6");
    expect(result2.statusCode).toEqual(200);
    expect(Array.isArray(result2.body)).toEqual(true);
    expect(result2.body.length).toEqual(6);
    const twelfthId = result2.body[5].id;
    expect(twelfthId > sixthId).toEqual(true);

    const result3 = await request(app).get("/products?page=3&count=6");
    expect(result3.statusCode).toEqual(200);
    expect(Array.isArray(result3.body)).toEqual(true);
    expect(result3.body.length).toEqual(6);
    const eighteenthId = result3.body[5].id;
    expect(eighteenthId > sixthId).toEqual(true);
  });
});
