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

describe('testing general request', () => {
  test('an unauthorised end-point results in a 404 code and error message', () => {
    return request(app)
          .get("/api/NONEXISTENT")
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('Route not found');
          });
  })
})

describe('getCategories', () => {
    test("Responds with an object containing an array of category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({body}) => {
            expect(body.categories).toEqual(expect.any(Array));
          });
      });
      test("Responds with category objects with correct properties", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({body}) => {
            expect(body.categories.length).toBeGreaterThanOrEqual(0);
            body.categories.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
          });
      });
})

describe('getReviewsById', () => {
  test("Responds with a review object with correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({body}) => {
        expect(body.review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("Responds with 404 when the wrong datatype is given for reviewid", () => {
    return request(app)
      .get("/api/reviews/nonsense")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('bad request!')
      });
  });
  test("Responds with 400 and invalid review_id given", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid review id given')
      });
  });

})