const db = require('../models')
const Post = db.posts
const User = db.user
const Like = db.likes
const fs = require('fs')

const Op = db.Sequelize.Op

//Création d'un post
exports.create = (req, res, next) => {
  const { title, description, userId } = req.body

  const image = `${req.protocol}://${req.get('host')}/images/${
    req.file.filename
  }`

  if (!title) {
    res.status(400).send({
      message: 'Le titre ne peut pas être vide!'
    })
    return
  }

  if (!description) {
    res.status(400).send({
      message: 'La description ne peut pas être vide!'
    })
    return
  }

  if (req.body.image) {
    res.status(200).send({
      message: 'Image bien envoyée !!'
    })
    return
  }

  const post = {
    title: title,
    description: description,
    image: image,
    userId: userId
  }

  //Sauvegarde du post
  Post.create(post)
    .then(post => {
      Post.findOne({
        where: {
          id: post.id
        },
        include: [
          {
            model: User
          }
        ]
      })
        .then(newPost => {
          res.status(200).send({
            message: 'Post bien crée',
            post: newPost
          })
        })
        .catch(err => res.send({ message: err }))
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Impossible de créer votre post.'
      })
    })
}

// Récupération de tous les posts 
exports.getAllPosts = (req, res, next) => {
  const title = req.query.title
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null

  Post.findAll({
    where: condition,
    order: [['id', 'DESC']],
    include: [
      {
        model: User,
        attributes: { exclude: ['password'] }
      },
      {
        model: Like,
        as: '_likes'
      }
    ]
  })
    .then(posts => {
      res.send(posts)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Impossible de récupérer les posts.'
      })
    })
}

exports.findOne = (req, res, next) => {
  const { id } = req.params
  const userId = req.userId

  Post.findOne({
    where: {
      id: id
    },

    include: [
      {
        model: User,
        as: 'user'
      },
      {
        model: Like,
        as: '_likes'
      }
    ]
  })
    .then(data => {
      Like.findOne({
        where: {
          postId: id,
          userId: userId
        }
      })
        .then(like => {
          data.likes = like
          res.send(data)
        })
        .catch(err => res.send(err))
    })
    .catch(err => {
      res.status(500).send({
        err: err.message,
        message: 'Impossible de récupérer ce post avec cet id: ' + id
      })
    })
}

//Récupération des posts par profil
exports.getPostsByProfile = (req, res, next) => {
  const userId = req.params.userId

  Post.findAll({ where: { userId } })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Impossible de récupérer les posts'
      })
    })
}

//Modifier un post avec son id
exports.update = (req, res, next) => {
  const { id } = req.params

  if (req.file) {
    req.body.image = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`
  }

  // const filename = req.body.image.split('/images/')[1]

  Post.findOne({ where: { id: id } }).then(() => {
    Post.update(req.body, {
      where: { id: id }
    })
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: 'Impossible de modifier le post avec cet id : ' + id,
          error: err
        })
      })
  })
}

//Supprimer un post avec son id

exports.delete = (req, res, next) => {
  const { id } = req.params

  Post.findOne({ where: { id: id } }).then(post => {
    const filename = post.image.split('/images/')[1]

    fs.unlink(`images/${filename}`, () => {
      Post.destroy({
        where: {
          id: id
        }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: 'Ce post a été supprimé avec succès'
            })
          } else {
            res.send({
              message: `Impossible de supprimer ce post avec l'id ${id}`
            })
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Impossible de supprimer ce post avec l'id :" + id || err
          })
        })
    })
  })
}

exports.deleteAll = (req, res, next) => {
  Post.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} posts ont été supprimés` })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Impossible de supprimer tous les posts'
      })
    })
}

//Liker un post

exports.postLike = async (req, res, next) => {
  const { postId, userId } = req.body

  const likeFound = await Like.findOne({
    where: {
      userId: userId,
      postId: postId
    }
  })

  if (!likeFound) {
    await Like.create({
      postId: postId,
      userId: userId
    })
      .then(() => {
        Post.increment('likes', {
          where: {
            id: postId
          }
        })
        res.json('Vous avez liké ce post')
      })
      .catch(err => res.send(err))
  } else {
    await Like.destroy({
      where: {
        postId: postId,
        userId: userId
      }
    })
      .then(() => {
        Post.decrement('likes', {
          where: {
            id: postId
          }
        })
        res.json('Vous avez retiré votre like')
      })
      .catch(err => res.send(err))
  }
}

exports.getLikesByPost = (req, res, next) => {
  const { postId } = req.params

  Like.findAll({ where: { postId: postId } })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Impossible de récupérer les likes sur ce post'
      })
    })
}