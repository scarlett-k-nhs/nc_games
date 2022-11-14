const request = require("supertest");
const seed = require("./db/seeds/seed.js");
const data = require("./db/data/test-data");
const app = require("./app.js");
const db = require("./db/connection.js");

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
});

describe('getCategories', () => {
    test("Responds with an object containing an array of category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then((res) => {
            expect(res.body.categories).toEqual(expect.any(Array));
          });
      });
      test("Responds with castegory objects with correct properties", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({body}) => {
            body.categories.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
          });
      });
})