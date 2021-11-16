const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const postController = require('../controllers/posts.controller')
const multer = require('../middleware/multer-config')

//Créer post
router.post("/", [authJwt.verifyToken], multer.post.single('image'), postController.create);
// multer.post.single('image')

//Récupérer tous les posts
router.get("/", [authJwt.verifyToken], postController.getAllPosts);

//Récupérer un seul post avec son id
router.get("/:id", [authJwt.verifyToken],  postController.findOne);

//Récupérer les posts par user
router.get("/user/:userId", [authJwt.verifyToken], postController.getPostsByProfile);

//Modifier un post avec son id
router.put("/:id",[authJwt.verifyToken], multer.post.single('image'), postController.update);

//Supprimer un post avec son id
router.delete("/:id",[authJwt.verifyToken], postController.delete);

//Supprimer tous les posts
router.delete("/",[authJwt.verifyToken], postController.deleteAll)

//Liker ou disliker un post
router.post('/like',[authJwt.verifyToken], postController.postLike)

//Get likes sur un post
router.get('/:postId/likes',[authJwt.verifyToken], postController.getLikesByPost)

module.exports = router