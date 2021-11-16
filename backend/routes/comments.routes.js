const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controller');
const { authJwt } = require('../middleware');

//Créer post
router.post("/", [authJwt.verifyToken], commentsController.createComment);

//Get all comments
router.get("/", [authJwt.verifyToken], commentsController.getAllComments)

//Récupérer les commentaires sur un post
router.get("/:postId",  [authJwt.verifyToken], commentsController.findComments);

//Récupérer un commentaire avec son id
router.get("/:postId/:id", [authJwt.verifyToken], commentsController.getCommentById)

//Supprimer un commentaire
router.delete('/:postId/:id', [authJwt.verifyToken], commentsController.deleteComment)

//Modifier un commentaire
router.put('/:postId/:id', [authJwt.verifyToken], commentsController.updateComment)

module.exports = router
