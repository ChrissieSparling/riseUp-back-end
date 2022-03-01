# riseUp-back-end
This the RISEUP back end- we be twerking back here...

## A Note About the Routes: 
- They are currently set up to avoid using '/api/' as part of the url. If we want to add this back in, we will just need to remove it from the server.js file definition of "routes" on line 10 >> `const routes = require('./routes/api')` and add an idex file pointing to the api route in the routes folder.
- I have tried to leave comments on each route about what it does, and who should have access to it in production.
- For all routes that are post routes, I have tried to include what you would need to put into the `req.body` to complete the request successfully as comments inside the route itself
- All of the routes are going to need AccessControl permissing, and additional validation. I am still working on figuring out the modularization...I commmented out all the corresponding code, and the `roles.js` file @ server level has the roles defined with their corresponsing persmission grants
- The routes to get all comments about a specific post and create a new comment are included in the `postRoutes.js` file, since they require the postId as a foreign key.
- To make testing easy, as they are currently configured in the folders, I'll list the Insomnia routes for each request below:
  - GET all users: `localhost:3005/users` >> you must be logged in to use this route
  - GET user by ID: `localhost:3005/users/:id` >> you must be logged in to use this route
  - POST new user: `localhost:3005/users/new`
  - PUT user: `localhost:3005/users/:id` >> you must be logged in to use this route
  - DELETE user: `localhost:3005/users/:id` >> you must be logged in to use this route
  - POST login: `localhost:3005/users/login` >>you can login as a seeded user or after creating a user
  - POST logout: `localhost:3005/logout` 
  - GET all posts: `localhost:3005/posts` >> you must be logged in to use this route
  - GET a single post by id: `localhost:3005/posts/:id` >> you must be logged in to use this route
  - POST a new post: `localhost:3005/posts/new` >> you must be logged in to use this route
  - PUT a post: `localhost:3005/posts/:id` >> you must be logged in to use this route
  - DELETE a post: `localhost:3005/posts/3` >> you must be logged in to use this route
  - GET all comments: `localhost:3005/comments/` >> you must be logged in to use this route
  - GET a comment by id: `localhost:3005/comments/:id`  >> you must be logged in to use this route
  - POST a new comment: `localhost:3005/posts/:postID/comments/new`  >> you must be logged in to use this route
  - PUT a comment: `localhost:3005/comments/10`  >> you must be logged in to use this route
  - DELETE a comment by id: `localhost:3005/comments/:id`  >> you must be logged in to use this route
