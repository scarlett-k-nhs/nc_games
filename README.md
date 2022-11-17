# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.


## Linking to Databases

To set-up this repo, you will need to create two enviroment files.
* An '.env.development' file with PGDATABASE = nc_games.
* An '.env.test' file with PGDATABASE = nc_games_test.

## GET /api
This endpoint gets a JSON object with all of the endpoints avalible to make.

## GET /api/categories

This endpoint gets an array of category objects with a slug and description property.

## GET /api/reviews

This endpoint gets an array of review objects with review_id, title, designer, owner, review_img_url, category, created at, votes, and comment count. 

Queries that can be made:
* **?category=** - this will filter the array by category given.
* **?sort_by=** - this will sort the array by a given property of the review objects.
* **?order=** - this will sort the array by ascending (asc) or descending (desc).

By default the array returned will be sort by created_at in descending order.

## GET /api/reviews/:review_id

This endpoint will get a review object with properties of review_id, title, designer, owner, review_img_url, category, created at, votes, and comment count, when given a specified review id.

## GET /api/reviews/:review_id/comments

This endpoint will return an array of comment object that have the specified review id.

## GET /api/users

This endpoint will return an array of user objects with the properties of username, name, and avatar_url.

## POST /api/reviews/:review_id/comments

This endpoint will add a comment to the comments array and given a pre-specified review id and will return a comment object with comment id, body, review id, author, votes, and created at.

## PATCH /api/reviews/:review_id

This enpoint will take an object with a property of inc_vote and will update the votes of the review with the review id specified.

## DELETE /api/comments/1

This endpoint will delete a comment


