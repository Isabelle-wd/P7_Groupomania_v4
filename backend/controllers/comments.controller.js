const db = require('../models')
const User = db.user
const posts = db.posts
const Comments = db.comments

const Op = db.sequelize.Op

exports.createComment = (req, res, next) => {
  const { commentBody, userId, postId } = req.body

  const comment = {
    commentBody: commentBody,
    userId: userId,
    postId: postId
  }

  Comments.create(comment)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err || 'Impossible de poster votre commentaire'
      })
    })
}

exports.findComments = (req, res, next) => {
  const { postId } = req.params

  Comments.findAll({
    where: {
      postId: postId
    },
    include: [
      {
        model: User
      }
    ]
  })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          'Impossible de récupérer les commentaires sur cet post: ' + postId
      })
    })
}

exports.getAllComments = (req, res, next) => {
  Comments.findAll({
    include: [
      {
        model: User
      }
    ]
  })
    .then(comments => {
      res.send(comments)
    })
    .catch(err => {
      res.status(500).send({
        error: err,
        message: 'Imopssible de récupérer tous les commentaires'
      })
    })
}

//get comment by id
exports.getCommentById = (req, res, next) => {
  const { id, postId } = req.params

  Comments.findAll({
    where: {
      postId: postId
    },
    include: [
      {
        model: User
      }
    ]
  })
    .then(() => {
      Comments.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: User
          }
        ]
      })
        .then(comment => {
          res.send(comment)
        })
        .catch(err => {
          res.send(err)
        })
    })
    .catch(err => {
      res.status(500).send({
        error: err,
        message: 'Impossible de récupérer ce commentaire'
      })
    })
}

//supprimer commentaire avec son id
exports.deleteComment = (req, res, next) => {
  const { id, postId } = req.params

  Comments.findAll({
    where: {
      postId: postId
    },
    include: [
      {
        model: User
      }
    ]
  })
    .then(() => {
      Comments.destroy({
        where: {
          id: id
        },
        include: [
          {
            model: User
          }
        ]
      })
        .then(num => {
          if (num == 1) {
            res.status(200).json({
              message: 'Commentaire supprimé avec succès'
            })
          } else {
            res.send({
              message:
                'Imposible de supprimer ce commentaire, peut-être a-t-il déjà été supprimé'
            })
          }
        })
        .catch(err => {
          res.send(err)
        })
    })
    .catch(err => {
      res.status(500).send({
        error: err,
        message: 'Impossible de supprimer ce commentaire'
      })
    })
}

//Modifier commentaire
exports.updateComment = (req, res, next) => {
  const { postId, id } = req.params

  Comments.findOne({
    where: {
      id: id,
      postId: postId
    },
    include: [
      {
        model: User
      }
    ]
  }).then(() => {
    Comments.update(req.body, {
      where: {
        postId: postId,
        id: id
      }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: 'Commentaire modifié avec succès',
            num: num
          })
        } else {
          res.send({
            message: 'Impossible de modifier ce commmentaire'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          message: 'Impossible de modifier ce commentaire',
          err: err
        })
      })
  })
}