module.exports = (sequelize, Sequelize) => {
    const Posts = sequelize.define("post", {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      likes: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: 0
      }
    })
  
    return Posts;
  }