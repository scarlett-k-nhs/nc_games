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

describe('getReviews', () => {
  test("Responds with an object containing an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) => {
          expect(body.reviews).toEqual(expect.any(Array));
        });
    });
    test("Responds with review objects with correct properties", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) => {
          expect(body.reviews.length).toBeGreaterThanOrEqual(0);
          body.reviews.forEach((review) => {
              expect(review).toMatchObject({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  designer: expect.any(String),
                  owner: expect.any(String),
                  review_img_url: expect.any(String),
                  category: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(Number)
              })
          })
        });
    });
    test("Responds with review objects ordered by date in descending", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) => {
          expect(body.reviews).toBeSortedBy('created_at', {descending: true});
        });
    });
})