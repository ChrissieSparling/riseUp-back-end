// const router = require("express").Router();
// const { User, Post } = require("../../models");

// //TODO: Admin forum control
// //needs get and delete route
// router.get("/admin/username/:postId", (req, res) => {
//   Post.findOne({ postId: req.params.id })
//     .then((posts) =>
//       !posts
//         ? res.status(404).json({ message: "No user with that post" })
//         : res.json(posts)
//     )
//     .catch((err) => res.status(500).json(err));
// });
// router.delete("/admin/username/:postId", (req, res) => {
//     Post.findOneAndDelete({ postId: req.params.id })
//     .then((posts) =>
//       !posts
//         ? res.status(404).json({ message: "No user with post" })
//         : Thought.delete({ _id: { post } })
//     )
//     .then(() =>
//       res.json({ message: "User's associated post is deleted" })
//     )
//     .catch((err) => res.status(500).json(err));
// });

// //TODO: Admin user control
// //needs get and delete route
// router.get("/admin/username/:id", (req, res) => {
//     User.findOne({ id: req.params.uuid })
// .then((posts) =>
//   !posts
//     ? res.status(404).json({ message: "No user with that id" })
//     : res.json(posts)
// )
// .catch((err) => res.status(500).json(err));
// });
// router.delete("/admin/username/:id", (req, res) => {
//     User.findOneAndDelete({ postId: req.params.id })
//     .then((posts) =>
//       !posts
//         ? res.status(404).json({ message: "No user with user id" })
//         : Thought.delete({ id: {username} })
//     )
//     .then(() =>
//       res.json({ message: "User's associated post is deleted" })
//     )
//     .catch((err) => res.status(500).json(err));
// });
