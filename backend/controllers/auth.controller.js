const jwt = require("jsonwebtoken"); // Permet un échange sécurisé de données entre deux parties
const bcrypt = require("bcrypt"); // Cryptage du MDP

const db = require("../models");
const User = db.user;
const Role = db.role;
const Comments = db.comments;
require("dotenv").config();

const Op = db.Sequelize.Op;

//Inscription
exports.signup = (req, res) => {
  const { firstName, lastName, username, email, password, roles } = req.body
  User.create({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 10)
  })
    .then(user => {
      if (roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "Utilisateur enregistré" })
          })
        })
      } else {
        //user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "Utilisateur enregistré" })
        })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

//Connexion
exports.signin = (req, res, next) => {
  User.findOne({
    where: {
      username: req.user.username
    },
    include: [
      {
        model: Comments
      }
    ]
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Utilisateur introuvable" })
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Mot de passe invalide"
        })
      }

      const token = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          image: user.image,
          description: user.description
        },
        "process.env.TOKEN",
        { expiresIn: 86400 } //24 heures
      )

      const authorities = []
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase())
        }
        res.status(200).send({
          id: user.id,
          roles: authorities,
          accessToken: token
        })
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
};