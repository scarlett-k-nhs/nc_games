# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.


## Linking to Databases

To set-up this repo, you will need to create two enviroment files.
* An '.env.development' file with PGDATABASE = nc_games.
* An '.env.test' file with PGDATABASE = nc_games_test.

## GET /api/categories

This function gets an array of category objects with a slug and description property.
