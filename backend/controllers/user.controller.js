const db = require("../models");
const User = db.user
const Posts = db.posts
const Comments = db.comments
const Likes = db.likes
const Op = db.Sequelize.Op

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content")
}

exports.postsBoard = (req, res) => {
  res.status(200).send("+ Post")
}

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content")
}

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content")
}

//Voir tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
  const { firstName } = req.query
  let condition = firstName
    ? { firstName: { [Op.like]: `%${firstName}%` } }
    : null

  User.findAll({
    where: condition,
    include: [
      {
        model: Posts,
        include: [
          {
            model: Comments
          }
        ]
      }
    ]
  })
    .then(users => {
      const resObj = users.map(user => {
        return Object.assign(
          {},
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            description: user.description,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            posts: user.posts.map(post => {
              return Object.assign(
                {},
                {
                  postId: post.id,
                  userId: post.userId,
                  title: post.title,
                  likes: post.likes,
                  description: post.description,
                  image: post.image,
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  comments: post.comments.map(comment => {
                    return Object.assign(
                      {},
                      {
                        commentId: comment.id,
                        postId: comment.postId,
                        commentBody: comment.commentBody
                      }
                    )
                  })
                }
              )
            })
          }
        )
      })
      res.json(resObj)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Impossible de r??cup??rer les utilisateurs"
      })
    })
}

//Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
  const { id } = req.params

  User.destroy({
    where: { id: id }
  })
    .then(res => {
      res.send({
        message: "Utilisateur supprim??"
      })
    })
    .catch(err =>
      res
        .send({ message: "Impossible de supprimer cet utilisateur ", err: err.message })
    )
}

//Chercher un utilisateur
exports.getUser = (req, res, next) => {
  const { id } = req.params

  User.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Comments
      },
      {
        model: Likes
      }
    ]
  })
    .then(data => {
      res.send(data)
    })
    .catch(err =>
      res.status(500).send({
        message: "Impossible de r??cup??rer cet utilisateur avec l'id : " + id
      })
    )
}

//MAJ du profile de l'utilisateur
exports.updateUser = (req, res, next) => {
  const { id } = req.params

  if (req.file) {
    req.body.image = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`
  }
  User.findOne({ where: { id: id } })
    .then(() => {
      User.update(req.body, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            // ?? enlever et voir
            res.status(200).send({ message: "Utilisateur modifi?? avec succ??s" })
          } else {
            res.send({
              message: `Impossible de mofifier cet utilisateur n??${id}. Peut-??tre que cet utilisateur n"a pas ??t?? trouv?? dans la BDD.`
            })
          }
        })
        .catch(err =>
          res
            .status(500)
            .send({ message: err || "Impossible de modifier cet utilisateur" })
        )
    })
    .catch(err => res.send(err))
}


//Suppression de tous les utilisateurs
exports.deleteAll = (req, res, next) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} utilisateurs ont ??t?? supprim??s` })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Impossible de supprimer tous les utilisateurs"
      })
    })
}