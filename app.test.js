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
    test("Responds with an array of review objects with correct properties", () => {
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

describe('getReviewsById', () => {
  test("Responds with a review object with correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({body}) => {
        expect(body.review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("Responds with 400 when the wrong datatype is given for reviewid", () => {
    return request(app)
      .get("/api/reviews/nonsense")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('bad request!')
      });
  });
  test("Responds with 404 and invalid review_id given", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid review id given')
      });
  });

})

describe('postComment', () => {
  test('Responds with 201 and returns with new comment object at the top ', () => {
    
    const testComment = {
      username: 'mallionaire',
      body:'some comment'
    }
    
    return request(app)
    .post("/api/reviews/1/comments")
    .send(testComment)
    .expect(201)
    .then(({body}) => {
      expect(body.comment[0]).toMatchObject({
        comment_id: expect.any(Number),
        body:'some comment',
        review_id:1,
        author:'mallionaire',
        votes: 0,
        created_at: expect.any(String)        
      });
    })
  })
  test("Responds with 404 when the wrong datatype is given for reviewid", () => {
    const testComment = {
      username: 'mallionaire',
      body:'some comment'
    }
    
    return request(app)
    .post("/api/reviews/nonsense/comments")
    .send(testComment)
    .expect(400)
  });
});

describe('getCommentsByReviewId', () => {
  test('get an array of comments for a given review id with correct properties', () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({body}) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes:expect.any(Number),
            created_at:expect.any(String),
            author:expect.any(String),
            body:expect.any(String),
            review_id: 2
        });
        })
    });
  })
  test('get an empty array when no comments exist', () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments.length).toBe(0);
    });
  })
  test("Responds with 400 when the wrong datatype is given for reviewid", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('bad request!')
      });
  });

  test("Responds with 400 and invalid review_id given", () => {
    const testComment = {
      username: 'mallionaire',
      body:'some comment'
    }
    
    return request(app)
    .post("/api/reviews/999/comments")
    .send(testComment)
    .expect(404)

  test("Responds with 404 and invalid review_id given", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid review id given')
      });
  });

});

describe('patchReviewById', () => {
  test('votes remain the same when given an object with 0.', () => {
    
    const newVote = {
      inc_votes: 0
    }
    
    return request(app)
    .patch("/api/reviews/1")
    .send(newVote)
    .expect(200)
    .then(({body}) => {
      expect(body.review).toMatchObject({
        review_id: 1,
        title: expect.any(String),
        designer: expect.any(String),
        owner: expect.any(String),
        review_img_url: expect.any(String),
        review_body: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: 1,
      });
    })
  })
  test('votes increment by 1 ', () => {
    
    const newVote = {
      inc_votes: 1
    }
    
    return request(app)
    .patch("/api/reviews/1")
    .send(newVote)
    .expect(200)
    .then(({body}) => {
      expect(body.review).toMatchObject({
        review_id: 1,
        title: expect.any(String),
        designer: expect.any(String),
        owner: expect.any(String),
        review_img_url: expect.any(String),
        review_body: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: 2,
      });
    })
  })
  test('responds with 400 when non datatype request is made', () => {
    
    const newVote = {
      inc_votes: 1
    }
    
    return request(app)
    .patch("/api/reviews/nonsense")
    .send(newVote)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('bad request!')
    })
  })
  test('responds with 404 when review id does not exist', () => {
    
    const newVote = {
      inc_votes: 1
    }
    
    return request(app)
    .patch("/api/reviews/999")
    .send(newVote)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('review id not found')
    })
  })
  test('responds with 400 when inc_votes is not given', () => {
    
    const newVote = {
    }
    
    return request(app)
    .patch("/api/reviews/1")
    .send(newVote)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('No inc_votes key has been given')
    })
  })
  test('responds with 404 when inc_votes is not a number datatype', () => {
    
    const newVote = {
      inc_votes: 'word'
    }
    
    return request(app)
    .patch("/api/reviews/1")
    .send(newVote)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('inc_votes needs to be a number')
    })
  })

})


  test('check that the keys needed in the object are given', () => {
    
    const testComment = {
      username:'mallionaire'
    }
    
    return request(app)
    .post("/api/reviews/1/comments")
    .send(testComment)
    .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('bad request as keys are missing')
      });
  })
  test('check that the keys are the correct datatype', () => {
    
    const testComment = {
      username: 'mallionaire',
      body: 5
    }
    
    return request(app)
    .post("/api/reviews/1/comments")
    .send(testComment)
    .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('information given by the object is not the right data type')
      });
  })
  test("provides error when username given doesn't exist", () => {
    
    const testComment = {
      username: 'testa',
      body: 'some commennt'
    }
    
    return request(app)
    .post("/api/reviews/1/comments")
    .send(testComment)
    .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('bad request!')
      });
  })
  
})
})

