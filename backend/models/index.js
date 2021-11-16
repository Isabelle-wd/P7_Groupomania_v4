const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    //operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.role = require("../models/role.model")(sequelize, Sequelize);
db.posts = require('./posts.model')(sequelize, Sequelize);
db.comments = require('../models/comments.model')(sequelize, Sequelize);
db.likes = require('../models/like.model')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.posts.belongsTo(db.user, { 
  onDelete: 'CASCADE' 
});

db.comments.belongsTo(db.posts, { 
  onDelete: 'CASCADE' 
});

db.comments.belongsTo(db.user, { 
  onDelete: 'CASCADE' 
});

db.posts.hasMany(db.comments, {
  onDelete: 'CASCADE'
});

db.user.hasMany(db.posts, { 
  onDelete: 'CASCADE' 
});

db.user.hasMany(db.comments, { 
  onDelete: 'CASCADE' 
});

db.posts.hasMany(db.likes, {
  as: '_likes',
  onDelete: 'CASCADE'
});

db.user.hasMany(db.likes, { 
  onDelete: 'CASCADE' 
});

db.likes.belongsTo(db.user);
db.likes.belongsTo(db.posts);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
