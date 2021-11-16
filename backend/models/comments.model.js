module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
      commentBody: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
  
    return Comments;
  }